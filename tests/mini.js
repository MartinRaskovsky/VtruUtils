#!/usr/bin/env node

const { ethers, Contract } = require("ethers");
const config = require("../data/vtru-contracts.json");

require ("dotenv").config();

const VTRU = "vtru";
const BSC = "bsc";
const ETH = "eth";
const WVTRU = "wVTRU";
const VTRUBridged = "VTRUBridged";

const rpcUrls = {
    [VTRU]: "https://rpc.vitruveo.xyz",
    [BSC]: "https://bsc-dataseed.binance.org",
    [ETH]: "https://rpc.mevblocker.io",
};

const jsonPaths = {
    [VTRU]: "CONFIG_JSON_FILE_PATH",
    [BSC]: "CONFIG_JSON_BSC_PATH",
    [ETH]: "CONFIG_JSON_ETH_PATH",
};

const labels = {
    [WVTRU]: "wVTRU",
    [VTRUBridged]: "VTRUBridged",
};

const TARGET_TOKEN = VTRUBridged;
const TARGET_NETWORK = BSC;

const ABI = labels[TARGET_TOKEN];;

const ETH_ADDRESS = '0x7070F01A2040bD06109C6fC478cd139b323459af';
const ADDRESS = ETH_ADDRESS;

const PROVIDER = rpcUrls[TARGET_NETWORK];

const DECIMALS = Math.pow(10, 18);
const provider = new ethers.JsonRpcProvider(PROVIDER);
const contract_address = ADDRESS;
const abi = config.abi[ABI];
const wallet = '0xd07d220d7e43eca35973760f8951c79deebe0dcc';

(async () => {
 
    try {
	const contract = new Contract(contract_address, abi, provider);
	const balance = await contract.balanceOf(wallet);
    console.log(`netwwork=${TARGET_NETWORK}`);
    console.log(`contract=${contract_address}`);
    console.log(`token=${TARGET_TOKEN}`);

	console.log(balance);
    } catch(e) {
        console.log(e);
    }
})();
