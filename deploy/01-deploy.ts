import { FixedDeployFunction } from '../types';
import { dynamicGetGasPrice } from '../util/gas-now';

const contractName = 'ATXDAONFT_V2';

const deployFunc: FixedDeployFunction = async ({
  network,
  ethers,
  deployments,
}) => {
  if (network.name === 'mainnet') {
    ethers.providers.BaseProvider.prototype.getGasPrice =
      dynamicGetGasPrice('fast');
  }

  const signer = await ethers.provider.getSigner();
  const from = await signer.getAddress();
  const deployGasPrice = await ethers.provider.getGasPrice();
  if (!deployGasPrice) {
    throw new Error('deploy gas price undefined!');
  }
  console.log(`deploying:  ${contractName}`);
  console.log(`  network:  ${network.name}`);
  console.log(` deployer:  ${from}`);
  console.log(
    ` gasPrice:  ${ethers.utils.formatUnits(deployGasPrice, 'gwei')} gwei\n`
  );
  const contract = await deployments.deploy('ATXDAONFT_V2', {
    args: [],
    libraries: {},
    from,
    log: true,
    autoMine: true,
  });
  console.log('deploy tx: ', contract.receipt?.transactionHash);
  console.log('  address: ', contract.address);
};

deployFunc.id = 'ATXDAONFT_V2';

export default deployFunc;
