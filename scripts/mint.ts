const hre = require('hardhat');
const { ethers } = hre;
const gasnow = require('ethers-gasnow');
const tree = require('../metadata/zilker/zilker-merkle-tree');

ethers.providers.BaseProvider.prototype.getGasPrice =
  gasnow.createGetGasPrice('rapid'); 

(async () => {
  const [signer] = await ethers.getSigners();
  const proof = tree.proofs[ethers.utils.getAddress(await signer.getAddress())];
  const contract = await ethers.getContract('ATXDAONFT_V2');
  const tx = await contract.mint(proof, { value: await contract._mintPrice() });
  console.log(tx.hash);
})()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
