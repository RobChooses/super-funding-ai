# 🤖 SUPER FUNDING-AI

💰 Project Entry to ETHGlobal Superhack 2024

## Description of Project

SUPER FUNDING-AI allows anyone on Celo Minipay app to raise funding for investment, particularly first-time entrepreneurs, people seeking microfunding, and even web3 DAO treasuries. A problem for many of these groups is a lack of track record and investment history, and investors are wary of putting funds into projects in one go. SUPER Funding-AI allows investment to be split into stages with funds released upon conditions being met. To avoid any bias, these conditions are verified using an AI LLM which makes attestations on-chain wia EAS.

## Superhack partner technologies used

* Celo Minipay
* EAS
* Blockscout

## Requirements
 
Copy `packages/react-app/.env.template` and enter the values for

```
WC_PROJECT_ID=
OPENAI_API_KEY=
TAVILY_API_KEY=
NEXT_PUBLIC_ALCHEMY_API_KEY=
ETH_KEY=
```

## Run

In `packages/react-app`, run `yarn install` then `yarn dev`

# Application Setup & Installation

```bash
yarn
```

Run `yarn` or `npm install` to install all the required dependencies to run the dApp.

> React + Tailwind CSS Template does not have any dependency on hardhat and truffle.
> This starterkit does not include connection of Hardhat/Truffle with ReactJS. It's up to the user to integrate smart contract with ReactJS. This gives user more flexibily over the dApp.

-   To start the dApp, run the following command.

```bash
yarn react-dev
```

## Dependencies

### Default

-   [Next.js](https://nextjs.org/) app framework
-   [TailwindCSS](https://tailwindcss.com/) for UI
-   [rainbowkit-celo](https://www.npmjs.com/package/@celo/rainbowkit-celo), a plugin to help rainbowkit developers support the CELO protocol faster.

## Architecture

-   `/pages` includes the main application components (specifically `index.tsx` and `_app.tsx`)
    -   `_app.tsx` includes configuration
    -   `index.tsx` is the main page of the application
-   `/components` includes components that are rendered in `index.tsx`
-   `/public` includes static files
