import { ATXDAONFT } from '../typechain-types/ATXDAONFT';
import { getContractAddress, ContractName } from '../util/contract-meta';
import { task } from 'hardhat/config';

interface GetNftOwnersArgs {
  contract: ContractName;
  start: number;
  end: number;
}

task('get-nft-owners', 'gets a list of nft owners, ordered by token id')
  .addParam<ContractName>(
    'contract',
    'contract name (e.g. ATXDAONFT or ATXDAONFT_V2)'
  )
  .addOptionalParam<number>('start', 'token id to start')
  .addOptionalParam<number>('end', 'token id to end (inclusive)')
  .setAction(
    async ({ contract, start, end }: GetNftOwnersArgs, { ethers, network }) => {
      const contractAddress = getContractAddress(contract, network.name);
      const nft = (await ethers.getContractAt(
        contract,
        contractAddress
      )) as ATXDAONFT;
      const owners: string[] = [];
      for (let id = start || 1; id <= end || 99999999; id += 1) {
        try {
          const owner = await nft.ownerOf(id);
          owners.push(owner);
        } catch {
          break;
        }
      }

      console.error(`${owners.length} found!`);
      console.log(JSON.stringify(owners, null, 4));
    }
  );
