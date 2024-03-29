import { readFileSync } from 'fs';
import { globSync } from 'fast-glob';
import { google } from 'googleapis';
import { task } from 'hardhat/config';
import { ATXDAONFT_V2 } from '../typechain-types';
import { getContractAddress } from '../util/contract-meta';
import {
  getAddress,
  arrayify,
  toUtf8Bytes,
  concat,
  keccak256,
} from 'ethers/lib/utils';

interface MinterInput {
  addressOrEns: string;
  imageUrl: string;
  isNewMember: boolean;
}

interface MinterData {
  address: string;
  imageUrl: string;
  isNewMember: boolean;
  imageHash: string;
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

const getImageHash = (address: string, imageUrl: string): string => {
  const addressBytes = arrayify(getAddress(address));
  const imageBytes = toUtf8Bytes(imageUrl);
  const concatenated = concat([addressBytes, imageBytes]);
  return keccak256(concatenated).slice(-6);
};

task(
  'bluebonnet-01-fetch-minters',
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
    ...(await getWorksheetData('Free NFT', true)),
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
      return { address, imageUrl, isNewMember };
    })
  );

  const newMinters = await Promise.all(
    resolvedMembers
      .filter(({ address }) => !(address in minterMap))
      .map(async ({ address, imageUrl, isNewMember }) => {
        seenAddresses.add(address);
        const nftBalance = await nftv2.balanceOf(address);
        if (isNewMember && !nftBalance.eq(0)) {
          throw new Error(`${address} (${imageUrl}) is already a member`);
        }
        if (!isNewMember && nftBalance.eq(0)) {
          throw new Error(
            `${address} (${imageUrl}) does not own a membership NFT`
          );
        }
        return {
          address,
          imageUrl: imageUrl,
          isNewMember: isNewMember,
          imageHash: getImageHash(address, imageUrl),
        };
      })
  );

  console.log(JSON.stringify(newMinters, null, 2));
});
