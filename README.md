# ATX DAO NFT

### Test Contract

1. `cp .env.example .env` and set those environment variables
1. install deps via `yarn install`
1. install [forge](https://github.com/gakonst/foundry)
   - install [rust](https://www.rust-lang.org/tools/install) via
     `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
   - install `foundryup`: `curl https://raw.githubusercontent.com/gakonst/foundry/master/foundryup/install | bash`
   - run `foundryup`
1. `forge test` in project directory

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

[contracts/ATXDAONFT.sol](contracts/ATXDAONFT.sol) is deployed on mainnet to
[0xf61be28561137259375cbe88f28d4f163b09c94c](https://etherscan.io/address/0xf61be28561137259375cbe88f28d4f163b09c94c)

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

#### Deploy Contract

using `hh` from [hardhat-shorthand](https://hardhat.org/guides/shorthand.html).
install via `npm i -g hardhat-shorthand`

```zsh
❯ hh deploy ATXDAONFT_V2
deploying:  ATXDAONFT_V2
  network:  hardhat
 deployer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
 gasPrice:  1.875 gwei

deploy tx:  0x56be42f548a58259f5bed52f7a0f297771ff69386bd9d3c6b8b388ef4dc55214
  address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

```zsh
# use custom gas price
❯ hh gas-price --network ropsten
current gas price on ropsten is:
    17986498384 wei
    17.986498384 gwei

❯ hh deploy ATXDAONFT_V2 --network ropsten --gas-price 24986498384
deploying:  ATXDAONFT_V2
  network:  ropsten
 deployer:  0x51040CE6FC9b9C5Da69B044109f637dc997e92DE
 gasPrice:  24.986498384 gwei

deploy tx:  0x8148515e0013a6cb9c01863a09e61f5fc1ac79ffb08528342ee04771de0f7e00
  address:  0xe1e1561881aBa2cbb4D29Fa4e846C71CbD8073E4
```

#### Speical Mint

```zsh
# non-dynamic special mint for genesis members
❯ hh v2-special-mint --network local --token-uri ipfs://QmRYkLgszoKpV15AUDcZJ82yL741pJRFSUogtNiUUF45S2 0x610178dA211FEF7D417bC0e6FeD39F05609AD788 metadata/genesis/genesis-addresses.json

   running:  ATXDAONFT_V2.specialMint()
  contract:  0x610178dA211FEF7D417bC0e6FeD39F05609AD788
   network:  local
    signer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  tokenURI:  ipfs://QmRYkLgszoKpV15AUDcZJ82yL741pJRFSUogtNiUUF45S2
   dynamic:  false
  gasPrice:  1.083000606 gwei

recipients:  0x723960d9a5C6ab71853059861D1C6146770a6Dc1
             0x407Cf0e5Dd3C2c4bCE5a32B92109c2c6f7f1ce23
             0x6d7ddD863eB2Dad990bC05BDd3357E32850509E9
             0x9AfD4F7aD03A03d306B41a4604Ea2928cFf78fd1
             0x17AB342e3Bd3c080b4f48fe20165D5E94185EE2d
             0xf83b3A823653E8351b173Fa2Ae083Af37EAbCC01
             0xd8dA6D5d36B4477D6FC7dD4076432F2da1dBBAf8
             0xaB70496f3dbb814710B21bd843b3c2122398c1bB
             0xc928E72d304B77eA5727b242E4ba14eF57e3cD41
             0x5A17717abE73FEb3d4C4AAfD39B3CA5313cFB653
             0x982Efa073Aeebb95a0Cb7D025f002D9B56F66Bdb
             0x9Ca72f031f789f51bD35Cc34583c7B7A7D0871A3
             0xf4aF0941e0406F42839e7Bb1d565946bC2929336
             0x0e61990A3Ce86605d6ddD05D3e2219a032937e21
             0x30391A42bc626437dCeF38beca2d1E45ba8671dC
             0x51603C7059f369aB04B16AddFB7BB6c4e34b8523
             0x0c90D90f0d38c21ecB15d5Bd32B030977eeB2e31
             0x3F834b044A986E2dddBa273Ad835eF61C64C0151
             0x165bA5f0160DC28F27F140DF205B87b07A9646E3
             0x1A288d8152Ca5092eB06fE5c3d146d5Ce3b5790A
             0x3a66A63b68A6aA7F93b35d6a787570E94A09C60c
             0xcAC47a6670bE9d52ABF76E897c8C77C17F67A173
             0x21E7de94b1ed77463bCb488519fc98680ddE2251
             0xae72F470Da5446005c756B08D3e916f7EA8E9B72
             0x781198E9517C414b6d5BD84b99c82FE864da9998

  tx hash:   0x1d85f34dc05397a5be8ad6024a88b4b7f232bf83cf532ac8a0780fca0f71a43a
```

```zsh
# dynamic special mint from arg list
❯ hh v2-special-mint --network local --dynamic --token-uri ipfs://QmQRFD3dSfNRDa7vvHwafwg4F6FUjA2NBjxBrGuPSrpKrV/ 0x610178dA211FEF7D417bC0e6FeD39F05609AD788 metadata/genesis/genesis-active-contributors.json
   running:  ATXDAONFT_V2.specialMint()
  contract:  0x610178dA211FEF7D417bC0e6FeD39F05609AD788
   network:  local
    signer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  tokenURI:  ipfs://QmQRFD3dSfNRDa7vvHwafwg4F6FUjA2NBjxBrGuPSrpKrV/
   dynamic:  true
  gasPrice:  1.074432282 gwei

recipients:  0xf83b3A823653E8351b173Fa2Ae083Af37EAbCC01
             0x5A17717abE73FEb3d4C4AAfD39B3CA5313cFB653
             0xf4aF0941e0406F42839e7Bb1d565946bC2929336
             0x6d7ddD863eB2Dad990bC05BDd3357E32850509E9
             0x51603C7059f369aB04B16AddFB7BB6c4e34b8523
             0x30391A42bc626437dCeF38beca2d1E45ba8671dC
             0x0c90D90f0d38c21ecB15d5Bd32B030977eeB2e31
             0x9Ca72f031f789f51bD35Cc34583c7B7A7D0871A3
             0x165bA5f0160DC28F27F140DF205B87b07A9646E3
             0x781198E9517C414b6d5BD84b99c82FE864da9998
             0x9AfD4F7aD03A03d306B41a4604Ea2928cFf78fd1
             0x8B7D79a679c10bEd518fE905D764b4b7667f24de
             0x3F834b044A986E2dddBa273Ad835eF61C64C0151
             0x4C99C98c43c0dcB68B38fFd986BBf22B8844A329

  tx hash:   0xdb4d8108e35783fb3b0912c5a77612d6d371d418f40e67afa1c55041ac504fdb
```

```zsh
# non-dynamic special mint for genesis members
❯ hh v2-special-mint --network local --token-uri ipfs://QmRYkLgszoKpV15AUDcZJ82yL741pJRFSUogtNiUUF45S2 0x610178dA211FEF7D417bC0e6FeD39F05609AD788 metadata/genesis/genesis-addresses.json

   running:  ATXDAONFT_V2.specialMint()
  contract:  0x610178dA211FEF7D417bC0e6FeD39F05609AD788
   network:  local
    signer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  tokenURI:  ipfs://QmRYkLgszoKpV15AUDcZJ82yL741pJRFSUogtNiUUF45S2
   dynamic:  false
  gasPrice:  1.083000606 gwei

recipients:  0x723960d9a5C6ab71853059861D1C6146770a6Dc1
             0x407Cf0e5Dd3C2c4bCE5a32B92109c2c6f7f1ce23
             0x6d7ddD863eB2Dad990bC05BDd3357E32850509E9
             0x9AfD4F7aD03A03d306B41a4604Ea2928cFf78fd1
             0x17AB342e3Bd3c080b4f48fe20165D5E94185EE2d
             0xf83b3A823653E8351b173Fa2Ae083Af37EAbCC01
             0xd8dA6D5d36B4477D6FC7dD4076432F2da1dBBAf8
             0xaB70496f3dbb814710B21bd843b3c2122398c1bB
             0xc928E72d304B77eA5727b242E4ba14eF57e3cD41
             0x5A17717abE73FEb3d4C4AAfD39B3CA5313cFB653
             0x982Efa073Aeebb95a0Cb7D025f002D9B56F66Bdb
             0x9Ca72f031f789f51bD35Cc34583c7B7A7D0871A3
             0xf4aF0941e0406F42839e7Bb1d565946bC2929336
             0x0e61990A3Ce86605d6ddD05D3e2219a032937e21
             0x30391A42bc626437dCeF38beca2d1E45ba8671dC
             0x51603C7059f369aB04B16AddFB7BB6c4e34b8523
             0x0c90D90f0d38c21ecB15d5Bd32B030977eeB2e31
             0x3F834b044A986E2dddBa273Ad835eF61C64C0151
             0x165bA5f0160DC28F27F140DF205B87b07A9646E3
             0x1A288d8152Ca5092eB06fE5c3d146d5Ce3b5790A
             0x3a66A63b68A6aA7F93b35d6a787570E94A09C60c
             0xcAC47a6670bE9d52ABF76E897c8C77C17F67A173
             0x21E7de94b1ed77463bCb488519fc98680ddE2251
             0xae72F470Da5446005c756B08D3e916f7EA8E9B72
             0x781198E9517C414b6d5BD84b99c82FE864da9998

  tx hash:   0x1d85f34dc05397a5be8ad6024a88b4b7f232bf83cf532ac8a0780fca0f71a43a
```

```zsh
# dynamic special mint from arg list
❯ hh v2-special-mint --network local --dynamic --token-uri ipfs://QmQRFD3dSfNRDa7vvHwafwg4F6FUjA2NBjxBrGuPSrpKrV/ 0x610178dA211FEF7D417bC0e6FeD39F05609AD788 metadata/genesis/genesis-active-contributors.json
   running:  ATXDAONFT_V2.specialMint()
  contract:  0x610178dA211FEF7D417bC0e6FeD39F05609AD788
   network:  local
    signer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  tokenURI:  ipfs://QmQRFD3dSfNRDa7vvHwafwg4F6FUjA2NBjxBrGuPSrpKrV/
   dynamic:  true
  gasPrice:  1.074432282 gwei

recipients:  0xf83b3A823653E8351b173Fa2Ae083Af37EAbCC01
             0x5A17717abE73FEb3d4C4AAfD39B3CA5313cFB653
             0xf4aF0941e0406F42839e7Bb1d565946bC2929336
             0x6d7ddD863eB2Dad990bC05BDd3357E32850509E9
             0x51603C7059f369aB04B16AddFB7BB6c4e34b8523
             0x30391A42bc626437dCeF38beca2d1E45ba8671dC
             0x0c90D90f0d38c21ecB15d5Bd32B030977eeB2e31
             0x9Ca72f031f789f51bD35Cc34583c7B7A7D0871A3
             0x165bA5f0160DC28F27F140DF205B87b07A9646E3
             0x781198E9517C414b6d5BD84b99c82FE864da9998
             0x9AfD4F7aD03A03d306B41a4604Ea2928cFf78fd1
             0x8B7D79a679c10bEd518fE905D764b4b7667f24de
             0x3F834b044A986E2dddBa273Ad835eF61C64C0151
             0x4C99C98c43c0dcB68B38fFd986BBf22B8844A329

  tx hash:   0xdb4d8108e35783fb3b0912c5a77612d6d371d418f40e67afa1c55041ac504fdb
```

#### List v2 NFTs

```zsh
❯ hh v2-list-nfts --network local 0x610178dA211FEF7D417bC0e6FeD39F05609AD788
   network:  local
  contract:  0x610178dA211FEF7D417bC0e6FeD39F05609AD788

[
    {
        "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "uri": "ipfs://testing1.json"
    },
    {
        "owner": "0xD9A0b5DeB62600C19922E912bF236e64919EE65F",
        "uri": "ipfs://testing2.json"
    },
    ...
]
```

#### Generate merkle tree

You can generate a merkle root + proof with the `merkle-tree` task. Here's an
example passing is 0x1, 0x2, and 0x3 as whitelisted addresses. It generates the
merkle root for the set of addresses and the proof for 0x3

```zsh
# generate a merkle tree for 3 addresses and save proofs to a json file
❯ hh merkle-tree 0x0000000000000000000000000000000000000001 0x0000000000000000000000000000000000000002 0x0000000000000000000000000000000000000003 --all-proofs > foo.json
0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
└─ 344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
   ├─ f95c14e6953c95195639e8266ab1a6850864d59a829da9f9b13602ee522f672b
   │  ├─ 1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d
   │  └─ d52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62
   └─ 5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9
      └─ 5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9

❯ cat foo.json
{
    "root": "0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a",
    "proofs": {
        "0x0000000000000000000000000000000000000001": [
            "0xd52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62",
            "0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9"
        ],
        "0x0000000000000000000000000000000000000002": [
            "0x1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d",
            "0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9"
        ],
        "0x0000000000000000000000000000000000000003": [
            "0xf95c14e6953c95195639e8266ab1a6850864d59a829da9f9b13602ee522f672b"
        ]
    }
}
```

```zsh
❯ hh merkle-tree 0x0000000000000000000000000000000000000001 0x0000000000000000000000000000000000000002 0x0000000000000000000000000000000000000003 --all-proofs > foo.json
0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
└─ 344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
   ├─ f95c14e6953c95195639e8266ab1a6850864d59a829da9f9b13602ee522f672b
   │  ├─ 1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d
   │  └─ d52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62
   └─ 5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9
      └─ 5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9

❯ cat foo.json
{
    "root": "0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a",
    "proofs": {
        "0x0000000000000000000000000000000000000001": [
            "0xd52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62",
            "0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9"
        ],
        "0x0000000000000000000000000000000000000002": [
            "0x1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d",
            "0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9"
        ],
        "0x0000000000000000000000000000000000000003": [
            "0xf95c14e6953c95195639e8266ab1a6850864d59a829da9f9b13602ee522f672b"
        ]
    }
}
```

```zsh
# generate merkle proofs from a json file (array of addresses)
❯ hh merkle-tree metadata/genesis/genesis-addresses.json --all-proofs > foo.json
0x27e68b6ddb91ca77c7745c4f2c8818c429271509b6581022b7b4cda43bfd1961
└─ 27e68b6ddb91ca77c7745c4f2c8818c429271509b6581022b7b4cda43bfd1961
   ├─ 30a9a118714e761709addd65e77b161a78508e47cdfdfce21e94635e4a02e191
   │  ├─ dd94ab148b3377d4458d70f0272fa569965a3cfffc2e4129a41ee2d9e13e9929
   │  │  ├─ 86653dcfae3b440330533d44b6800a81346aeabfb6035273d92505c2c92a631f
   │  │  │  ├─ 3eb6a9cd381086b3e940555925de15bd1ffe7f99c35ed1e31bc40d1f54b19449
   │  │  │  │  ├─ c60d8441570138042140ea38cdda18b1f8dda73b3e9aeb51576f7d6cd90c529f
...
```

```zsh
# generate merkle tree and proof for a particular address
❯ hh merkle-tree 0x0000000000000000000000000000000000000001 0x0000000000000000000000000000000000000002 0x0000000000000000000000000000000000000003 --proof-for 0x0000000000000000000000000000000000000002
0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
└─ 344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
   ├─ f95c14e6953c95195639e8266ab1a6850864d59a829da9f9b13602ee522f672b
   │  ├─ 1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d
   │  └─ d52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62
   └─ 5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9
      └─ 5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9

 root:  0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a
proof:
[
  '0x1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d',
  '0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9'
]
```

#### Genesis Owners

```sh
❯ hh get-nft-owners --network mainnet

25 found!
[
    "0x723960d9a5C6ab71853059861D1C6146770a6Dc1",
    "0x407Cf0e5Dd3C2c4bCE5a32B92109c2c6f7f1ce23",
    "0x6d7ddD863eB2Dad990bC05BDd3357E32850509E9",
    "0x9AfD4F7aD03A03d306B41a4604Ea2928cFf78fd1",
    "0x17AB342e3Bd3c080b4f48fe20165D5E94185EE2d",
    "0xf83b3A823653E8351b173Fa2Ae083Af37EAbCC01",
    "0xd8dA6D5d36B4477D6FC7dD4076432F2da1dBBAf8",
    "0xaB70496f3dbb814710B21bd843b3c2122398c1bB",
    "0xc928E72d304B77eA5727b242E4ba14eF57e3cD41",
    "0x5A17717abE73FEb3d4C4AAfD39B3CA5313cFB653",
    "0x982Efa073Aeebb95a0Cb7D025f002D9B56F66Bdb",
    "0x9Ca72f031f789f51bD35Cc34583c7B7A7D0871A3",
    "0xf4aF0941e0406F42839e7Bb1d565946bC2929336",
    "0x0e61990A3Ce86605d6ddD05D3e2219a032937e21",
    "0x30391A42bc626437dCeF38beca2d1E45ba8671dC",
    "0x51603C7059f369aB04B16AddFB7BB6c4e34b8523",
    "0x0c90D90f0d38c21ecB15d5Bd32B030977eeB2e31",
    "0x3F834b044A986E2dddBa273Ad835eF61C64C0151",
    "0x165bA5f0160DC28F27F140DF205B87b07A9646E3",
    "0x1A288d8152Ca5092eB06fE5c3d146d5Ce3b5790A",
    "0x3a66A63b68A6aA7F93b35d6a787570E94A09C60c",
    "0xcAC47a6670bE9d52ABF76E897c8C77C17F67A173",
    "0x21E7de94b1ed77463bCb488519fc98680ddE2251",
    "0xae72F470Da5446005c756B08D3e916f7EA8E9B72",
    "0x781198E9517C414b6d5BD84b99c82FE864da9998"
]
```
