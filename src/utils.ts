import chalk from 'chalk'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export const _getCliDirectory = () => {
  const currentFileUrl = import.meta.url
  return path.dirname(decodeURI(fileURLToPath(currentFileUrl)))
}

export const _getPackageMeta = () => {
  try {
    const packageFile = readFileSync(
      path.join(_getCliDirectory(), '/package.json'),
      'utf8'
    )
    return JSON.parse(packageFile)
  } catch (e) {
    _displayErrorMessage(`Cannot read package meta-data.`)
    console.error(e)
    process.exit(1)
  }
}

export const _displayErrorMessage = (message: string) => {
  console.error(chalk.red(message))
}

export const _displaySuccessMessage = (message: string) => {
  console.log(chalk.green(message))
}
