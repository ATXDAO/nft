import { ATXDAONFTV2 } from '../typechain-types/ATXDAONFTV2';
import { getContractAddress } from '../util/contract-meta';
import { dynamicGetGasPrice } from '../util/gas-now';
import { MerkleOutput } from './merkle-tree';
import { task } from 'hardhat/config';

interface MintArgs {
  contractAddress?: string;
  gasPrice?: string;
  proof?: string[];
}

task<MintArgs>('mint', 'mint an nft')
  .addOptionalParam('contractAddress', 'nftv2 contract address')
  .addOptionalParam(
    'gasPrice',
    'gas price in wei to deploy with (uses provider.getGasPrice() otherwise)'
  )
  .addVariadicPositionalParam('proof', 'space separated bytes32')
  .setAction(
    async (
      { contractAddress, gasPrice, proof }: MintArgs,
      { ethers, network }
    ) => {
      if (network.name === 'mainnet') {
        ethers.providers.BaseProvider.prototype.getGasPrice =
          dynamicGetGasPrice('fast');
      }

      const tree: MerkleOutput =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('../metadata/zilker/zilker-merkle-tree.json');

      // prob need to adds spoofiny
      const signer = await ethers.provider.getSigner();
      const parsedProof = proof?.length
        ? proof
        : tree.proofs[ethers.utils.getAddress(await signer.getAddress())];
      const { isAddress } = ethers.utils;

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

      console.log('   running:  ATXDAONFT_V2.mint()');
      console.log(`  contract:  ${parsedContractAddress}`);
      console.log(`   network:  ${network.name}`);
      console.log(`    signer:  ${await signer.getAddress()}`);

      console.log(
        `  gasPrice:  ${ethers.utils.formatUnits(txGasPrice, 'gwei')} gwei\n`
      );

      const tx = await contract.mint(parsedProof, {
        value: await contract._mintPrice(),
        gasPrice: txGasPrice,
      });

      console.log(`\n  tx hash:   ${tx.hash}`);
    }
  );
