# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Local Blockchain

This project ships with a minimal [Hardhat](https://hardhat.org/) setup for
running a local Ethereum network. Start it in a separate terminal with:

```bash
pnpm hardhat:node
```

Then connect your browser wallet (e.g. MetaMask) to `http://127.0.0.1:8545` and
use the accounts provided by Hardhat for testing contract interactions.

The available Hardhat accounts can also be inspected through the API:

```bash
curl http://localhost:3000/api/wallets/hardhat
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
