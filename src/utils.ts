import chalk from 'chalk'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export const getCliDirectory = () => {
  const currentFileUrl = import.meta.url
  return path.dirname(decodeURI(fileURLToPath(currentFileUrl)))
}

export const getPackageMeta = () => {
  try {
    const packageFile = readFileSync(
      path.join(getCliDirectory(), '/package.json'),
      'utf8'
    )
    return JSON.parse(packageFile)
  } catch (e) {
    displayErrorMessage(`Cannot read package meta-data.`)
    console.error(e)
    process.exit(1)
  }
}

export const displayErrorMessage = (message: string) => {
  console.error(chalk.red(message))
}

export const displaySuccessMessage = (message: string) => {
  console.log(chalk.green(message))
}
