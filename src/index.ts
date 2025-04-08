#!/usr/bin/env node

import { Command } from 'commander'
import { deploy } from './deploy'
import { getPackageMeta } from './utils'

const main = async () => {
  const packageMeta = getPackageMeta()

  const program = new Command()

  program
    .name(packageMeta.name)
    .description(packageMeta.description)
    .version(packageMeta.version)

  program
    .command('deploy [source]', { isDefault: true })
    .description(`Deploys a folder to Walrus Sites`)
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
    })

  program.parse()
}

// Main entry point.
main().catch((e) => {
  console.error(e)
})
