import './scripts/merkle-tree';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config();

const { MAINNET_RPC_URL, ROPSTEN_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } =
  process.env;
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
  },
  networks: {
    hardhat: {},
    ropsten: {
      url: ROPSTEN_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
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
