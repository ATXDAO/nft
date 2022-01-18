import { ATXDAONFTV2 } from '../typechain-types/ATXDAONFTV2';
import { readFileSync } from 'fs';
import { task } from 'hardhat/config';

interface NftListArgs {
  contractAddress: string;
  json: boolean;
  startId?: number;
  endId?: number;
}

task<NftListArgs>('v2-list-nfts', 'get list of nfts with owners')
  .addFlag('json', 'json results')
  .addOptionalParam<number>('startId', 'starting token id')
  .addOptionalParam<number>('endId', 'ending token id (inclusive)')
  .addPositionalParam('contractAddress', 'nftv2 contract address')
  .setAction(
    async (
      { contractAddress, startId, endId }: NftListArgs,
      { ethers, network }
    ) => {
      console.error(`   network:  ${network.name}`);
      console.error(`  contract:  ${contractAddress}\n`);
      const nftv2 = (await ethers.getContractAt(
        'ATXDAONFT_V2',
        contractAddress
      )) as ATXDAONFTV2;
      const nfts = [];
      for (let i = startId || 1; i <= (endId || 1e9); i += 1) {
        try {
          nfts.push({
            owner: await nftv2.ownerOf(i),
            uri: await nftv2.tokenURI(i),
          });
        } catch (err) {
          break;
        }
      }
      console.log(JSON.stringify(nfts, null, 4));
    }
  );

interface SpecialMintArgs {
  contractAddress: string;
  recipients: string[];
  dynamic: boolean;
  tokenUri: string;
  gasPrice?: string;
}

task<SpecialMintArgs>('v2-special-mint', 'run a special mint')
  .addFlag('dynamic', 'use dynamic tokenURI')
  .addParam('tokenUri', 'token URI (or base tokenURI when --dynamic is set)')
  .addPositionalParam('contractAddress', 'nftv2 contract address')
  .addVariadicPositionalParam(
    'recipients',
    'specialMint recipient addresses (json filename or space separated list)'
  )
  .addOptionalParam(
    'gasPrice',
    'gas price in wei to deploy with (uses provider.getGasPrice() otherwise)'
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
      const signer = await ethers.provider.getSigner();
      const { isAddress } = ethers.utils;
      if (!isAddress(contractAddress)) {
        throw new Error(`${contractAddress} is not a valid contract address!`);
      }

      const parsedRecipients: string[] =
        recipients.length === 1 && recipients[0].toLowerCase().endsWith('.json')
          ? JSON.parse(readFileSync(recipients[0]).toString())
          : recipients;

      if (!parsedRecipients.every((r: string) => isAddress(r.toString()))) {
        throw new Error(`${parsedRecipients} contains an invalid address!`);
      }

      if (!tokenUri.startsWith('ipfs://')) {
        throw new Error(
          `expected token URI to be prefixed with 'ipfs://', got ${tokenUri}`
        );
      }

      if (dynamic && !tokenUri.endsWith('/')) {
        throw new Error(
          `dynamic mint token-uri should be end with a "/", got: ${tokenUri}`
        );
      }

      const txGasPrice = ethers.BigNumber.from(
        gasPrice || (await ethers.provider.getGasPrice())
      );

      const nftv2 = (await ethers.getContractAt(
        'ATXDAONFT_V2',
        contractAddress
      )) as ATXDAONFTV2;

      console.log('   running:  ATXDAONFT_V2.specialMint()');
      console.log(`  contract:  ${contractAddress}`);
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
