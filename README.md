# ATX DAO NFT

### Test Contract

1. install deps via `yarn install`
1. install [forge](https://github.com/gakonst/foundry)
   - install [rust](https://www.rust-lang.org/tools/install) via `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
   - install `foundryup` via `curl https://raw.githubusercontent.com/gakonst/foundry/master/foundryup/install | bash`
   - `foundryup`
1. `forge test` in project directory

### Generate merkle tree

You can generate a merkle root + proof with the `merkle-tree` task. Here's an
example passing is 0x1, 0x2, and 0x3 as whitelisted addresses. It generates the
merkle root for the set of addresses and the proof for 0x3

```zsh
❯ hardhat merkle-tree \
  0x0000000000000000000000000000000000000001 \
  0x0000000000000000000000000000000000000002 \
  0x0000000000000000000000000000000000000003 \
  --claim 0x0000000000000000000000000000000000000003
0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
└─ 344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
   ├─ f95c14e6953c95195639e8266ab1a6850864d59a829da9f9b13602ee522f672b
   │  ├─ 1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d
   │  └─ d52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62
   └─ 5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9
      └─ 5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9

proof:
[
  '0xf95c14e6953c95195639e8266ab1a6850864d59a829da9f9b13602ee522f672b'
]
root: 0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
```

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
