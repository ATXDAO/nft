import { ATXDAONFT } from '../typechain-types/ATXDAONFT';
import { getContractAddress, ContractName } from '../util/contract-meta';
import { task } from 'hardhat/config';

interface GetNftOwnersArgs {
  contract: ContractName;
}

task('get-nft-owners', 'gets a list of nft owners, ordered by token id')
  .addParam<ContractName>(
    'contract',
    'contract name (e.g. ATXDAONFT or ATXDAONFT_V2)'
  )
  .setAction(async ({ contract }: GetNftOwnersArgs, { ethers, network }) => {
    const contractAddress = getContractAddress(contract, network.name);
    const nft = (await ethers.getContractAt(
      contract,
      contractAddress
    )) as ATXDAONFT;
    let id = 1;
    const owners: string[] = [];
    while (true) {
      try {
        const owner = await nft.ownerOf(id);
        owners.push(owner);
        ++id;
      } catch {
        break;
      }
    }

    console.error(`${owners.length} found!`);
    console.log(JSON.stringify(owners, null, 4));
  });
