import { readFileSync } from 'fs';
import { globSync } from 'glob';
import { google } from 'googleapis';
import { task } from 'hardhat/config';
import { ATXDAONFT_V2 } from '../typechain-types';
import { getContractAddress } from '../util/contract-meta';
import { getAddress } from 'ethers/lib/utils';

interface MinterInput {
  addressOrEns: string;
  imageUrl: string;
  isNewMember: boolean;
}

interface MinterData {
  address: string;
  imageUrl: string;
  isNewMember: boolean;
}

async function getWorksheetData(
  sheetName: string,
  isNewMember: boolean
): Promise<MinterInput[]> {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(
      readFileSync('keys/atxdao-service-account.json', 'utf8')
    ),
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const gsapi = google.sheets({ version: 'v4', auth });
  const data = (
    await gsapi.spreadsheets.values.get({
      spreadsheetId: '1PWOJ_pU5ac4puCjxrtNaKEuppPTaE3nI22vhkHDpiAE', // replace with your spreadsheet ID
      range: `${sheetName}!A2:M500`,
      valueRenderOption: 'UNFORMATTED_VALUE',
    })
  ).data.values;

  if (!data) {
    throw new Error('no data found');
  }

  return data
    .filter((row) => row && row[3])
    .map(
      (row): MinterInput => ({
        addressOrEns: row[3],
        imageUrl: row[4],
        isNewMember,
      })
    );
}

task(
  'bluebonnet-01-meta',
  'fetch bluebonnet metadata from google sheets and generate metadata groups'
).setAction(async ({}, { ethers, network }): Promise<void> => {
  let previousMinters: MinterData[] = [];
  globSync('metadata/bluebonnet/groups/*.json').forEach((path) => {
    try {
      const group = JSON.parse(readFileSync(path, 'utf8'));
      previousMinters = [...previousMinters, ...group];
    } catch (e) {}
  });
  console.error(`found ${previousMinters.length} existing minters`);
  const minterMap = previousMinters.reduce(
    (acc: Record<string, MinterData>, minter) => {
      const { address } = minter;
      const checksummedAddress = getAddress(address);
      acc[checksummedAddress] = minter;
      return acc;
    },
    {}
  );

  const networkName = network.name === 'hardhat' ? 'mainnet' : network.name;

  const nftv2 = (await ethers.getContractAt(
    'ATXDAONFT_V2',
    getContractAddress('ATXDAONFT_V2', networkName)
  )) as ATXDAONFT_V2;

  const memberData = [
    ...(await getWorksheetData('New Members', true)),
    ...(await getWorksheetData('Trade in', false)),
  ];

  const seenAddresses = new Set<string>();

  const resolvedMembers = await Promise.all(
    memberData.map(async ({ addressOrEns, imageUrl, isNewMember }) => {
      const address = await ethers.provider.resolveName(addressOrEns);
      if (!address) {
        throw new Error(`could not resolve ${addressOrEns} for ${imageUrl}`);
      }
      if (seenAddresses.has(address)) {
        throw new Error(
          `duplicate address ${address} (${addressOrEns}) for ${imageUrl}`
        );
      }
      seenAddresses.add(address);
      const nftBalance = await nftv2.balanceOf(address);
      if (isNewMember && !nftBalance.eq(0)) {
        throw new Error(`${address} (${addressOrEns}) is already a member`);
      }
      if (!isNewMember && nftBalance.eq(0)) {
        throw new Error(
          `${address} (${addressOrEns}) does not own a membership NFT`
        );
      }
      return {
        address,
        imageUrl: imageUrl,
        isNewMember: isNewMember,
      };
    })
  );

  const newMinters = resolvedMembers.filter(
    ({ address }) => !minterMap[address]
  );

  console.log(JSON.stringify(newMinters, null, 2));
});
