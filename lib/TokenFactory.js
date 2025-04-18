/**
 * TokenFactory.js
 * 
 * Centralizes creation of token contract instances based on section keys.
 * Maps section keys to their respective class, network, and formatting metadata.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Web3 = require('../lib/libWeb3');

const {
  formatRawNumber,
  formatRawNumbers,
  formatNumber,
  formatNumbers,
  formatSolNumber,
  formatSolNumbers,
  formatVusdNumber,
  formatVusdNumbers,
} = require('../lib/vtruUtils');

const TokenWallet = require('../lib/tokenWallet');
const TokenStakedVtru = require('../lib/tokenStakedVtru');
const TokenVtro = require('../lib/tokenVtro');
const TokenVusd = require('../lib/tokenVusd');
const TokenVerse = require('../lib/tokenVerse');
const TokenVibe = require('../lib/tokenVibe');
const TokenVortex = require('../lib/tokenVortex');
const TokenV3dex = require('../lib/tokenV3dex');
const TokenVitdex = require('../lib/tokenVitdex');
const TokenSevo = require('../lib/tokenSevo');
const TokenStakedSevoX = require('../lib/tokenStakedSevoX');
const TokenWalletSol = require('../lib/tokenWalletSol');
const TokenUsdcSol = require('../lib/tokenUsdcSol');

const TokenCommonFallback = require('./tokenCommonFallback');
const TokenUsdc = require('../lib/tokenUsdc');
const TokenUsdt = require('../lib/tokenUsdt');
const TokenUsdcBase = require('../lib/tokenUsdcBase');

const CommonEvmClass = TokenCommonFallback;
const TokenUsdcClass = TokenUsdc;
// ==== GENERATED SECTION MAP START ====
const {
  SEC_VTRU,
  SEC_ETH,
  SEC_AVAX,
  SEC_BNB,
  SEC_POL,
  SEC_SOL,
  SEC_TEZ,
  SEC_ETH_ARB,
  SEC_ETH_OPT,
  SEC_ETH_BASE,
  SEC_VTRU_ETH,
  SEC_VTRU_BSC,
  SEC_USDC_VTRU,
  SEC_USDC_ETH,
  SEC_USDC_BSC,
  SEC_USDC_POL,
  SEC_USDC_SOL,
  SEC_USDC_ARB,
  SEC_USDC_OPT,
  SEC_USDC_BASE,
  SEC_USDC_AVAX,
  SEC_USDT_ETH,
  SEC_USDT_POL,
  SEC_USDT_ARB,
  SEC_USDT_OPT,
  SEC_USDT_AVAX,
  SEC_VTRU_STAKED,
  SEC_SEVOX_STAKED,
  SEC_VERSE,
  SEC_VIBE,
  SEC_VORTEX,
  SEC_VTRO,
  SEC_VUSD,
  SEC_WVTRU,
  SEC_SEVO,
  SEC_SEVOX,
  SEC_V3DEX,
  SEC_VITDEX,
  NET_VTRU,
  NET_ETH,
  NET_AVAX,
  NET_BSC,
  NET_POL,
  NET_SOL,
  NET_TEZ,
  NET_ARB,
  NET_OPT,
  NET_BASE,
} = require('../shared/constants');

const sectionMap = new Map([
  [SEC_VTRU, { Class: TokenWallet, contractId: 'VTRU', web3Id: Web3.VTRU, network: NET_VTRU, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_ETH, { Class: TokenWallet, contractId: 'ETH', web3Id: Web3.ETH, network: NET_ETH, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_AVAX, { Class: TokenWallet, contractId: 'AVAX', web3Id: Web3.AVAX, network: NET_AVAX, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_BNB, { Class: TokenWallet, contractId: 'BNB', web3Id: Web3.BSC, network: NET_BSC, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_POL, { Class: TokenWallet, contractId: 'POL', web3Id: Web3.POL, network: NET_POL, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_SOL, { Class: TokenWalletSol, contractId: 'SOL', web3Id: Web3.SOL, network: NET_SOL, digits: 2, format: formatSolNumber, formats: formatSolNumbers }],
  [SEC_TEZ, { Class: TokenWallet, contractId: 'TEZ', web3Id: Web3.TEZ, network: NET_TEZ, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_ETH_ARB, { Class: TokenWallet, contractId: 'ETH', web3Id: Web3.ARB, network: NET_ARB, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_ETH_OPT, { Class: TokenWallet, contractId: 'ETH', web3Id: Web3.OPT, network: NET_OPT, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_ETH_BASE, { Class: TokenWallet, contractId: 'ETH', web3Id: Web3.BASE, network: NET_BASE, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_VTRU_ETH, { Class: CommonEvmClass, contractId: 'VTRU', web3Id: Web3.ETH, network: NET_ETH, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_VTRU_BSC, { Class: CommonEvmClass, contractId: 'VTRU', web3Id: Web3.BSC, network: NET_BSC, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_USDC_VTRU, { Class: CommonEvmClass, contractId: 'USDC', web3Id: Web3.VTRU, network: NET_VTRU, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDC_ETH, { Class: TokenUsdcClass, contractId: 'USDC', web3Id: Web3.ETH, network: NET_ETH, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDC_BSC, { Class: TokenUsdcClass, contractId: 'USDC', web3Id: Web3.BSC, network: NET_BSC, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_USDC_POL, { Class: TokenUsdcClass, contractId: 'USDC', web3Id: Web3.POL, network: NET_POL, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDC_SOL, { Class: TokenUsdcSol, contractId: 'USDC', web3Id: Web3.SOL, network: NET_SOL, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDC_ARB, { Class: TokenUsdcClass, contractId: 'USDC', web3Id: Web3.ARB, network: NET_ARB, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDC_OPT, { Class: TokenUsdcClass, contractId: 'USDC', web3Id: Web3.OPT, network: NET_OPT, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDC_BASE, { Class: TokenUsdcBase, contractId: 'USDC', web3Id: Web3.BASE, network: NET_BASE, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDC_AVAX, { Class: TokenUsdcClass, contractId: 'USDC', web3Id: Web3.AVAX, network: NET_AVAX, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDT_ETH, { Class: TokenUsdt, contractId: 'USDT', web3Id: Web3.ETH, network: NET_ETH, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDT_POL, { Class: TokenUsdt, contractId: 'USDT', web3Id: Web3.POL, network: NET_POL, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDT_ARB, { Class: TokenUsdt, contractId: 'USDT', web3Id: Web3.ARB, network: NET_ARB, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDT_OPT, { Class: TokenUsdt, contractId: 'USDT', web3Id: Web3.OPT, network: NET_OPT, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_USDT_AVAX, { Class: TokenUsdt, contractId: 'USDT', web3Id: Web3.AVAX, network: NET_AVAX, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_VTRU_STAKED, { Class: TokenStakedVtru, contractId: 'CoreStake', web3Id: Web3.VTRU, network: NET_VTRU, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_SEVOX_STAKED, { Class: TokenStakedSevoX, contractId: 'SEVOX', web3Id: Web3.BSC, network: NET_BSC, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_VERSE, { Class: TokenVerse, contractId: 'VERSE', web3Id: Web3.VTRU, network: NET_VTRU, digits: 0, format: formatNumber, formats: formatNumbers }],
  [SEC_VIBE, { Class: TokenVibe, contractId: 'VIBE', web3Id: Web3.VTRU, network: NET_VTRU, digits: 0, format: formatNumber, formats: formatNumbers }],
  [SEC_VORTEX, { Class: TokenVortex, contractId: 'Vortex', web3Id: Web3.VTRU, network: NET_VTRU, digits: 0, format: formatNumber, formats: formatNumbers }],
  [SEC_VTRO, { Class: TokenVtro, contractId: 'VTRO', web3Id: Web3.VTRU, network: NET_VTRU, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_VUSD, { Class: TokenVusd, contractId: 'VUSD', web3Id: Web3.VTRU, network: NET_VTRU, digits: 2, format: formatVusdNumber, formats: formatVusdNumbers }],
  [SEC_WVTRU, { Class: CommonEvmClass, contractId: 'wVTRU', web3Id: Web3.VTRU, network: NET_VTRU, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_SEVO, { Class: TokenSevo, contractId: 'SEVO', web3Id: Web3.VTRU, network: NET_VTRU, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_SEVOX, { Class: CommonEvmClass, contractId: 'SEVOX', web3Id: Web3.BSC, network: NET_BSC, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_V3DEX, { Class: TokenV3dex, contractId: 'V3DEX', web3Id: Web3.VTRU, network: NET_VTRU, digits: 2, format: formatRawNumber, formats: formatRawNumbers }],
  [SEC_VITDEX, { Class: TokenVitdex, contractId: 'VITDEX', web3Id: Web3.VTRU, network: NET_VTRU, digits: 0, format: formatNumber, formats: formatNumbers }],
]);
// ==== GENERATED SECTION MAP END ====

class TokenFactory {
  /**
   * Builds section metadata with contract instance.
   *
   * @param {string} key - Section key from constants (e.g., SEC_VUSD)
   * @param {Map<string, Web3>} networkMap - Map of Web3 instances by network key.
   * @param {boolean} formatOutput - Whether to enable number formatting.
   * @returns {object|null} Section descriptor or null if network/class missing.
   */
  static create(key, networkMap, formatOutput = false) {
    const meta = sectionMap.get(key);
    if (!meta) {
      console.log(`TokenFactory failed to get data for ${key}`);
      return null;
    }

    const { Class, network, digits, format, formats } = meta;
    const web3 = networkMap.get(meta.web3Id);
    
    if (!web3) {
      // This is not an error: it simply means this chain is not active in the current networkMap.
      // For example, the app may only be using one or two chains at a time.
      // Uncomment below for debugging if needed:
      // console.log(`TokenFactory: Skipping ${key} — no Web3 instance for ${meta.web3Id}`);
      return null;
    }    

    const contract = Class === CommonEvmClass
      ? new Class(web3, meta.contractId)
      : new Class(web3);

    return {
      contract,
      key,
      network,
      digits,
      formatNumber: format,
      formatNumbers: formats,
      format: formatOutput,
    };
  }

    /**
   * Creates a contract entry without using sectionMap, for direct token testing.
   *
   * @param {string} token - Token name, e.g. 'wVTRU', 'USDC'
   * @param {string} chain - Chain name, e.g. 'VTRU', 'ETH'
   * @param {Map<string, Web3>} networkMap - Map of Web3 instances keyed by chain
   * @returns {object|null} A factory-style contract entry or null
   */
    static createByTokenAndChain(token, chain, networkMap) {
      const web3 = networkMap.get(chain);
      if (!web3) {
        console.log(`TokenFactory: Missing Web3 for chain ${chain}`);
        return null;
      }
  
      const contractId = token;
      const Class = CommonEvmClass;
      const digits = token.toLowerCase() === 'usdc' ? 6 : 18;
  
      const contract = new Class(web3, contractId);
  
      return {
        contract,
        key: `${token}_${chain}`,
        network: chain,
        digits,
        formatNumber: formatRawNumber,
        formatNumbers: formatRawNumbers,
        format: false,
      };
    }
  
}

module.exports = TokenFactory;

