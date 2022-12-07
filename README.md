# Decentralized Lottery System

⚠️ **Currently not for use on the Ethereum mainnet or for anything involving REAL money** ⚠️

## Setup

Make sure that the [MetaMask](https://metamask.io/) browser extension is enabled. 

Update contract ABI and address in [contract.js](./src/assets/contract.js).

### On local system
- `npm install`
- `npm run start`

### Using Docker
- `docker-compose up -d`

Serves on port 3000 by default.

## Todo

- [ ] Await transaction status then trigger a re-render of UserPage component.
- [ ] Transaction status (success/revert) notification using MUI Snackbar component.
- [ ] Use of Chainlink VRF for fetching random numbers in smart contract.
- [ ] Use of secure modifiers such as non-reentrant in transacting functions.
