#!/usr/bin/env node

const { Connection } = require('@solana/web3.js');
const TokenWalletSol = require('../lib/tokenWalletSol');
const Web3 = require('../lib/libWeb3');

(async () => {
    const wallet = '2Nb27ALffHZoR9As5KqR2Q5f5ZuDCutNL2TWuZ3CzXkP'; // valid pubkey
    const fakeRpc = 'https://example.com/slow'; // guaranteed to timeout or fail
    const web3 = new Web3(Web3.SOL, { rpcUrl: fakeRpc });  // fake config for test

    const token = new TokenWalletSol(web3);
    const balances = await token.getBalances([wallet]);

    console.log("Result:", balances);
})();

