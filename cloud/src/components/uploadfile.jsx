import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import ContractArtifact from "../DecentralizedStorage.json";
import {pinataApiKey,pinataSecretApiKey,contractAddress} from "../config.js";


// Example: Pinata API URL
const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

// Smart contract details

const contractABI = ContractArtifact.abi;

// Create the pinFileToIPFS function using Pinata
const pinFileToIPFS = async (file) => {
  const data = new FormData();
  data.append("file", file);

  try {
    const response = await axios.post(pinataUrl, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });
    return response.data.IpfsHash; // The IPFS hash (CID) of the uploaded file
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
  }
};

// Function to interact with the Ethereum contract without MetaMask (using Ganache)
const uploadFileToBlockchain = async (fileCID, fileSize) => {
  try {
    // Connecting to Ganache using JSON-RPC Provider
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545"); // Ganache default URL
    const signer = provider.getSigner(0); // Using the first account from Ganache

    // Interacting with the contract
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Sending the transaction
    const tx = await contract.uploadFile(fileCID, fileSize);
    console.log("Transaction Hash:", tx.hash);

    // Waiting for the transaction to be mined
    await tx.wait();
    console.log("File uploaded to the blockchain successfully");
  } catch (error) {
    console.error("Error interacting with contract:", error);
  }
};

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected!");
      return;
    }

    // Upload the file to Pinata
    const fileCID = await pinFileToIPFS(selectedFile);

    if (fileCID) {
      console.log("File uploaded to IPFS:", fileCID);

      // Get file size
      const fileSize = selectedFile.size;

      // Upload the file CID and size to the blockchain
      await uploadFileToBlockchain(fileCID, fileSize);
    }
  };

  return (
    <div>
      <h1>Decentralized File Storage</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
};

export default App;
