/* eslint-disable indent */
import { ATXDAONFTV2 } from '../typechain-types/ATXDAONFTV2';
import { getContractAddress } from '../util/contract-meta';
import { dynamicGetGasPrice } from '../util/gas-now';
import { MerkleOutput } from './merkle-tree';
import { readFileSync } from 'fs';
import { task } from 'hardhat/config';

interface SetMerkleRootArgs {
  contractAddress?: string;
  gasPrice?: string;
  root?: string;
}

task<SetMerkleRootArgs>('set-merkle-root', 'set the merkle root')
  .addOptionalParam('contractAddress', 'nftv2 contract address')
  .addOptionalParam(
    'gasPrice',
    'gas price in wei to deploy with (uses provider.getGasPrice() otherwise)'
  )
  .addOptionalParam('root', 'merkle root')
  .setAction(
    async (
      { contractAddress, gasPrice, root }: SetMerkleRootArgs,
      { ethers, network }
    ) => {
      const { isAddress } = ethers.utils;
      if (network.name === 'mainnet') {
        ethers.providers.BaseProvider.prototype.getGasPrice =
          dynamicGetGasPrice('fast');
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

      console.log('   running:  ATXDAONFT_V2.setMerkleRoot()');
      console.log(`      root:  ${parsedRoot}`);
      console.log(`  contract:  ${parsedContractAddress}`);
      console.log(`   network:  ${network.name}`);
      console.log(`    signer:  ${await signer.getAddress()}`);

      console.log(
        `  gasPrice:  ${ethers.utils.formatUnits(txGasPrice, 'gwei')} gwei\n`
      );

      const tx = await contract.setMerkleRoot(parsedRoot, {
        gasPrice: txGasPrice,
      });

      console.log(`\n  tx hash:   ${tx.hash}`);
    }
  );
