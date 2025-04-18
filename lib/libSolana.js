/**
 * libSolana.js
 * Author: Dr Martín Raskovsky
 * Date: March 2025
 * Description: Wrapper for native and SPL token balance access on the Solana blockchain
 */

const { Connection, PublicKey } = require('@solana/web3.js');
//const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

/**
 * Returns the native SOL balance (in lamports)
 */
async function getNativeBalance(provider, wallet) {
    //console.log(`libSolana::getNativeBalance(${wallet})`);
    const pubkey = new PublicKey(wallet);
    const balance = await provider.getBalance(pubkey);
    return BigInt(balance);
}

/**
 * Returns the SPL token balance (raw integer units)
 */
/*async function getTokenBalance(address, tokenAddress, options = {}) {
  console.log(`libSolana::getTokenBalance(${address})`);
  const connection = new Connection(options.rpcUrl || SOLANA_RPC);
  const owner = new PublicKey(address);
  const mint = new PublicKey(tokenAddress);

  const tokens = await connection.getParsedTokenAccountsByOwner(owner, { mint });

  const amountStr =
    tokens?.value?.[0]?.account?.data?.parsed?.info?.tokenAmount?.amount;

  return amountStr ? Number(amountStr) : 0;
}*/

/**
 * Formats native SOL balance using fixed 9 decimals
 */
function formatNativeBalance(rawValue, fixed = 2) {
  const value = rawValue / 1e9;
  return value.toFixed(fixed);
}

/**
 * Formats SPL token balance using provided decimals
 */
function formatTokenBalance(rawValue, decimals, fixed = 2) {
  const value = rawValue / 10 ** decimals;
  return value.toFixed(fixed);
}

module.exports = {
  getNativeBalance,
  //getTokenBalance,
  formatNativeBalance,
  formatTokenBalance,
};

