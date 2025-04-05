#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { deploy } from './deployer'
import { _displaySuccessMessage, _getPackageMeta } from './utils'

/**
 * The script publishes to or updates the app on Walrus Sites.
 * After publishing the app, site object ID is copied to .env.local, which is used later to update the app on Walrus Sites.
 * See Configuration section below for more details.
 */

const main = async () => {
  const packageMeta = _getPackageMeta()

  const program = new Command()

  program
    .name(packageMeta.name)
    .description(packageMeta.description)
    .version(packageMeta.version)

  program
    .command('deploy <source>')
    .description(`Deploy a folder to Walrus Sites`)
    .option('-n, --network <network>', 'network to use', 'testnet')
    // .option('-v, --verbose', 'display logs')
    .action(async (source, options) => {
      // await deploy(source, options.network)
      
      _displaySuccessMessage(`The site has been deployed.`)
    })

  program.parse()
}


// Main entry point.
main().catch((e) => {
  console.error(chalk.red(e))
})
