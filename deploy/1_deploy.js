const hre = require('hardhat');
const gasnow = require('ethers-gasnow');
const ethers = require('ethers');

ethers.providers.BaseProvider.prototype.getGasPrice = gasnow.createGetGasPrice('rapid');
const contractName = 'ATXDAONFT_V2';

module.exports = async () => {
    const [ signer ] = await hre.ethers.getSigners();
    const from = await signer.getAddress();
    const deployGasPrice = await signer.provider.getGasPrice();
    console.log(`deploying:  ${contractName}`);
    console.log(`  network:  ${hre.network.name}`);
    console.log(` deployer:  ${from}`);
    console.log(
      ` gasPrice:  ${ethers.utils.formatUnits(deployGasPrice, 'gwei')} gwei\n`
    );
    const contract = await hre.deployments.deploy('ATXDAONFT_V2', {
      contractName: 'ATXDAONFT_V2',
      args: [],
      libraries: {},
      from
    });
    console.log('deploy tx: ', contract.receipt.transactionHash);
    console.log('  address: ', contract.address);
};
