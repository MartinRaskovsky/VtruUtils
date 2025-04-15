#!/usr/bin/env node

const { ethers } = require("ethers");

const RPC_BASE = "https://base.publicnode.com";
const tokenAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const walletAddress = "0x6152f12d34648826b94324f9b8a54e1ad818880f";
const abi = ["function balanceOf(address) view returns (uint256)"];
const provider = new ethers.JsonRpcProvider(RPC_BASE);

(async () => {

    const code = await provider.getCode(walletAddress);
    if (code === "0x") {
        console.log("WALLET OK=", walletAddress);
    } else {
        console.log("Not a simple wallet!");
    }

    const contract = new ethers.Contract(tokenAddress, abi, provider);
    const balance = await contract.balanceOf(walletAddress);
    console.log('BALANCE=', balance.toString());

})();
