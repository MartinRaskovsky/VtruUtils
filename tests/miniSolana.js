#!/usr/bin/env node

const { Connection, PublicKey } = require('@solana/web3.js');

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC);

// Replace with a valid Solana wallet address
const wallet = '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV';

try {
  const publicKey = new PublicKey(wallet);
  connection.getBalance(publicKey).then(balance => {
    console.log(`Wallet:  ${wallet}`);
    console.log(`Balance: ${balance} lamports`);
  });
} catch (error) {
  console.error(`Invalid Solana address: ${wallet}`);
}
