#!/usr/bin/env node

const TokenUsdcSol = require('../lib/tokenUsdcSol');
const Web3 = require('../lib/libWeb3');

(async () => {
    const badWallets = [
        "badbase58",                                // invalid format
        "3XpKkV9yew3yrv6KyUzEEQHzzInvalidPadding",  // valid-ish, off-curve
        "So11111111111111111111111111111111111111112" // SOL token address, not a wallet
    ];

    const web3 = new Web3(Web3.SOL);  // use real RPC for error-based test
    const token = new TokenUsdcSol(web3);

    const results = await token.getBalances(badWallets);

    console.log("USDC Results:", results);
})();

