#!/usr/bin/env node

const { TezosToolkit } = require('@taquito/taquito');

const TEZOS_RPC = 'https://mainnet.api.tez.ie';
const wallet = 'tz1R7tXrF5LM783mQFmEPp3qg14ooqakCcJ8';

function timeoutPromise(ms, chainName) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout (${chainName}) after ${ms}ms`)), ms)
  );
}

(async () => {
  try {
    const Tezos = new TezosToolkit(TEZOS_RPC);
    const balance = await Promise.race([
      Tezos.tz.getBalance(wallet),
      timeoutPromise(5000, 'Tezos')
    ]);
    console.log(`Balance: ${balance.toNumber() / 1_000_000} ꜩ`);
  } catch (error) {
    console.error(`❌ Error fetching Tezos balance for ${wallet}:`, error.message);
  }
})();

