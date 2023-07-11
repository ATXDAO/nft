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
  allProofs: boolean;
  proofFor?: string;
}

interface MerkleRecord {
  address: string;
  tokenURI: string;
}

export interface MerkleOutput {
  root: string;
  proofs: Record<string, string[]>;
}

const concatAndHashAddressAndString = (
  address: string,
  str: string
): string => {
  const addressBytes = arrayify(getAddress(address));
  const stringBytes = toUtf8Bytes(str);
  const concatenated = concat([addressBytes, stringBytes]);
  return keccak256(concatenated);
};

task<MinterMerkleArgs>(
  'minter-merkle',
  'generate a merkle tree from a json file of [{"address": "0x...", "tokenURI": "..."}, ...]}]'
)
  .addPositionalParam(
    'jsonFile',
    'json file of [{"address": "0x...", "tokenURI": "..."}, ...]}'
  )
  .addFlag('allProofs', 'generate proofs for all recipients')
  .addOptionalParam(
    'proofFor',
    'generate proof for a given recipient address (ignored if allProofs is set)'
  )
  .setAction(
    async ({ jsonFile, allProofs, proofFor }: MinterMerkleArgs, {}) => {
      const parsedRecipients: MerkleRecord[] = JSON.parse(
        readFileSync(jsonFile).toString()
      );
      const dataByAddress = parsedRecipients.reduce(
        (acc: Record<string, string>, { address, tokenURI }) => {
          acc[address] = concatAndHashAddressAndString(
            getAddress(address),
            tokenURI
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

      const proofAddresses = allProofs
        ? dataByAddress
        : proofFor
        ? { [getAddress(proofFor)]: dataByAddress[getAddress(proofFor)] }
        : [];

      const output: MerkleOutput = { root, proofs: {} };

      Object.entries(proofAddresses).forEach(([address, data]) => {
        const leaf = data;
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
        output.proofs[address.toLowerCase()] = proof;
      });
      if (allProofs) {
        console.log(JSON.stringify(output, undefined, 4));
      }
    }
  );
