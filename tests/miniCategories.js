#!/usr/bin/env node

const { categorizeAddresses } = require('../lib/addressCategorizer');

const raw = [
  '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',  // EVM
  '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',  // Solana
  'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',         // Tezos
  '0xINVALIDADDRESS123',                          // Invalid
  'badinput'                                      // Invalid
];

const { evm, sol, tez, invalid } = categorizeAddresses(raw);

console.log("EVM:", evm);
console.log("Solana:", sol);
console.log("Tezos:", tez);
console.log("Invalid:", invalid);

