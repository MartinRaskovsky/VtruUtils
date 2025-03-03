#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Unit tests for the VtruVault class.
* These tests use the actual class and do not rely on mocks.
*/

const { formatRawNumber, formatRawNumbers } = require('../lib/vtruUtils');
const Config = require('../lib/libConfig');
const Web3 = require("../lib/libWeb3");
const VtruVault = require('../lib/vtruVault');

async function main() {
  try {
    const web3 = await Web3.create(Web3.VTRU);
    const address = web3.getConfig().get('VAULT_ADDRESS');
    const vault   = new VtruVault(address, web3);

    const wallets = await vault.getVaultWallets();
    const balance = await vault.vaultBalance();

    console.log('Vault:   ',   address);
    console.log('Balance: ',   formatRawNumber(balance));  // produces nn.mm
    //console.log('Balance" ',   Number(balance) / 1e18); // produces nn.mmmmmmmmmm
    console.log('Name:    ',   await vault.getName());
    console.log('hasStakes: ', await vault.hasStakes());
    console.log('isBlocked: ', await vault.isBlocked());
    console.log('Wallets: ',   wallets);
    console.log('Balances:',   formatRawNumbers(await web3.getWalletRawBalances(wallets)));


  } catch (error) {
  console.error('Error:', error.message);
  }
}

main();
