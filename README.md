# Decentralized Lottery System

⚠️ **Not for use on ethereum mainnet or anything involving REAL money** ⚠️

## Setup

Make sure that the [MetaMask](https://metamask.io/) browser extension is enabled. 

Update contract ABI and address in [contract.js](./src/assets/contract.js).

### On local system
- `npm install`
- `npm run start`

### Using Docker
- Fill the details in [.env](./.env.example)
- `docker-compose up`

Serves on port 3000 by default.

## Todo

- [ ] Separate variables for valid input in ValdationTextField components. (button disabled = & of all)
- [ ] Await transaction status then trigger a re-render of UserPage component.
- [ ] Transaction status (success/revert) notification using MUI Snackbar component.
- [ ] Use of Chainlink VRF for fetching random numbers in smart contract.
- [ ] Use of secure modifiers such as non-reentrant in transacting functions.
