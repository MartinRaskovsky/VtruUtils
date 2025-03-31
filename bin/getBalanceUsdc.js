#!/usr/bin/env node

/**
 * getBalanceUsdc.js
 * 
 * Test for USDC balance on Polygon using tokenCommonEvm and multicall (viem).
 */

const Web3 = require("../lib/libWeb3");
const TokenCommonEvm = require("../lib/tokenCommonEvm");

const wallets = [
  "0x9780e0f65Df2A5F11665e002Cb0A041a078EF0B8",
  "0xe807627990010f5fC9A0D71264402475aEd81390",
  "0x349a6fDD48Dd109f996D37c43B2df3476972E45A"
];

(async () => {
  const web3 = Web3.create(Web3.POL);
  const token = new TokenCommonEvm(web3, "USDC");

  const balances = await token.getBalances(wallets);

  console.log("USDC Balances on Polygon:");
  wallets.forEach((wallet, i) => {
    console.log(`- ${wallet}: ${balances[i]} units`);
  });
})();

