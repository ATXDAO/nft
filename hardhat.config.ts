import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@typechain/hardhat';
import dotenv from 'dotenv';
import fs from 'fs';
import 'hardhat-deploy';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config();

if (fs.existsSync('typechain-types')) {
  // bluebonnet merkle tree generation
  require('./scripts/bluebonnet-01-fetch-minters');
  require('./scripts/bluebonnet-02-download-images');
  require('./scripts/bluebonnet-03-gen-nft-json');
  require('./scripts/bluebonnet-04-prepare-merkle');
  require('./scripts/bluebonnet-05-gen-merkle-tree');

  // bluebonnet admin tasks
  require('./scripts/bluebonnet-start-mint');

  require('./scripts/classic-merkle');
  require('./scripts/end-mint');
  require('./scripts/get-nft-owners');
  require('./scripts/gas-price');
  require('./scripts/mint');
  require('./scripts/mint-special');
  require('./scripts/reset-has-minted');
  require('./scripts/set-merkle-root');
  require('./scripts/start-mint');
  require('./scripts/sweep-eth');
}

const {
  MAINNET_RPC_URL,
  ROPSTEN_RPC_URL,
  PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  RINKEBY_RPC_URL,
  SEPOLIA_RPC_URL,
} = process.env;
const privateKeys = PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : undefined;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: 'contracts/',
    tests: 'contracts/test',
  },
  networks: {
    hardhat: {},
    ropsten: {
      url: ROPSTEN_RPC_URL,
      accounts: privateKeys,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: privateKeys,
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: privateKeys,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: privateKeys,
    },
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
