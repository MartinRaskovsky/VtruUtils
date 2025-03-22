#!/usr/bin/env node

const { ethers, Contract } = require("ethers");
const config = require("../data/vtru-contracts.json");

require ("dotenv").config();

const VTRU = "vtru";
const BSC = "bsc";
const ETH = "eth";
const POL = "pol";

const WVTRU = "wVTRU";
const VTRUBridged = "VTRUBridged";
const USDC = "USDC";
const SEVO = "SEVO";

const rpcUrls = {
    [VTRU]: "https://rpc.vitruveo.xyz",
    [BSC]: "https://bsc-dataseed.binance.org",
    [ETH]: "https://rpc.mevblocker.io",
    [POL]: "https://polygon-rpc.com",
};

const jsonPaths = {
    [VTRU]: "CONFIG_JSON_FILE_PATH",
    [BSC]: "CONFIG_JSON_BSC_PATH",
    [ETH]: "CONFIG_JSON_ETH_PATH",
    [POL]: "CONFIG_JSON_POL_PATH",
};

const labels = {
    [WVTRU]: "wVTRU",
    [VTRUBridged]: "VTRUBridged",
    [USDC]: "USDC",
    [SEVO]: "SEVO",
};

const TARGET_TOKEN = SEVO;
const TARGET_NETWORK = VTRU;

const ABI = labels[TARGET_TOKEN];;

const ETH_ADDRESS = '0x7070F01A2040bD06109C6fC478cd139b323459af';
const USDC_ADDRESS = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
const SEVO_ADDRESS = '0x2A34059DF3D60B1864f10F10492746bd26d3D24a';
const ADDRESS = SEVO_ADDRESS;

const PROVIDER = rpcUrls[TARGET_NETWORK];

const DECIMALS = Math.pow(10, 18);
const provider = new ethers.JsonRpcProvider(PROVIDER);
const contract_address = ADDRESS;
const abi = config.abi[ABI];

//const wallet = '0xd07d220d7e43eca35973760f8951c79deebe0dcc';
const wallet = '0xa857dFB740396db406d91aEA65256da4d21721e4';

(async () => {
 
    try {
	const contract = new Contract(contract_address, abi, provider);
	const balance = await contract.balanceOf(wallet);
    console.log(`Network=${TARGET_NETWORK}`);
    console.log(`Contract=${contract_address}`);
    console.log(`Token=${TARGET_TOKEN}`);
    console.log(`Wallet=${wallet}`);

	console.log(balance);
    } catch(e) {
        console.log(e);
    }
})();
