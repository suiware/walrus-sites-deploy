# Walrus Sites Deploy CLI

Walrus Sites deployment script which publishes/updates a folder on Walrus Sites.

Uses the tools provided by [Suibase](https://suibase.io), so no Walrus configs need to be added manually.

## Features

- Store the published site object ID in an environment file.
- Set the number of epochs for which the site is stored.
- Can swap SUI for 0.5 WAL to fund the deployment if necessary.
- Can override already deployed files if necessary.

## Prerequisites

- [Suibase](https://suibase.io/how-to/install.html)

## Usage

Make sure you started testnet or mainnet locally:
```bash
testnet start
# or
mainnet start
```

To get current deployer address:

```bash
tsui client active-address
# or
msui client active-address
```

To get current deployer address balance:

```bash
tsui client balance
# or
msui client balance
```

_Refer to the [Suibase docs](https://suibase.io/walrus.html) for more commands._

Finally, to deploy the site:

```bash
pnpx walrus-sites-deploy
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
| source | - | The folder to deploy to Walrus Sites | './dist' |
| --network | -n | Network to use (testnet or mainnet) | `testnet` |
| --site-object-id-file | -o | Path to the config file where the site object ID is stored. If this env file already has site object ID, the site is going to be updated on Walrus Sites. If not, once the site is published the first time, the site object ID gets written to the env file. The other environment variables in the file are preserved. | `./.env.local` |
| --epochs | -e | Number of epochs to store the files for. "max" means 53 epochs (2 years) | `1` |
| --buy-wal-before-run | -b | Buy WAL tokens before running the script. Currently 0.5 WAL. | `false` |
| --force-update | -f | Force update | `false` |

## Used by

- [Sui dApp Starter](https://sui-dapp-starter.dev/)

## Links

- [Suibase Walrus Documentation](https://suibase.io/walrus.html)
