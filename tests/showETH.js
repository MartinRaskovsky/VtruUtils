#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: February 2025
* 
* Unit tests for the totalETH Network.
* These tests use network and do not rely on mocks.
*/

const { formatRawNumber } = require('../lib/vtruUtils');
const { ethers } = require("ethers");

async function main() {

const rpcUrL = 'https://rpc.mevblocker.io';
const provider = new ethers.JsonRpcProvider(rpcUrL);
const wallet = '0x0e476B2dc47643E71d2A85BadE57407260D1d976';

let latestBlockNumber = 0;
const _readyPromise = checkConnection();

const balance =  await getBalance();
console.log('balance: ', formatRawNumber(balance, 4));

async function checkConnection() {
    try {
      latestBlockNumber = await provider.getBlockNumber();
    } catch (error) {
      console.error("❌ Error: Unable to connect. Please check your internet connection.");
      process.exit(1);
    }
  }

async function getBalance() {
    try {
      return await provider.getBalance(wallet);
    } catch (error) {
      console.error("❌ Error: Unable to connect. Please check your internet connection.");
      process.exit(1);
    }
  }

async function getLatestBlockNumber() {
    await _readyPromise;
    return latestBlockNumber;
  }
}

try {
    main();
  } catch (error) {
    console.error("❌ Error: ", error);
    process.exit(1);
  }

