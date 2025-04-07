#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { deploy } from './deploy'
import { displaySuccessMessage, getPackageMeta } from './utils'

/**
 * The script publishes to or updates the app on Walrus Sites.
 * After publishing the app, site object ID is copied to .env.local, which is used later to update the app on Walrus Sites.
 * See Configuration section below for more details.
 */

const main = async () => {
  const packageMeta = getPackageMeta()

  const program = new Command()

  program
    .name(packageMeta.name)
    .description(packageMeta.description)
    .version(packageMeta.version)

  program
    .command('deploy [source]', { isDefault: true })
    .description(`Deploy a folder to Walrus Sites`)
    .option(
      '-n, --network [network]',
      'network to use (testnet or mainnet)',
      'testnet'
    )
    .option(
      '-o, --site-object-id-file [siteObjectIdFile]',
      'path to the config file where the site object ID is stored',
      './.env.local'
    )
    .option(
      '-e, --epochs [epochs]',
      'number of epochs to store the files for. "max" means 53 epochs or (2 years).',
      '1'
    )
    .option(
      '-b, --buy-wal-before-run [true]',
      'buy WAL tokens before running the script. currently 0.5 WAL.'
    )
    .option('-f, --force-update [true]', 'force update')

    // .option('-v, --verbose', 'display logs')
    .action(async (source, options) => {
      await deploy(
        source,
        options.network,
        options.siteObjectIdFile,
        options.epochs,
        options?.buyWalBeforeRun || false,
        options?.forceUpdate || false
      )

      displaySuccessMessage(`The site has been deployed.`)
    })

  program.parse()
}

// Main entry point.
main().catch((e) => {
  console.error(chalk.red(e))
})
