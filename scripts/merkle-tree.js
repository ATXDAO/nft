const { task } = require("hardhat/config");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

const ethers = require("ethers");

function keccak256Address(addr) {
  return ethers.utils.keccak256(
    ethers.utils.solidityKeccak256(["address"], [addr])
  );
}

task(
  "merkle-tree",
  "generate a merkle tree from a set of space-separated addresses"
)
  .addVariadicPositionalParam("addresses")
  .addOptionalParam("claim", "generate a proof for a claimant")
  .setAction(async (taskArgs) => {
    const leafNodes = taskArgs.addresses.map((addr) => keccak256Address(addr));
    const tree = new MerkleTree(leafNodes, keccak256, {
      sort: true,
    });
    const root = tree.getHexRoot();
    console.log(tree.toString());
    console.log(`root ${root}`);
    if (taskArgs.claim) {
      const leaf = keccak256Address(taskArgs.claim);
      const proof = tree.getHexProof(leaf);

      if (!tree.verify(proof, leaf, root)) {
        console.error("\ninvalid claimant for merkle proof!");
        process.exit(1);
      }
      console.log(proof);
    }
  });

module.exports = {};
