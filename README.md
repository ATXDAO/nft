# ATX DAO NFT

### Test Contract

1. install deps via `yarn install`
1. install [forge](https://github.com/gakonst/foundry) via [forgeup](https://github.com/transmissions11/forgeup)
1. `forge test`

### Deploy Contract

```zsh
npx hardhat run --network ropsten scripts/deploy.js
```

### Verify Contract

Ropsten

```zsh
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS
```

Mainnet:

```zsh
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS
```
