
import hre from 'hardhat';
import gasnow from 'ethers-gasnow';

const { ethers } = hre;

ethers.providers.BaseProvider.prototype.getGasPrice =
  gasnow.createGetGasPrice('rapid');

(async () => {
  const [ signer ] = await ethers.getSigners();
  const wallet = new ethers.Wallet(ethers.utils.hexlify('0x' + process.env.PRIVATE_KEY));
  const tx = await signer.sendTransaction({
    to: wallet.address,
    value: ethers.utils.parseEther('1')
  });
  console.log(tx.hash);
})()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
