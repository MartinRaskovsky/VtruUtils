#!/usr/bin/env node

const { ethers, Contract } = require("ethers");
const config = require("../data/vtru-contracts.json");

require ("dotenv").config();

const VTRU = "vtru";
const BSC = "bsc";
const ETH = "eth";
const WVTRU = "wVTRU";
const VTRUBridged = "VTRUBridged";
const USDC = "USDC";

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
    [USDC]: "USDC",
};

const TARGET_TOKEN = USDC;
const TARGET_NETWORK = VTRU;

const ABI = labels[TARGET_TOKEN];;

const ETH_ADDRESS = '0x7070F01A2040bD06109C6fC478cd139b323459af';
const USDC_ADDRESS = '0xbCfB3FCa16b12C7756CD6C24f1cC0AC0E38569CF';
const ADDRESS = USDC_ADDRESS;

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
