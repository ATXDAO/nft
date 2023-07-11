import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@typechain/hardhat';
import dotenv from 'dotenv';
import fs from 'fs';
import 'hardhat-deploy';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config();

if (fs.existsSync('typechain-types')) {
  require('./scripts/classic-merkle');
  require('./scripts/end-mint');
  require('./scripts/get-nft-owners');
  require('./scripts/gas-price');
  require('./scripts/mint');
  require('./scripts/mint-special');
  require('./scripts/minter-merkle');
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
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
