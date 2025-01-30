import pkg from "hardhat";  // Import Hardhat as a default package
const { ethers } = pkg;  // Extract ethers from Hardhat

async function main() {
    const Storage = await ethers.getContractFactory("DecentralizedStorage");
    const storage = await Storage.deploy();
    await storage.deployed();

    console.log("Contract deployed to:", storage.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
