/* eslint-disable indent */
import {
  getAddress,
  arrayify,
  toUtf8Bytes,
  concat,
  keccak256,
} from 'ethers/lib/utils';
import { readFileSync } from 'fs';
import { task } from 'hardhat/config';
// import keccak256 from 'keccak256';
import { MerkleTree } from 'merkletreejs';

interface MinterMerkleArgs {
  jsonFile: string;
}

interface MerkleRecord {
  address: string;
  tokenURI: string;
  isNewMember: boolean;
}

export interface MerkleOutput {
  root: string;
  proofs: Record<string, string[]>;
}

const concatAndHashAddressAndString = (
  address: string,
  str: string,
  isNewMember: boolean
): string => {
  const addressBytes = arrayify(getAddress(address));
  const isNewMemberBytes = arrayify(isNewMember ? 1 : 0);
  const stringBytes = toUtf8Bytes(str);
  const concatenated = concat([addressBytes, isNewMemberBytes, stringBytes]);
  return keccak256(concatenated);
};

task<MinterMerkleArgs>(
  'bluebonnet-05-gen-merkle-tree',
  'generate a merkle tree from a json file of [{"address": "0x...", "tokenURI": "..."}, ...]}]'
)
  .addPositionalParam(
    'jsonFile',
    'json file of [{"address": "0x...", "tokenURI": "..."}, ...]}'
  )
  .setAction(async ({ jsonFile }: MinterMerkleArgs, {}) => {
    const parsedRecipients: MerkleRecord[] = JSON.parse(
      readFileSync(jsonFile).toString()
    );
    const dataByAddress = parsedRecipients.reduce(
      (acc: Record<string, string>, { address, tokenURI, isNewMember }) => {
        acc[address] = concatAndHashAddressAndString(
          getAddress(address),
          tokenURI,
          isNewMember
        );
        return acc;
      },
      {}
    );
    const leafNodes = Object.values(dataByAddress);
    const tree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });
    const root = tree.getHexRoot();
    console.error(root);
    console.error(tree.toString());

    const output: MerkleOutput = { root, proofs: {} };

    Object.entries(dataByAddress).forEach(([address, data]) => {
      const leaf = data;
      const proof = tree.getHexProof(leaf);
      if (!tree.verify(proof, leaf, root)) {
        console.error('\ninvalid claimant for merkle proof!');
        process.exit(1);
      }
      output.proofs[address.toLowerCase()] = proof;
    });
    console.log(JSON.stringify(output, undefined, 2));
  });
