const { ethers, upgrades } = require('hardhat');

async function main() {
  const ATX = await ethers.getContractFactory('ATXDAONFT_V2');
  console.log('deploying proxy, V2 implementation, and proxy admin');
  const V2Proxy = await upgrades.deployProxy(ATX, ['ATX DAO', 'ATX'], {
    initializer: 'initialize',
  });
  console.log('V2Proxy deployed to:', V2Proxy.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
