#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Unit tests for the VtruVault class.
* These tests use the actual class and do not rely on mocks.
*/

const { formatNumber, scaleDown } = require('../lib/vtruUtils');
const { Web3 } = require("../lib/libWeb3");

async function main() {
  try {
    const web3 = await Web3.create(Web3.VTRU);
    const walletsStr  = web3.getConfig().get('WALLETS');
    const wallets = walletsStr.split(",").map(item => item.trim());
    console.log(wallets);

    for (const wallet of wallets) {
      console.log(`'Balance in ${wallet}:'`,   formatNumber(scaleDown(await web3.getWalletRawBalance(wallet))));
    }


  } catch (error) {
  console.error('Error:', error.message);
  }
}

main();
