# Walrus Sites Deploy CLI

**The project is under development, so avoid using it in production until further notice.**

Walrus Sites deployment script which publishes/updates a folder to Walrus Sites.

## Features

- Store the published site object ID is in an environment file.
- Set the number of epoch for which the site is stored.
- Can swap SUI for 0.5 WAL before run to fund the deployment if necessary.
- Can override already deployed files if necessary.

## Prerequisites

- [Suibase](https://suibase.io)

## Usage

```bash
pnpx walrus-sites-deploy ./dist
pnpx walrus-sites-deploy ./dist -n testnet
pnpx walrus-sites-deploy ./dist -n testnet -o ./.env.local
pnpx walrus-sites-deploy ./dist -n testnet -o ./.env.local -e 1
pnpx walrus-sites-deploy ./dist -n testnet -o ./.env.local -e 1 -b
pnpx walrus-sites-deploy ./dist -n testnet -o ./.env.local -e 1 -b -f
```

## Parameters

| Parameter | Shorthand | Description | Default Value |
|-----------|-----------|-------------|---------------|
| source | - | The folder to deploy to Walrus Sites | Required |
| --network | -n | Network to use (testnet or mainnet) | `testnet` |
| --site-object-id-file | -o | Path to the config file where the site object ID is stored. If this env file already has site object ID, the site is going to be updated on Walrus Sites. If not, once the site is published the first time, the site object ID gets written to the env file. The other environment variables in the file are preserved. | `./.env.local` |
| --epochs | -e | Number of epochs to store the files for. "max" means 53 epochs (2 years) | `1` |
| --buy-wal-before-run | -b | Buy WAL tokens before running the script. Currently 0.5 WAL. | `false` |
| --force-update | -f | Force update | `false` |

## Used by

- [Sui dApp Starter](https://sui-dapp-starter.dev/)
