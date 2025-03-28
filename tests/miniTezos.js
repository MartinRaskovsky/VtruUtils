#!/usr/bin/env node

const { TezosToolkit } = require('@taquito/taquito');

//const TEZOS_RPC = 'https://mainnet.tezos.marigold.dev';
const TEZOS_RPC = 'https://mainnet.api.tez.ie';
const wallet = 'tz1R7tXrF5LM783mQFmEPp3qg14ooqakCcJ8';

(async () => {
  try {
    const Tezos = new TezosToolkit(TEZOS_RPC);
    const balance = await Tezos.tz.getBalance(wallet);
    console.log(`Balance: ${balance.toNumber() / 1_000_000} ꜩ`);
  } catch (error) {
    console.error(`❌ Error fetching Tezos balance for ${wallet}:`, error.message);
  }
})();

