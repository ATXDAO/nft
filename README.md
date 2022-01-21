# ATX DAO NFT

## Metadata

### IPFS Metadata

- Genesis
  - original
    - metadata: `ipfs://QmRYkLgszoKpV15AUDcZJ82yL741pJRFSUogtNiUUF45S2`
    - image (all): `ipfs://QmUVHmfefWQ8eCcoTNnF8uLNh2vsQz4xcjVh4XSn56cLW1`
  - v2
    - metadata: `ipfs://QmZXEgrU7oXEHSJsgdiTJK13a8K9YsaZ5PsRR54BAXrGWU/genesis.json`
    - image (all): `ipfs://QmcWLJWwLMG3kNTYvKUw4TZeMQDVvmyBwMt2iV9YFaSbia/genesis.png`
- Zilker (id 26-176)
  - metadata
    - root: `ipfs://QmYVgQoE74xp5TigTe1EC9vDQw7tx39t3U9ySTaNHa7CdV/`
    - ex (id 26): `ipfs://QmYVgQoE74xp5TigTe1EC9vDQw7tx39t3U9ySTaNHa7CdV/26.json`
  - image (id 26): `ipfs://QmQkvjEARKXL41vXtP1m1ws2jnEefJNB743NoTyGHJ1Y27/26.png`

### Deployed Contracts

#### [v1 contract](contracts/ATXDAONFT.sol)

- mainnet [0xf61be28561137259375cbe88f28d4f163b09c94c](https://etherscan.io/address/0xf61be28561137259375cbe88f28d4f163b09c94c)

#### [v2 contract](contracts/ATXDAONFT_V2.sol)

- mainnet: [0x63f8F23ce0f3648097447622209E95A391c44b00](https://etherscan.io/address/0x63f8F23ce0f3648097447622209E95A391c44b00)
- ropsten: [0xc38D8Da0c1cA6314474a3442103F543551f0F177](https://ropsten.etherscan.io/address/0xc38D8Da0c1cA6314474a3442103F543551f0F177#readContract)
- rinkeby: [0x683d067d5cA4158271A6c79BBaFDDb05a698D2b4](https://rinkeby.etherscan.io/address/0x683d067d5cA4158271A6c79BBaFDDb05a698D2b4)

## Setup

1. `cp .env.example .env` and set those environment variables
1. install deps via `yarn install`
1. `npm i -g hardhat-shorthand` to install `hh`
1. compile contracts for hardhat tasks `hh compile`

## Testing

1. install [forge](https://github.com/gakonst/foundry)
   - install [rust](https://www.rust-lang.org/tools/install) via
     `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
   - install `foundryup`: `curl https://raw.githubusercontent.com/gakonst/foundry/master/foundryup/install | bash`
   - run `foundryup`
1. `yarn test` in project directory

```zsh
❯ yarn test
yarn run v1.22.17
$ forge clean && forge test -vv && forge clean
compiling...
success.
Running 13 tests for ATXDAONFTV2Test.json:ATXDAONFTV2Test
[PASS] testFailMintSpecial() (gas: 123731)
[PASS] testMintBasic() (gas: 309238)
[PASS] testMintRequireEth() (gas: 48988)
[PASS] testMintRequireMintable() (gas: 63393)
[PASS] testMintRequireNotHolder() (gas: 197875)
[PASS] testMintRequireWhitelistInvalidProof() (gas: 46408)
[PASS] testMintRequireWhitelistRandom(address) (runs: 256, μ: 46959, ~: 46958)
[PASS] testMintSpecialDynamic() (gas: 341272)
[PASS] testMintSpecialStatic() (gas: 333388)
[PASS] testMintTransfers() (gas: 231086)
[PASS] testOnlyOwner() (gas: 18788)
[PASS] testResetHasMinted() (gas: 331864)
[PASS] testSweepEth() (gas: 333857)
```

## Hardhat tasks

### Verify Contract

```zsh
❯ hh verify --contract contracts/ATXDAONFT_V2.sol:ATXDAONFT_V2 --network ropsten 0xe1e1561881aba2cbb4d29fa4e846c71cbd8073e4
Nothing to compile
No need to generate any newer typings.
Compiling 1 file with 0.8.9
Successfully submitted source code for contract
contracts/ATXDAONFT_V2.sol:ATXDAONFT_V2 at 0xe1e1561881aba2cbb4d29fa4e846c71cbd8073e4
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ATXDAONFT_V2 on Etherscan.
https://ropsten.etherscan.io/address/0xe1e1561881aba2cbb4d29fa4e846c71cbd8073e4#code
```

### Deploy Contract

```zsh
❯ hh deploy --network hardhat
deploying:  ATXDAONFT_V2
  network:  hardhat
 deployer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
 gasPrice:  1.875 gwei

deploy tx:  0x56be42f548a58259f5bed52f7a0f297771ff69386bd9d3c6b8b388ef4dc55214
  address:  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

```zsh
# use custom gas price
❯ hh gas-price --network mainnet
gas price on mainnet

 current  61692625904 wei
          61.692625904 gwei
    slow  61000000000 wei
          61.0 gwei
standard  61000000000 wei
          61.0 gwei
    fast  61000000000 wei
          61.0 gwei
   rapid  65982650839 wei
          65.982650839 gwei

❯ hh deploy --network ropsten --gas-price 24986498384
deploying:  ATXDAONFT_V2
  network:  ropsten
 deployer:  0x51040CE6FC9b9C5Da69B044109f637dc997e92DE
 gasPrice:  24.986498384 gwei

deploy tx:  0x8148515e0013a6cb9c01863a09e61f5fc1ac79ffb08528342ee04771de0f7e00
  address:  0xe1e1561881aBa2cbb4D29Fa4e846C71CbD8073E4
```

### Speical Mint

```zsh
# non-dynamic special mint for genesis members
❯ hh mint-speical --network localhost --token-uri ipfs://QmRYkLgszoKpV15AUDcZJ82yL741pJRFSUogtNiUUF45S2  metadata/genesis/genesis-addresses.json

   running:  ATXDAONFT_V2.specialMint()
  contract:  0x610178dA211FEF7D417bC0e6FeD39F05609AD788
   network:  localhost
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
# dynamic special mint for active contributors
❯ hh mint-special --network localhost --dynamic --token-uri ipfs://QmYVgQoE74xp5TigTe1EC9vDQw7tx39t3U9ySTaNHa7CdV/  metadata/genesis/genesis-active-contributors.json

   running:  ATXDAONFT_V2.specialMint()
  contract:  0x610178dA211FEF7D417bC0e6FeD39F05609AD788
   network:  localhost
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
# dynamic special mint from arg list
❯ hh mint-special --network localhost --dynamic --token-uri ipfs://QmYVgQoE74xp5TigTe1EC9vDQw7tx39t3U9ySTaNHa7CdV/  0xf83b3A823653E8351b173Fa2Ae083Af37EAbCC01 0x5A17717abE73FEb3d4C4AAfD39B3CA5313cFB653

   running:  ATXDAONFT_V2.specialMint()
  contract:  0x610178dA211FEF7D417bC0e6FeD39F05609AD788
   network:  localhost
    signer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  tokenURI:  ipfs://QmQRFD3dSfNRDa7vvHwafwg4F6FUjA2NBjxBrGuPSrpKrV/
   dynamic:  true
  gasPrice:  1.074432282 gwei

recipients:  0xf83b3A823653E8351b173Fa2Ae083Af37EAbCC01
             0x5A17717abE73FEb3d4C4AAfD39B3CA5313cFB653

  tx hash:   0xdb4d8108e35783fb3b0912c5a77612d6d371d418f40e67afa1c55041ac504fdb
```

### Generate merkle tree

You can generate a merkle root + proof with the `merkle-tree` task. Here's an
example passing is 0x1, 0x2, and 0x3 as whitelisted addresses. It generates the
merkle root for the set of addresses and the proof for 0x3

```zsh
# generate a merkle tree for 3 addresses and save proofs to a json file
❯ hh merkle-tree metadata/zilker/zilker-addresses.json --all-proofs > metadata/zilker/zilker-merkle-tree.json
0x16a3abbf7b13b58573d53c3dd5b064b4f52d009a32755e02019bf487939bcc6b
└─ 16a3abbf7b13b58573d53c3dd5b064b4f52d009a32755e02019bf487939bcc6b
   ├─ 2d3ea67dcb30352cef47be0dfa9f704f5a010d9e0f1f8b43171aec6afd1e6f66
   │  ├─ 9e337a8d1dae78f6dbbb436d64a9f2b35ca66b52bddb964d5555cd49bdfedf2b
   │  │  ├─ 23270a0ff66c25ba0f2fe940fcd33d1b03f7f4512b06b4ff1a1e52bc0c410392
   │  │  │  ├─ cc5d967e10282be41100b29846bf8722f1e3b3c51c679410f9dc3181a23bb299
   │  │  │  │  ├─ c11b658f810b702812d6bad158144c01c07e20d5880da93034bf9e894bfeb4d6
   │  │  │  │  │  ├─ f4623c78cfb83101f2971cb8e7d785ef18959d60a86c051690f2257d2501410b
   │  │  │  │  │  │  ├─ eb8b5372d36ae7b49a687d4f0e5a52665dc3b50eec3ab9930f2e338deaf07372
....

❯ cat metadata/zilker/zilker-merkle-tree.json
{
    "root": "0x16a3abbf7b13b58573d53c3dd5b064b4f52d009a32755e02019bf487939bcc6b",
    "proofs": {
        "0x6D494Cb80cE08232e8bD059dd11c48d955f9e357": [
            "0x0889bc7ba2843fdcc29090c67e351960dd0e2174cf6b1f820f84586ded82a08c",
            "0x49baf6bc354f6a85742e939d854e9e7b516cd669c6f49dbadd2ac571e7bf5ec8",
            "0x7e9c203c51237fa9c29dec313197dee313a8947d4657a3caeef7f7042cbd966d",
            "0x930b75a21da02f2087842fa50aa950aebe6ab94b68d254c3ef09374aa5a63380",
            "0xad51926b1048b74b730730f9ec3cec120b8db00bdf9676093848da0135171ee0",
            "0x3fb987219c12e6ae339040df660b936c3a290d0bf44d073b131a8434dad4b7a6",
            "0x95a9c41c05de4e3774bf947246a6afb8b1490ecf98e73ecf05d6d8a579b02397"
        ],
        ...
    }
}
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

### Set Merkle Root

```zsh
❯ hh set-merkle-root --network localhost --root 0x09bdac7838fdbc3d080baf0a069c66554ad41d9d468c3127e5ca1d19e4c38399
   running:  ATXDAONFT_V2.setMerkleRoot()
      root:  0x09bdac7838fdbc3d080baf0a069c66554ad41d9d468c3127e5ca1d19e4c38399
  contract:  0x5FbDB2315678afecb367f032d93F642f64180aa3
   network:  localhost
    signer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  gasPrice:  1.524160374 gwei
```

### Start Mint

```zsh
# test locally
❯ hh start-mint --network localhost --root 0x09bdac7838fdbc3d080baf0a069c66554ad41d9d468c3127e5ca1d19e4c38399 --token-uri ipfs://QmYVgQoE74xp5TigTe1EC9vDQw7tx39t3U9ySTaNHa7CdV/ --mint-price 0.02
   running:  ATXDAONFT_V2.startMint()
     price:  0.63 eth
             630000000000000000 wei
  tokenUri:  ipfs://QmQRFD3dSfNRDa7vvHwafwg4F6FUjA2NBjxBrGuPSrpKrV/
      root:  0x09bdac7838fdbc3d080baf0a069c66554ad41d9d468c3127e5ca1d19e4c38399
  contract:  0x5FbDB2315678afecb367f032d93F642f64180aa3
   network:  localhost
    signer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  gasPrice:  1.458767035 gwei
```

```zsh
# mainnet
❯ hh start-mint --network mainnet --root 0x3e5146470e217408c29036a78fa3f617bb7c11bd82cee7ff56afce6d45f45e94 --token-uri ipfs://QmYVgQoE74xp5TigTe1EC9vDQw7tx39t3U9ySTaNHa7CdV/ --mint-price 0.63
   running:  ATXDAONFT_V2.startMint()
     price:  0.63 eth
             630000000000000000 wei
  tokenUri:  ipfs://QmQRFD3dSfNRDa7vvHwafwg4F6FUjA2NBjxBrGuPSrpKrV/
      root:  0x09bdac7838fdbc3d080baf0a069c66554ad41d9d468c3127e5ca1d19e4c38399
  contract:  0x5FbDB2315678afecb367f032d93F642f64180aa3
   network:  localhost
    signer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  gasPrice:  1.458767035 gwei
```

### Mint

```zsh
❯ hh mint --network localhost 0x44e659e60b21cc961f64ad47f20523c1d329d4bbda245ef3940a76dc89d0911b
   running:  ATXDAONFT_V2.mint()
  contract:  0x5FbDB2315678afecb367f032d93F642f64180aa3
   network:  localhost
    signer:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  gasPrice:  1.401813368 gwei


  tx hash:   0x65403c6733bf70d1c40b07783ad2f6c1062a00ad11696521083846c50bd38ba4
```

### Genesis Owners

```sh
# works for ATXDAONFT or ATXDAONFT_V2
❯ hh get-nft-owners --network ropsten --contract ATXDAONFT_V2 --start 3 --end 3
1 found!
[
    {
        "owner": "0x6d7ddD863eB2Dad990bC05BDd3357E32850509E9",
        "uri": "ipfs://QmRYkLgszoKpV15AUDcZJ82yL741pJRFSUogtNiUUF45S2"
    }
]
```

### Reset hasMinted

```zsh
❯ hh reset-has-minted --network ropsten 0x51040CE6FC9b9C5Da69B044109f637dc997e92DE
   running:  ATXDAONFT_V2.resetHasMinted()
 addresses:  0x51040CE6FC9b9C5Da69B044109f637dc997e92DE
  contract:  0xc38D8Da0c1cA6314474a3442103F543551f0F177
   network:  ropsten
    signer:  0x51040CE6FC9b9C5Da69B044109f637dc997e92DE
  gasPrice:  14.034465295 gwei


  tx hash:   0x2e0fc7fe78aa1fcdb58857e0f99c446525258227060ea0cb3c2a7d465d45d10c
```

### Ropsten mint

```zsh
❯ hh start-mint --network ropsten --root 0xeaa7c77029072bf029aef546fe224070e90af3f17d11d49282c8214953b777bc --token-uri ipfs://QmQRFD3dSfNRDa7vvHwafwg4F6FUjA2NBjxBrGuPSrpKrV/ --mint-price 0.02
```
