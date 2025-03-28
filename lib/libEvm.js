/**
 * libEvm.js
 * Author: Dr Martín Raskovsky
 * Date: March 2025
 * Description: Wrapper for native and token balance access on EVM-compatible chains (e.g., ETH, BNB, POL, VTRU)
 */

const { ethers } = require('ethers');

/**
 * Returns the native coin balance (in wei) as BigInt
 */
async function getNativeBalance(provider, wallet) {
  //console.log(`libEvm::getNativeBalance(${wallet})`);
  const balance = await provider.getBalance(wallet);
  return BigInt(balance.toString());
}

/**
 * Returns the ERC-20 token balance as BigInt (raw units)
 */
/*async function getTokenBalance(address, tokenAddress, options = {}) {
  console.log(`libEvm::getTokenBalance(${address})`);
  const provider = options.provider || new ethers.providers.JsonRpcProvider(options.rpcUrl);
  const erc20 = new ethers.Contract(tokenAddress, [
    'function balanceOf(address) view returns (uint256)',
  ], provider);

  const balance = await erc20.balanceOf(address);
  return BigInt(balance.toString());
}*/

/**
 * Formats native coin balance using fixed 18 decimals (ETH, BNB, etc.)
 */
function formatNativeBalance(rawValue, fixed = 2) {
  const value = ethers.formatUnits(rawValue, 18);
  return Number(value).toFixed(fixed);
}

/**
 * Formats ERC-20 token balance using provided decimals
 */
function formatTokenBalance(rawValue, decimals, fixed = 2) {
  const value = ethers.utils.formatUnits(rawValue, decimals);
  return Number(value).toFixed(fixed);
}

module.exports = {
  getNativeBalance,
  //getTokenBalance,
  formatNativeBalance,
  formatTokenBalance,
};

