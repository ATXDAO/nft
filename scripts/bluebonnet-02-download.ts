import { readFileSync, createWriteStream, unlink, existsSync } from 'fs';
import https from 'https';
import { globSync } from 'glob';
import { task } from 'hardhat/config';
import { mkdirpSync } from 'mkdirp';

interface MinterData {
  address: string;
  imageUrl: string;
  isNewMember: boolean;
  imageHash: string;
}

export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}

const downloadImage = (imageUrl: string, dest: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (existsSync(dest)) {
      console.error(`File ${dest} already exists`);
      resolve();
      return;
    }
    console.error(`downloading ${imageUrl} to ${dest}`);
    const file = createWriteStream(dest, { flags: 'wx' });

    https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(
          new Error(`Failed to get '${imageUrl}' (${response.statusCode})`)
        );
        return;
      }

      response.pipe(file);
    });

    file.on('finish', () => resolve());
    file.on('error', (error: ErrnoException) => {
      file.close();
      if (error.code === 'EEXIST') reject(new Error('File already exists'));
      else unlink(dest, () => reject(error));
    });
  });

task(
  'bluebonnet-02-download',
  'from metadata groups, download images'
).setAction(async ({}, {}): Promise<void> => {
  const groups = globSync('metadata/bluebonnet/groups/*.json').map((path) => {
    const groupName = path.split('/').pop()?.replace('.json', '');
    if (!groupName) {
      throw new Error(`invalid path ${path}`);
    }
    const minters: MinterData[] = JSON.parse(readFileSync(path, 'utf8'));
    return { groupName, minters };
  });

  // check for duplicate image hashes
  groups.forEach(({ minters }) => {
    const seenHashes: Set<string> = new Set();
    minters.forEach(({ imageHash, address }) => {
      if (seenHashes.has(imageHash)) {
        throw new Error(`duplicate image hash ${imageHash} for ${address}`);
      }
      seenHashes.add(imageHash);
    });
  });

  for (const { groupName, minters } of groups) {
    const imagePath = `metadata/bluebonnet/images/${groupName}`;
    await Promise.all(
      minters.map(async ({ imageHash, imageUrl }) => {
        const imageDest = `${imagePath}/${imageHash}.png`;
        mkdirpSync(imagePath);
        await downloadImage(imageUrl, imageDest);
      })
    );
  }
});
