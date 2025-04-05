#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

const REPORT_ISSUE_URL =
  'https://github.com/suiware/walrus-sites-deploy/issues/new'

const main = async () => {
  const packageMeta = _getPackageMeta()

  const program = new Command()

  program
    .name(packageMeta.name)
    .description(packageMeta.description)
    .version(packageMeta.version)

  program
    .command('start')
    .description(`Start ${packageMeta.name}`)
    .option('-v, --verbose', 'display logs')
    .action((options) => {
      _displaySuccessMessage(`The site has been deployed.`)
    })

  program.parse()
}

const _getCliDirectory = () => {
  const currentFileUrl = import.meta.url
  return path.dirname(decodeURI(fileURLToPath(currentFileUrl)))
}

const _getPackageMeta = () => {
  try {
    const packageFile = readFileSync(
      path.join(_getCliDirectory(), '/package.json'),
      'utf8'
    )
    return JSON.parse(packageFile)
  } catch (e) {
    _displayErrorMessage(
      `Cannot read package meta-data. Please report the issue ${REPORT_ISSUE_URL}`
    )
    console.error(e)
    process.exit(1)
  }
}

const _displayErrorMessage = (message: string) => {
  console.error(chalk.red(message))
}

const _displaySuccessMessage = (message: string) => {
  console.log(chalk.green(message))
}

// Main entry point.
main().catch((e) => {
  console.error(chalk.red(e))
})
