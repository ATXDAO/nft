import { ATXDAONFTV2 } from '../typechain-types/ATXDAONFTV2';
import { getContractAddress } from '../util/contract-meta';
import { dynamicGetGasPrice } from '../util/gas-now';
import { getAddress } from 'ethers/lib/utils';
import { task } from 'hardhat/config';

interface ResetHasMintedArgs {
  contractAddress?: string;
  gasPrice?: string;
  addresses: string[];
}

task<ResetHasMintedArgs>('reset-has-minted', 'reset hasMinted for an address')
  .addOptionalParam('contractAddress', 'nftv2 contract address')
  .addOptionalParam(
    'gasPrice',
    'gas price in wei to deploy with (uses provider.getGasPrice() otherwise)',
  )
  .addVariadicPositionalParam('addresses', 'the address to reset hasMinted for')
  .setAction(
    async (
      { contractAddress, gasPrice, addresses }: ResetHasMintedArgs,
      { ethers, network },
    ) => {
      const { isAddress } = ethers.utils;
      if (network.name === 'mainnet') {
        ethers.providers.BaseProvider.prototype.getGasPrice =
          dynamicGetGasPrice('fast');
      }

      if (!addresses.length) {
        throw new Error('must pass at least one address to reset');
      }

      const parsedAddresses = addresses.map((addr) => getAddress(addr));

      // prob need to adds spoofiny
      const signer = await ethers.provider.getSigner();

      const parsedContractAddress =
        contractAddress || getContractAddress('ATXDAONFT_V2', network.name);
      if (!isAddress(parsedContractAddress)) {
        throw new Error(
          `${parsedContractAddress} is not a valid contract address!`,
        );
      }

      const txGasPrice = ethers.BigNumber.from(
        gasPrice || (await ethers.provider.getGasPrice()),
      );

      const contract = (await ethers.getContractAt(
        'ATXDAONFT_V2',
        parsedContractAddress,
      )) as ATXDAONFTV2;

      console.log('   running:  ATXDAONFT_V2.resetHasMinted()');
      console.log(` addresses:  ${parsedAddresses.join(' ')}`);
      console.log(`  contract:  ${parsedContractAddress}`);
      console.log(`   network:  ${network.name}`);
      console.log(`    signer:  ${await signer.getAddress()}`);

      console.log(
        `  gasPrice:  ${ethers.utils.formatUnits(txGasPrice, 'gwei')} gwei\n`,
      );

      const tx = await contract.resetHasMinted(parsedAddresses, {
        gasPrice: txGasPrice,
      });

      console.log(`\n  tx hash:   ${tx.hash}`);
    },
  );
