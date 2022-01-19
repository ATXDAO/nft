import { gasNow, GasPriority } from '../util/gas-now';
import { task } from 'hardhat/config';

task('gas-price', 'get gas price').setAction(async (_, { ethers, network }) => {
  const gasPrice = await ethers.provider.getGasPrice();
  console.log(`gas price on ${network.name}\n`);
  console.log(` current  ${gasPrice} wei`);
  console.log(`          ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);

  if (network.name === 'mainnet') {
    const gasNowData = await gasNow();
    (['slow', 'standard', 'fast', 'rapid'] as GasPriority[]).forEach(
      (priority) => {
        const priorityPrice = gasNowData[priority];

        console.log(`${priority.padStart(8)}  ${priorityPrice} wei`);
        console.log(
          `          ${ethers.utils.formatUnits(priorityPrice, 'gwei')} gwei`
        );
      }
    );
  }
});
