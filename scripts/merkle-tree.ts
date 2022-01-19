/* eslint-disable indent */
import { getAddress } from 'ethers/lib/utils';
import { readFileSync } from 'fs';
import { task } from 'hardhat/config';
import keccak256 from 'keccak256';
import { MerkleTree } from 'merkletreejs';

interface MerkleTreeArgs {
  recipients: string[];
  allProofs: boolean;
  proofFor?: string;
}

export interface MerkleOutput {
  root: string;
  proofs: Record<string, string[]>;
}

task<MerkleTreeArgs>(
  'merkle-tree',
  'generate a merkle tree from a set of space-separated addresses'
)
  .addVariadicPositionalParam(
    'recipients',
    'specialMint recipient addresses (json filename or space separated list)'
  )
  .addFlag('allProofs', 'generate proofs for all recipients')
  .addOptionalParam(
    'proofFor',
    'generate proof for a given recipient address (ignored if allProofs is set)'
  )
  .setAction(
    async ({ recipients, allProofs, proofFor }: MerkleTreeArgs, { ethers }) => {
      const parsedRecipients =
        recipients.length === 1 && recipients[0].toLowerCase().endsWith('.json')
          ? JSON.parse(readFileSync(recipients[0]).toString())
          : recipients;
      const leafNodes = parsedRecipients.map((addr: string) =>
        getAddress(addr)
      );
      const tree = new MerkleTree(leafNodes, keccak256, {
        hashLeaves: true,
        sortPairs: true,
      });
      const root = tree.getHexRoot();
      console.error(root);
      console.error(tree.toString());

      const proofAddresses = allProofs
        ? leafNodes
        : proofFor
        ? [ethers.utils.getAddress(proofFor)]
        : [];

      const output: MerkleOutput = { root, proofs: {} };
      proofAddresses.forEach((proofAddress: string) => {
        const leaf = keccak256(proofAddress);
        const proof = tree.getHexProof(leaf);
        if (!tree.verify(proof, leaf, root)) {
          console.error('\ninvalid claimant for merkle proof!');
          process.exit(1);
        }
        if (!allProofs) {
          console.error(' root: ', root);
          console.error('proof: ');
          console.error(proof);
        }
        output.proofs[proofAddress.toLowerCase()] = proof;
      });
      if (allProofs) {
        console.log(JSON.stringify(output, undefined, 4));
      }
    }
  );
