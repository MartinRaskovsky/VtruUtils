#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Unit tests for the VtruVault class.
* These tests use the actual class and do not rely on mocks.
*/

const { formatNumber } = require('../lib/vtruUtils');
const VtruConfig = require('../lib/vtruConfig');
const { Web3 } = require("../lib/libWeb3");

async function main() {
  try {
    const web3 = await Web3.create(Web3.VTRU);
    const wallet  = web3.getConfig().get('WALLET_ADDRESS');

    console.log(`'Balance in ${wallet}:'`,   formatNumber(await web3.getWalletRawBalance(wallet)));


  } catch (error) {
  console.error('Error:', error.message);
  }
}

main();
