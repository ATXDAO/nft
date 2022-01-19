
import hre from 'hardhat';
import gasnow from 'ethers-gasnow';
import merkleTree from '../metadata/zilker/zilker-merkle-tree.json';

const { ethers } = hre;

ethers.providers.BaseProvider.prototype.getGasPrice =
  gasnow.createGetGasPrice('rapid');

(async () => {
  const [ signer ] = await ethers.getSigners();
  const contract = await ethers.getContract('ATXDAONFT_V2');
  const tx = await contract.startMint(await contract._mintPrice(), process.env.BASE_URI || 'https://cloudflare-ipfs.com', merkleTree.root);
  console.log(tx.hash);
})()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
