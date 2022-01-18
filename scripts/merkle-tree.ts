import { task } from 'hardhat/config';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { getAddress } from 'ethers/lib/utils';

task(
  'merkle-tree',
  'generate a merkle tree from a set of space-separated addresses'
)
  .addVariadicPositionalParam('addresses')
  .addOptionalParam('claim', 'generate a proof for a claimant')
  .setAction(async (taskArgs) => {
    const leafNodes = taskArgs.addresses.map((addr: string) =>
      getAddress(addr)
    );
    const tree = new MerkleTree(leafNodes, keccak256, {
      hashLeaves: true,
      sortPairs: true,
    });
    const root = tree.getHexRoot();
    console.log(root);
    console.log(tree.toString());
    if (taskArgs.claim) {
      const leaf = keccak256(getAddress(taskArgs.claim));
      const proof = tree.getHexProof(leaf);

      if (!tree.verify(proof, leaf, root)) {
        console.error('\ninvalid claimant for merkle proof!');
        process.exit(1);
      }
      console.log('proof:');
      console.log(proof);
    }
    console.log(`root: ${root}`);
  });
