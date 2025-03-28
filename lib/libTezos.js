/**
 * libTezos.js
 * Author: Dr Martín Raskovsky
 * Date: March 2025
 * Description: Wrapper for native and FA1.2 token balance access on the Tezos blockchain
 */

const { TezosToolkit } = require('@taquito/taquito');
//const TEZOS_RPC = 'https://mainnet.api.tez.ie';

/**
 * Returns the native XTZ balance (in mutez) as BigInt
 */
async function getNativeBalance(provider, wallet) {
  //console.log(`libTezos::getNativeBalance(${wallet})`);
  const mutez = await provider.tz.getBalance(wallet);
  return BigInt(mutez.toString());
}

/**
 * Returns the FA1.2 token balance (raw BigInt)
 */
/*async function getTokenBalance(address, tokenAddress, options = {}) {
  const Tezos = new TezosToolkit(options.rpcUrl || TEZOS_RPC);
  const contract = await Tezos.contract.at(tokenAddress);
  const storage = await contract.storage();

  const raw = await storage.balances.get(address);
  return raw ? BigInt(raw.toString()) : BigInt(0);
}*/

/**
 * Formats native XTZ balance using fixed 6 decimals
 */
function formatNativeBalance(rawValue, fixed = 2) {
  const factor = BigInt(1_000_000); // 10^6 mutez
  const whole = rawValue / factor;
  const frac = rawValue % factor;
  const fracStr = frac.toString().padStart(6, '0').slice(0, fixed);
  return `${whole}.${fracStr}`;
}

/**
 * Formats FA1.2 token balance using provided decimals
 */
function formatTokenBalance(rawValue, decimals, fixed = 2) {
  const factor = BigInt(10 ** decimals);
  const whole = rawValue / factor;
  const frac = rawValue % factor;
  const fracStr = frac.toString().padStart(decimals, '0').slice(0, fixed);
  return `${whole}.${fracStr}`;
}

module.exports = {
  getNativeBalance,
  //getTokenBalance,
  formatNativeBalance,
  formatTokenBalance,
};

