import { task } from 'hardhat/config';

task('deploy', 'deploy a contract')
  .addPositionalParam<'ATXDAONFT' | 'ATXDAONFT_V2'>(
    'contractName',
    'name of contract (ATXDAONFT, ATXDAONFT_V2)',
    'ATXDAONFT_V2'
  )
  .setAction(async (taskArgs, { ethers }) => {
    const factory = await ethers.getContractFactory(taskArgs.contractName);
    const contract = await factory.deploy();
    console.log('deploy tx:', contract.deployTransaction);
    await contract.deployed();
    console.log('contract address', contract.address);
  });
