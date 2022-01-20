import { ATXDAONFTV2 } from '../typechain-types/ATXDAONFTV2';
import { assertValidTokenUri } from '../util/assertions';
import { getContractAddress } from '../util/contract-meta';
import { dynamicGetGasPrice } from '../util/gas-now';
import { readFileSync } from 'fs';
import { task } from 'hardhat/config';

interface SpecialMintArgs {
  contractAddress?: string;
  recipients: string[];
  dynamic: boolean;
  tokenUri: string;
  gasPrice?: string;
}

task<SpecialMintArgs>('mint-special', 'run a special mint')
  .addFlag('dynamic', 'use dynamic tokenURI')
  .addParam('tokenUri', 'token URI (or base tokenURI when --dynamic is set)')
  .addOptionalParam('contractAddress', 'nftv2 contract address')
  .addOptionalParam(
    'gasPrice',
    'gas price in wei to deploy with (uses provider.getGasPrice() otherwise)'
  )
  .addVariadicPositionalParam(
    'recipients',
    'specialMint recipient addresses (json filename or space separated list)'
  )
  .setAction(
    async (
      {
        contractAddress,
        recipients,
        dynamic,
        tokenUri,
        gasPrice,
      }: SpecialMintArgs,
      { ethers, network }
    ) => {
      if (network.name === 'mainnet') {
        ethers.providers.BaseProvider.prototype.getGasPrice =
          dynamicGetGasPrice('fast');
      }

      const signer = await ethers.provider.getSigner();
      const { isAddress } = ethers.utils;

      const parsedContractAddress =
        contractAddress || getContractAddress('ATXDAONFT_V2', network.name);
      if (!isAddress(parsedContractAddress)) {
        throw new Error(
          `${parsedContractAddress} is not a valid contract address!`
        );
      }

      const parsedRecipients: string[] =
        recipients.length === 1 && recipients[0].toLowerCase().endsWith('.json')
          ? JSON.parse(readFileSync(recipients[0]).toString())
          : recipients;

      if (!parsedRecipients.every((r: string) => isAddress(r.toString()))) {
        throw new Error(`${parsedRecipients} contains an invalid address!`);
      }

      assertValidTokenUri(tokenUri, dynamic);

      const txGasPrice = ethers.BigNumber.from(
        gasPrice || (await ethers.provider.getGasPrice())
      );

      const nftv2 = (await ethers.getContractAt(
        'ATXDAONFT_V2',
        parsedContractAddress
      )) as ATXDAONFTV2;

      console.log('   running:  ATXDAONFT_V2.specialMint()');
      console.log(`  contract:  ${parsedContractAddress}`);
      console.log(`   network:  ${network.name}`);
      console.log(`    signer:  ${await signer.getAddress()}`);
      console.log('  tokenURI: ', tokenUri);
      console.log('   dynamic: ', dynamic);

      console.log(
        `  gasPrice:  ${ethers.utils.formatUnits(txGasPrice, 'gwei')} gwei\n`
      );

      console.log(`recipients:  ${parsedRecipients[0]}`);
      parsedRecipients
        .slice(1)
        .forEach((r: string) => console.log(`             ${r}`));

      const tx = await nftv2.mintSpecial(parsedRecipients, tokenUri, dynamic, {
        gasPrice: txGasPrice,
      });

      console.log(`\n  tx hash:   ${tx.hash}`);
    }
  );
