#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Unit tests for the VtruVault class.
* These tests use the actual class and do not rely on mocks.
*/

const { formatNumber, scaleDown } = require('../lib/vtruUtils');
const VtruConfig = require('../lib/vtruConfig');
const VtruWeb3 = require('../lib/vtruWeb3');

async function main() {
  try {
    const config   = new VtruConfig('CONFIG_JSON_FILE_PATH', 'mainnet');
    const web3     = new VtruWeb3(config);
    const walletsStr  = config.get('WALLETS');
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
