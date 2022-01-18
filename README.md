# ATX DAO NFT

### Test Contract

1. install deps via `yarn install`
1. install [forge](https://github.com/gakonst/foundry)
   - install [rust](https://www.rust-lang.org/tools/install) via `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
   - install `foundryup` via `curl https://raw.githubusercontent.com/gakonst/foundry/master/foundryup/install | bash`
   - `foundryup`
1. `forge test` in project directory

### Deploy Contract

```zsh
# v2
❯ hh deploy ATXDAONFT_V2 --network ropsten
deploy tx: {
  ...
}

# v1
❯ hh deploy ATXDAONFT --network ropsten
deploy tx: {
  ...
}
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

### Deployed Contracts

#### v1 contract

[contracts/ATXDAONFT.sol](contracts/ATXDAONFT.sol) is deployed on mainnet to [0xf61be28561137259375cbe88f28d4f163b09c94c](https://etherscan.io/address/0xf61be28561137259375cbe88f28d4f163b09c94c)

#### v2 contract

[contracts/ATXDAONFT_V2.sol](contracts/ATXDAONFT_V2.sol) is pending deployment to mainnet

### IPFS Metadata

- Genesis
  - metadata: `ipfs://QmRYkLgszoKpV15AUDcZJ82yL741pJRFSUogtNiUUF45S2`
  - image: `ipfs://QmUVHmfefWQ8eCcoTNnF8uLNh2vsQz4xcjVh4XSn56cLW1`
- Zilker (id 26-176)
  - metadata: `ipfs://QmQRFD3dSfNRDa7vvHwafwg4F6FUjA2NBjxBrGuPSrpKrV/26.json`
  - image: `ipfs://QmeJVHwX4fv6hiRWgM5YkyAstYWGgMkXxjxRxbBv8XTcPh/26.png`

### Hardhat tasks

#### Setup

compile contracts via `npx hardhat compile` to get gain access to tasks

#### Generate merkle tree

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

#### Genesis Owners

```sh
❯ hh get-nft-owners --network mainnet

25 found!
[
  '0x723960d9a5C6ab71853059861D1C6146770a6Dc1',
  '0x407Cf0e5Dd3C2c4bCE5a32B92109c2c6f7f1ce23',
  '0x6d7ddD863eB2Dad990bC05BDd3357E32850509E9',
  '0x9AfD4F7aD03A03d306B41a4604Ea2928cFf78fd1',
  '0x17AB342e3Bd3c080b4f48fe20165D5E94185EE2d',
  '0xf83b3A823653E8351b173Fa2Ae083Af37EAbCC01',
  '0xd8dA6D5d36B4477D6FC7dD4076432F2da1dBBAf8',
  '0xaB70496f3dbb814710B21bd843b3c2122398c1bB',
  '0xc928E72d304B77eA5727b242E4ba14eF57e3cD41',
  '0x5A17717abE73FEb3d4C4AAfD39B3CA5313cFB653',
  '0x982Efa073Aeebb95a0Cb7D025f002D9B56F66Bdb',
  '0x9Ca72f031f789f51bD35Cc34583c7B7A7D0871A3',
  '0xf4aF0941e0406F42839e7Bb1d565946bC2929336',
  '0x0e61990A3Ce86605d6ddD05D3e2219a032937e21',
  '0x30391A42bc626437dCeF38beca2d1E45ba8671dC',
  '0x51603C7059f369aB04B16AddFB7BB6c4e34b8523',
  '0x0c90D90f0d38c21ecB15d5Bd32B030977eeB2e31',
  '0x3F834b044A986E2dddBa273Ad835eF61C64C0151',
  '0x165bA5f0160DC28F27F140DF205B87b07A9646E3',
  '0x1A288d8152Ca5092eB06fE5c3d146d5Ce3b5790A',
  '0x3a66A63b68A6aA7F93b35d6a787570E94A09C60c',
  '0xcAC47a6670bE9d52ABF76E897c8C77C17F67A173',
  '0x21E7de94b1ed77463bCb488519fc98680ddE2251',
  '0xae72F470Da5446005c756B08D3e916f7EA8E9B72',
  '0x781198E9517C414b6d5BD84b99c82FE864da9998'
]
```
