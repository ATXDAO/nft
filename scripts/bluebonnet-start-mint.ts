/* eslint-disable indent */
import { ATXDAOMinter } from '../typechain-types';
import { assertValidTokenUri } from '../util/assertions';
import { getContractAddress } from '../util/contract-meta';
import { dynamicGetGasPrice } from '../util/gas-now';
import { MerkleOutput } from './classic-merkle';
import { readFileSync } from 'fs';
import { task } from 'hardhat/config';

interface StartMintArgs {
  contractAddress?: string;
  gasPrice?: string;
  root: string;
  isNewRound: boolean;
  mintPrice: string;
}

task<StartMintArgs>('bluebonnet-start-mint', 'enable nft minting')
  .addOptionalParam('contractAddress', 'atxdaominter contract address')
  .addOptionalParam(
    'gasPrice',
    'gas price in wei to deploy with (uses provider.getGasPrice() otherwise)'
  )
  .addParam('root', 'merkle root')
  .addParam('mintPrice', 'price in ether, e.g. "0.512"')
  .addFlag('isNewRound', 'is this a new round of minting?')
  .setAction(
    async (
      { contractAddress, gasPrice, mintPrice, isNewRound, root }: StartMintArgs,
      { ethers, network }
    ) => {
      const { isAddress, parseEther, formatEther } = ethers.utils;
      if (network.name === 'mainnet') {
        ethers.providers.BaseProvider.prototype.getGasPrice =
          dynamicGetGasPrice('fast');
      }

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
        contractAddress || getContractAddress('ATXDAOMinter', network.name);
      if (!isAddress(parsedContractAddress)) {
        throw new Error(
          `${parsedContractAddress} is not a valid contract address!`
        );
      }

      const txGasPrice = ethers.BigNumber.from(
        gasPrice || (await ethers.provider.getGasPrice())
      );

      const contract = (await ethers.getContractAt(
        'ATXDAOMinter',
        parsedContractAddress
      )) as ATXDAOMinter;

      console.log('   running:  ATXDAOMinter.startMint()');
      console.log(`     price:  ${formatEther(parsedPrice)} eth`);
      console.log(`             ${parsedPrice} wei`);
      console.log(`      root:  ${parsedRoot}`);
      console.log(`isNewRound:  ${isNewRound}`);
      console.log(`  contract:  ${parsedContractAddress}`);
      console.log(`   network:  ${network.name}`);
      console.log(`    signer:  ${await signer.getAddress()}`);

      console.log(
        `  gasPrice:  ${ethers.utils.formatUnits(txGasPrice, 'gwei')} gwei\n`
      );

      const tx = await contract.startMint(parsedRoot, parsedPrice, false, {
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
