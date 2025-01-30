import { URL, privatekey } from "./config.js";  // Use import
import '@nomiclabs/hardhat-ethers';  // Use import instead of require

export default {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: URL,  // Ganache RPC URL
      accounts: [privatekey],  // Private key must be inside an array
    },
  },
};
