import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { task } from 'hardhat/config';

interface MinterData {
  address: string;
  imageUrl: string;
  isNewMember: boolean;
  imageHash: string;
}

interface Output {
  address: string;
  tokenURI: string;
  isNewMember: boolean;
}

const metaGroupCidrs: Record<string, string> = {
  '00': 'QmUHL3QB4UvmzvBBNzkuy1tx3jjbKWKbRVtuS2zw5pGyNv',
};

task(
  'bluebonnet-04-prepare-merkle',
  'prepare manifest for merkle tree generation'
).setAction(async ({}, {}): Promise<void> => {
  const groups = globSync('metadata/bluebonnet/groups/*.json').map((path) => {
    const groupName = path.split('/').pop()?.replace('.json', '');
    if (!groupName) {
      throw new Error(`invalid path ${path}`);
    }
    const minters: MinterData[] = JSON.parse(readFileSync(path, 'utf8'));
    const cidr = metaGroupCidrs[groupName];
    if (!cidr) {
      throw new Error(
        `couldn't find metaGroupCidr for group ${groupName}, try manually uploading metadata/bluebonnet/json/${groupName}`
      );
    }
    return { groupName, cidr, minters };
  });

  let allMinters: Output[] = [];
  for (const { cidr, minters } of groups) {
    allMinters = [
      ...allMinters,
      ...minters.map(({ address, isNewMember, imageHash }) => ({
        address,
        isNewMember,
        tokenURI: `ipfs://${cidr}/${imageHash}.json`,
      })),
    ];
  }
  writeFileSync(
    'metadata/bluebonnet/minters.json',
    JSON.stringify(allMinters, null, 2)
  );
  console.error(`generated manifest of ${allMinters.length} minters`);
});
