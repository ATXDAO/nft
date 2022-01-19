var artifact = require('./artifacts/contracts/ATXDAONFT_V2.sol/ATXDAONFT_V2');

var tree = require('./metadata/zilker/zilker-merkle-tree');
var ethers = require('ethers');
var gasnow = require('ethers-gasnow');

var provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
provider.getGasPrice = gasnow.createGetGasPrice('rapid');

var signer = new ethers.Wallet('0x' + process.env.PRIVATE_KEY).connect(provider);
var contract = new ethers.Contract(ethers.constants.AddressZero, artifact.abi, signer);

var proof = (async () => tree.proofs[ethers.utils.getAddress(await signer.getAddress())])();


var fn = async () => {
  var tx = await contract.mint(tree[await signer.getAddress()]);
  return tx;
};
