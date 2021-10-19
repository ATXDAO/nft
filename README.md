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

```
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS
```
