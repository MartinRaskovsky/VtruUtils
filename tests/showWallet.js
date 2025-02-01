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
const VtruWeb3 = require('../lib/vtruWeb3');

async function main() {
  try {
    const config  = new VtruConfig('CONFIG_JSON_FILE_PATH', 'mainnet');
    const web3    = new VtruWeb3(config);
    const wallet  = config.get('WALLET_ADDRESS');

    console.log(`'Balance in ${wallet}:'`,   formatNumber(await web3.getWalletRawBalance(wallet)));


  } catch (error) {
  console.error('Error:', error.message);
  }
}

main();
