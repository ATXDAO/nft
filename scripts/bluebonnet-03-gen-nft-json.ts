import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'fast-glob';
import { task } from 'hardhat/config';
import { mkdirpSync } from 'mkdirp';

interface MinterData {
  address: string;
  imageUrl: string;
  isNewMember: boolean;
  imageHash: string;
}

const imageGroupCidrs: Record<string, string> = {
  '00': 'QmcLVWR5m5UPJdWCq8HS6ffBHz2xWzuVh2qBKHE1SjW8Tc',
};

task(
  'bluebonnet-03-gen-nft-json',
  'generate json metadata for bluebonnet groups'
).setAction(async ({}, {}): Promise<void> => {
  const groups = globSync('metadata/bluebonnet/groups/*.json').map((path) => {
    const groupName = path.split('/').pop()?.replace('.json', '');
    if (!groupName) {
      throw new Error(`invalid path ${path}`);
    }
    const minters: MinterData[] = JSON.parse(readFileSync(path, 'utf8'));
    return { groupName, minters };
  });

  for (const { groupName, minters } of groups) {
    const jsonPath = `metadata/bluebonnet/json/${groupName}`;
    mkdirpSync(jsonPath);
    const imageGroupCidr = imageGroupCidrs[groupName];

    if (!imageGroupCidr) {
      throw new Error(
        `couldn't find imageGroupCidr for group ${groupName}, try manually uploading metadata/bluebonnet/images/${groupName}`
      );
    }

    for (const { imageHash } of minters) {
      const tokenUriJson = {
        attributes: [{ trait_type: 'Edition', value: 'Bluebonnet' }],
        description: 'ATX DAO Membership: Bluebonnet Edition',
        image: `ipfs://${imageGroupCidr}/${imageHash}.png`,
        name: 'ATX DAO Membership',
      };

      writeFileSync(
        `${jsonPath}/${imageHash}.json`,
        JSON.stringify(tokenUriJson)
      );
    }
  }
});