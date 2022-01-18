import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';

task('gas-price', 'get gas price').setAction(async (_, { ethers, network }) => {
  const gasPrice = await ethers.provider.getGasPrice();
  console.log(`current gas price on ${network.name} is:`);
  console.log(`    ${gasPrice} wei`);
  console.log(`    ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
});

task('deploy', 'deploy a contract')
  .addPositionalParam<'ATXDAONFT' | 'ATXDAONFT_V2'>(
    'contractName',
    'name of contract (ATXDAONFT, ATXDAONFT_V2)'
  )
  .addOptionalParam<BigNumber | undefined>(
    'gasPrice',
    'gas price in wei to deploy with (uses provider.getGasPrice() otherwise)'
  )
  .setAction(async (taskArgs, { ethers, network }) => {
    const signer = await ethers.provider.getSigner();
    const { contractName, gasPrice } = taskArgs;
    const deployGasPrice = BigNumber.from(
      gasPrice || (await ethers.provider.getGasPrice())
    );

    console.log(`deploying:  ${contractName}`);
    console.log(`  network:  ${network.name}`);
    console.log(` deployer:  ${await signer.getAddress()}`);
    console.log(
      ` gasPrice:  ${ethers.utils.formatUnits(deployGasPrice, 'gwei')} gwei\n`
    );
    const factory = await ethers.getContractFactory(contractName);
    const contract = await factory.deploy({ gasPrice: deployGasPrice });
    console.log('deploy tx: ', contract.deployTransaction.hash);
    await contract.deployed();
    console.log('  address: ', contract.address);
  });
