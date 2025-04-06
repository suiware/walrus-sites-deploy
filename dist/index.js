#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import EnvFileWriter from 'env-file-rw';
import { exec, execSync } from 'node:child_process';
import { promises } from 'node:fs';
import path from 'node:path';
import { readFileSync } from 'fs';
import path2 from 'path';
import { fileURLToPath } from 'url';

var WALRUS_SITE_OBJECT_ID_VARIABLE_NAME_BASE = "WALRUS_SITE_OBJECT_ID";
var deploy = async (sourceFolder, network, siteObjectIdFile, epochs, buyWalBeforeRun, forceUpdate) => {
  if (buyWalBeforeRun) {
    buyWalTokenIfPossible(network);
  }
  const configFilePathFull = path.join(process.cwd(), siteObjectIdFile);
  const sitePathFull = path.join(process.cwd(), sourceFolder);
  await createFileIfNecessary(configFilePathFull);
  let siteObjectId = await readSiteObjectId(configFilePathFull, network);
  if (siteObjectId == null) {
    console.log("Publishing the app to Walrus Sites...");
    const { stdout, stderr } = await exec(
      `${getWalrusSitesCli(network)} publish --epochs ${epochs} ${sitePathFull}`
    );
    stdout.on("data", async (data) => {
      console.log(data);
      const regex = /New site object ID: (.+)/;
      const result = data.match(regex);
      if (result == null) {
        return;
      }
      siteObjectId = result[1].trim();
      await saveSiteObjectId(configFilePathFull, network, siteObjectId);
    });
    stderr.on("data", async (error) => {
      console.error(error);
      if (error.startsWith("[warn]")) {
        return;
      }
      process.exit();
    });
    return;
  }
  if (siteObjectId == null) {
    console.error(
      "~ The script could not find the site object ID in the output."
    );
    console.error(
      "~ If you see it, please add WALRUS_SITE_OBJECT_ID=[site object ID from the output] into packages/frontend/.env.local manually."
    );
    return;
  }
  console.log("Updating the app on Walrus Sites...");
  execSync(
    `${getWalrusSitesCli(network)} update ${forceUpdate ? "--force" : ""} --epochs ${epochs} ${sitePathFull} ${siteObjectId}`,
    { stdio: "inherit" }
  );
};
var readSiteObjectId = async (configFilePath, network) => {
  const envFileWriter = new EnvFileWriter(configFilePath, false);
  await envFileWriter.parse();
  return envFileWriter.get(getWalrusObjectIdVariableName(network), null);
};
var saveSiteObjectId = async (configFilePath, network, siteObjectId) => {
  await setEnvVar(
    configFilePath,
    getWalrusObjectIdVariableName(network),
    siteObjectId
  );
};
var createFileIfNecessary = async (filePath) => {
  try {
    await promises.writeFile(filePath, "", { flag: "wx" });
  } catch {
  }
};
var setEnvVar = async (envFilePath, name, value) => {
  const envFileWriter = new EnvFileWriter(envFilePath, false);
  await envFileWriter.parse();
  envFileWriter.set(name, value);
  await envFileWriter.save();
};
var buyWalTokenIfPossible = (network) => {
  try {
    console.log("Buying WAL coins...");
    execSync(`${getWalrusCli(network)} get-wal`, {
      stdio: "inherit"
    });
  } catch (e) {
    console.warn(e);
  }
};
var getWalrusCli = (network) => {
  return network === "mainnet" ? "mwalrus" : "twalrus";
};
var getWalrusSitesCli = (network) => {
  return network === "mainnet" ? "msite" : "tsite";
};
var getWalrusObjectIdVariableName = (network) => {
  return `${WALRUS_SITE_OBJECT_ID_VARIABLE_NAME_BASE}_${network.toUpperCase()}`;
};
var getCliDirectory = () => {
  const currentFileUrl = import.meta.url;
  return path2.dirname(decodeURI(fileURLToPath(currentFileUrl)));
};
var getPackageMeta = () => {
  try {
    const packageFile = readFileSync(
      path2.join(getCliDirectory(), "/package.json"),
      "utf8"
    );
    return JSON.parse(packageFile);
  } catch (e) {
    displayErrorMessage(`Cannot read package meta-data.`);
    console.error(e);
    process.exit(1);
  }
};
var displayErrorMessage = (message) => {
  console.error(chalk.red(message));
};
var displaySuccessMessage = (message) => {
  console.log(chalk.green(message));
};

// src/index.ts
var main = async () => {
  const packageMeta = getPackageMeta();
  const program = new Command();
  program.name(packageMeta.name).description(packageMeta.description).version(packageMeta.version);
  program.command("deploy <source>", { isDefault: true }).description(`Deploy a folder to Walrus Sites`).option("-n, --network [network]", "network to use (testnet or mainnet)", "testnet").option(
    "-o, --site-object-id-file [siteObjectIdFile]",
    "path to the config file where the site object ID is stored",
    "./.env.local"
  ).option(
    "-e, --epochs [epochs]",
    'number of epochs to store the files for. "max" means 53 epochs or (2 years).',
    "1"
  ).option(
    "-b, --buy-wal-before-run [true]",
    "buy WAL tokens before running the script. currently 0.5 WAL."
  ).option(
    "-f, --force-update [true]",
    "force update"
  ).action(async (source, options) => {
    await deploy(
      source,
      options.network,
      options.siteObjectIdFile,
      options.epochs,
      options?.buyWalBeforeRun || false,
      options?.forceUpdate || false
    );
    displaySuccessMessage(`The site has been deployed.`);
  });
  program.parse();
};
main().catch((e) => {
  console.error(chalk.red(e));
});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map