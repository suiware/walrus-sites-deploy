import EnvFileWriter from 'env-file-rw'
import { exec, execSync } from 'node:child_process'
import { promises } from 'node:fs'
import path from 'node:path'

type Network = 'testnet' | 'mainnet'

const WALRUS_SITE_OBJECT_ID_VARIABLE_NAME_BASE = 'WALRUS_SITE_OBJECT_ID'

export const deploy = async (
  sourceFolder: string,
  network: Network,
  siteObjectIdFile: string,
  epochs: string,
  buyWalBeforeRun: boolean,
  forceUpdate: boolean
) => {
  if (buyWalBeforeRun) {
    buyWalTokenIfPossible(network)
  }

  const configFilePathFull = path.join(process.cwd(), siteObjectIdFile)
  const sitePathFull = path.join(process.cwd(), sourceFolder)

  await createFileIfNecessary(configFilePathFull)

  let siteObjectId = await readSiteObjectId(configFilePathFull, network)

  // If the site has not yet been published (no site object ID in the config),
  // then publish the site to Walrus Sites.
  if (siteObjectId == null) {
    console.log('Publishing the app to Walrus Sites...')
    const { stdout, stderr } = await exec(
      `${getWalrusSitesCli(network)} publish --epochs ${epochs} ${sitePathFull}`
    )

    // Get the site object ID from the publish command output.
    stdout!.on('data', async (data) => {
      console.log(data)

      const regex = /New site object ID: (.+)/
      const result = data.match(regex)

      // If the line doesn't have site object ID, ignore it.
      if (result == null) {
        return
      }

      siteObjectId = result[1].trim()

      // Save site object ID to the config file.
      await saveSiteObjectId(configFilePathFull, network, siteObjectId!)
    })

    stderr!.on('data', async (error) => {
      console.error(error)
      // Do not exit if it's a warning.
      // @todo: Find a better way to catch warnings, e.g. by severity level or error code.
      if (error.startsWith('[warn]')) {
        return
      }
      process.exit()
    })

    return
  }

  if (siteObjectId == null) {
    console.error(
      '~ The script could not find the site object ID in the output.'
    )
    console.error(
      '~ If you see it, please add WALRUS_SITE_OBJECT_ID=[site object ID from the output] into packages/frontend/.env.local manually.'
    )
    return
  }

  console.log('Updating the app on Walrus Sites...')
  execSync(
    `${getWalrusSitesCli(network)} update ${forceUpdate ? '--force' : ''} --epochs ${epochs} ${sitePathFull} ${siteObjectId}`,
    { stdio: 'inherit' }
  )
}

/**
 * Read Walrus site object ID from .env.local.
 *
 * @param {string} configFilePath
 * @param {string} network
 * @returns
 */
const readSiteObjectId = async (configFilePath: string, network: Network) => {
  const envFileWriter = new EnvFileWriter(configFilePath, false)
  await envFileWriter.parse()
  return envFileWriter.get(getWalrusObjectIdVariableName(network), null)
}

/**
 * Save Walrus site object ID t0.env.local.
 *
 * @param {string} configFilePath
 * @param {string} network
 * @param {string} siteObjectId
 * @returns
 */
const saveSiteObjectId = async (
  configFilePath: string,
  network: Network,
  siteObjectId: string
) => {
  await setEnvVar(
    configFilePath,
    getWalrusObjectIdVariableName(network),
    siteObjectId
  )
}

/**
 * Create a file if it doesn't exist.
 *
 * @param {string} filePath
 * @returns
 */
const createFileIfNecessary = async (filePath: string) => {
  try {
    await promises.writeFile(filePath, '', { flag: 'wx' })
  } catch {}
}

/**
 * Set the environment variable in the .env.local file.
 *
 * @param {string} envFilePath
 * @param {string} name
 * @param {string} value
 * @returns
 */
const setEnvVar = async (envFilePath: string, name: string, value: string) => {
  const envFileWriter = new EnvFileWriter(envFilePath, false)
  await envFileWriter.parse()
  envFileWriter.set(name, value)
  await envFileWriter.save()
}

const buyWalTokenIfPossible = (network: Network) => {
  try {
    console.log('Buying WAL coins...')
    execSync(`${getWalrusCli(network)} get-wal`, {
      stdio: 'inherit',
    })
  } catch (e) {
    console.warn(e)
  }
}

const getWalrusCli = (network: Network) => {
  return network === 'mainnet' ? 'mwalrus' : 'twalrus'
}
const getWalrusSitesCli = (network: Network) => {
  return network === 'mainnet' ? 'msite' : 'tsite'
}

const getWalrusObjectIdVariableName = (network: Network) => {
  return `${WALRUS_SITE_OBJECT_ID_VARIABLE_NAME_BASE}_${network.toUpperCase()}`
}
