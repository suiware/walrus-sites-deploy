# Walrus Sites Deploy CLI

**The project is under development, so avoid using it in production until further notice.**

## Prerequisites

- [Suibase](https://suibase.io)

## Usage

```bash
pnpx walrus-sites-deploy  ./dist
pnpx walrus-sites-deploy  ./dist -n testnet
pnpx walrus-sites-deploy  ./dist -n testnet -o ./.env.local
pnpx walrus-sites-deploy  ./dist -n testnet -o ./.env.local -e 1
pnpx walrus-sites-deploy  ./dist -n testnet -o ./.env.local -e 1 -b
pnpx walrus-sites-deploy  ./dist -n testnet -o ./.env.local -e 1 -b -f
```
