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

interface AddressData {
  tokenURI: string;
  isNewMember: boolean;
}

interface AddressLeaf extends AddressData {
  leaf: string;
}

interface AddressProof extends AddressData {
  proof: string[];
}

export interface MerkleOutput {
  root: string;
  addressData: Record<string, AddressProof>;
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
      (
        acc: Record<string, AddressLeaf>,
        { address, tokenURI, isNewMember }
      ) => {
        acc[address] = {
          // this is really a leaf of the tree, not the proof
          leaf: concatAndHashAddressAndString(
            getAddress(address),
            tokenURI,
            isNewMember
          ),
          tokenURI,
          isNewMember,
        };
        return acc;
      },
      {}
    );
    const leafNodes = Object.values(dataByAddress).map(({ leaf }) => leaf);
    const tree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });
    const root = tree.getHexRoot();
    console.error(root);
    console.error(tree.toString());

    const output: MerkleOutput = { root, addressData: {} };

    Object.entries(dataByAddress).forEach(
      ([address, { leaf, isNewMember, tokenURI }]) => {
        const proof = tree.getHexProof(leaf);
        if (!tree.verify(proof, leaf, root)) {
          console.error('\ninvalid claimant for merkle proof!');
          process.exit(1);
        }
        output.addressData[address.toLowerCase()] = {
          tokenURI,
          isNewMember,
          proof,
        };
      }
    );
    console.log(JSON.stringify(output, undefined, 2));
  });
