/* eslint-disable indent */
import { ATXDAONFTV2 } from '../typechain-types/ATXDAONFTV2';
import { assertValidTokenUri } from '../util/assertions';
import { getContractAddress } from '../util/contract-meta';
import { dynamicGetGasPrice } from '../util/gas-now';
import { MerkleOutput } from './merkle-tree';
import { readFileSync } from 'fs';
import { task } from 'hardhat/config';

interface StartMintArgs {
  contractAddress?: string;
  gasPrice?: string;
  root: string;
  tokenUri: string;
  mintPrice: string;
}

task<StartMintArgs>('start-mint', 'enable nft minting')
  .addOptionalParam('contractAddress', 'nftv2 contract address')
  .addOptionalParam(
    'gasPrice',
    'gas price in wei to deploy with (uses provider.getGasPrice() otherwise)'
  )
  .addParam('root', 'merkle root')
  .addParam('tokenUri', 'base token uri (should end with "/"')
  .addParam('mintPrice', 'price in ether, e.g. "0.512"')
  .setAction(
    async (
      { contractAddress, gasPrice, mintPrice, tokenUri, root }: StartMintArgs,
      { ethers, network }
    ) => {
      const { isAddress, parseEther, formatEther } = ethers.utils;
      if (network.name === 'mainnet') {
        ethers.providers.BaseProvider.prototype.getGasPrice =
          dynamicGetGasPrice('fast');
      }

      assertValidTokenUri(tokenUri, /* dynamic */ true);

      const parsedPrice = parseEther(mintPrice);

      if (parsedPrice < parseEther('0.01')) {
        console.error(
          `mint-price (${formatEther(parsedPrice)} eth) less than 0.01 eth!`
        );
        process.exit(1);
      }

      const parsedRoot =
        !root || root.endsWith('.json')
          ? (
              JSON.parse(
                readFileSync(
                  root || 'metadata/zilker/zilker-merkle-tree.json'
                ).toString()
              ) as MerkleOutput
            ).root
          : root;

      // prob need to adds spoofiny
      const signer = await ethers.provider.getSigner();

      const parsedContractAddress =
        contractAddress || getContractAddress('ATXDAONFT_V2', network.name);
      if (!isAddress(parsedContractAddress)) {
        throw new Error(
          `${parsedContractAddress} is not a valid contract address!`
        );
      }

      const txGasPrice = ethers.BigNumber.from(
        gasPrice || (await ethers.provider.getGasPrice())
      );

      const contract = (await ethers.getContractAt(
        'ATXDAONFT_V2',
        parsedContractAddress
      )) as ATXDAONFTV2;

      console.log('   running:  ATXDAONFT_V2.startMint()');
      console.log(`     price:  ${formatEther(parsedPrice)} eth`);
      console.log(`             ${parsedPrice} wei`);
      console.log(`  tokenUri:  ${tokenUri}`);
      console.log(`      root:  ${parsedRoot}`);
      console.log(`  contract:  ${parsedContractAddress}`);
      console.log(`   network:  ${network.name}`);
      console.log(`    signer:  ${await signer.getAddress()}`);

      console.log(
        `  gasPrice:  ${ethers.utils.formatUnits(txGasPrice, 'gwei')} gwei\n`
      );

      const tx = await contract.startMint(parsedPrice, tokenUri, parsedRoot, {
        gasPrice: txGasPrice,
      });

      console.log(`\n  tx hash:   ${tx.hash}`);
    }
  );

// import hre from 'hardhat';
// import gasnow from 'ethers-gasnow';
// import merkleTree from '../metadata/zilker/zilker-merkle-tree.json';

// const { ethers } = hre;

// ethers.providers.BaseProvider.prototype.getGasPrice =
//   gasnow.createGetGasPrice('rapid');

// (async () => {
//   const [ signer ] = await ethers.getSigners();
//   const contract = await ethers.getContract('ATXDAONFT_V2');
//   const tx = await contract.startMint(await contract._mintPrice(), process.env.BASE_URI || 'https://cloudflare-ipfs.com', merkleTree.root);
//   console.log(tx.hash);
// })()
//   .then(() => {
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });
