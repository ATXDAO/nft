### How To Mint NFT

In `/scripts/mint-nft.js`, do the following:

Update `mintNFT` function call param to use correct NFT metadata JSON from IPS (end of file)

```zsh
node scripts/mint-nft.js
```

### Verify Contract

```
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```
