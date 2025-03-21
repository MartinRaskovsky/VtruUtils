#!/usr/bin/env node

const { ethers, Contract } = require("ethers");

// Polygon Mainnet RPC
const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
const PolygonExplorer = 'https://polygonscan.com/';

// USDC Contract Address on Polygon
const usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

// List of known USDC contract addresses
const usdcContracts = [
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Official USDC
  "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  //"0xCaD6B92434F8Bd6aaC3C7E49bA2C50EFdb6b6a48", // Old PoS USDC
  //"0x56671D1aEb07D3C7f0C05598E38dFd25a14cD7c8", // PoS Bridge USDC
  //"0x5fE2B58c013d7601147DcdD68C143A77499f5531"  // Wrapped USDC
];

// Minimal ABI for ERC-20
const usdcAbi = [ 
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

// Connect to USDC contract
const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, provider);

// Example: Fetch Balance of a Wallet
async function getUsdcBalance(walletAddress) {
  const balance = await usdcContract.balanceOf(walletAddress);
  console.log(`USDC Balance: ${ethers.formatUnits(balance, 6)} USDC`);
  /*for (const contractAddress of usdcContracts) {
    const usdcContract = new ethers.Contract(contractAddress, usdcAbi, provider);
    const balance = await usdcContract.balanceOf(walletAddress);
    console.log(`Balance for USDC at ${contractAddress}: ${ethers.formatUnits(balance, 6)} USDC`);
  }*/
}

async function getMaticBalance(walletAddress) {
  const balanceWei = await provider.getBalance(walletAddress);
  const balanceMatic = ethers.formatEther(balanceWei); // Convert from wei to MATIC
  console.log(`POL (MATIC) Balance: ${balanceMatic} MATIC`);
}

const walletAddress = '0xa857dFB740396db406d91aEA65256da4d21721e4';
getMaticBalance(walletAddress);
getUsdcBalance(walletAddress);

