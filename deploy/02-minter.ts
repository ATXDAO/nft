import { FixedDeployFunction } from '../types';
import { dynamicGetGasPrice } from '../util/gas-now';
import { ATXDAONFT_V2 } from '../typechain-types';
import { getAddress } from 'ethers/lib/utils';

const nftContractName = 'ATXDAONFT_V2';
const contractName = 'ATXDAOMinter';

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

  const nftDeployment = await deployments.get(nftContractName);
  const nftAddress = nftDeployment.address;
  const ethRecipient =
    network.name === 'mainnet'
      ? '0x407cf0e5dd3c2c4bce5a32b92109c2c6f7f1ce23'
      : from;

  const nftContract = (await ethers.getContractAt(
    'ATXDAONFT_V2',
    nftAddress,
  )) as ATXDAONFT_V2;

  if (await nftContract.isMintable()) {
    console.error('nft is mintable! ending mint...');
    await nftContract.endMint({
      gasPrice: await ethers.provider.getGasPrice(),
    });
  }

  console.log(`deploying:  ${contractName}`);
  console.log(`  network:  ${network.name}`);
  console.log(` deployer:  ${from}`);
  console.log(
    ` gasPrice:  ${ethers.utils.formatUnits(
      await ethers.provider.getGasPrice(),
      'gwei',
    )} gwei`,
  );
  console.log(`      nft:  ${nftAddress}`);
  console.log(`recipient:  ${from}\n`);
  // address _nftAddress, address _ethRecipient
  const contract = await deployments.deploy(contractName, {
    args: [nftAddress, ethRecipient],
    libraries: {},
    from,
    log: true,
    autoMine: true,
  });
  console.log(`deploy tx: ${contract.receipt?.transactionHash}`);
  console.log(`  address: ${contract.address}\n`);

  const nftOwner = getAddress(await nftContract.owner());
  if (nftOwner !== getAddress(contract.address)) {
    console.log(
      `transferring ownership of ${nftContractName} to ${contractName}...`,
    );
    await nftContract.transferOwnership(contract.address);
    console.log('ownership transferred!\n');
  }
};

deployFunc.id = contractName;

export default deployFunc;
