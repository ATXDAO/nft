import { ATXDAONFT } from '../typechain-types/ATXDAONFT';
import { contracts } from '../util/constants';
import { task } from 'hardhat/config';

const { mainnet: address } = contracts.v0;

task('get-nft-owners', 'gets a list of nft owners, ordered by token id')
  .addOptionalPositionalParam(
    'contract',
    'contract address (default to v1 mainnet contract)',
    address
  )
  .setAction(async (taskArgs) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const hre = require('hardhat');
    const { getContractAt } = hre.ethers;
    const { contract } = taskArgs;

    const nft = (await getContractAt('ATXDAONFT', contract)) as ATXDAONFT;
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
