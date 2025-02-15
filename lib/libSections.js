/**
 * libSections.js
 * 
 * Handles creates the sections to collect block chain wallet details.
 * Retrieves balances, stakes, totalVERSE, and totalVIBE while maintaining
 * systematic and efficient blockchain access.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require('../lib/libWeb3');
const GenericDetails = require("../lib/libGenericDetails");

const TokenStakedVtru = require("../lib/tokenStakedVtru");
const TokenStakedSevo = require("../lib/tokenStakedSevo");
const TokenVerse = require("../lib/tokenVerse");
const TokenVibe = require("../lib/tokenVibe");
const TokenVortex = require("../lib/tokenVortex");
const TokenWallet = require("../lib/tokenWallet");

const {
  formatRawNumber,
  formatRawNumbers,
  formatNumber,
  formatNumbers,
} = require("../lib/vtruUtils");

/**
 * Aggregates wallet details, ensuring systematic and efficient access.
 */
class Sections {
  
  /**
   * Initializes the wallet details aggregator.
   * 
   * @param {Object} network - The network instances.
   * @throws {Error} If a VTRU network instance is not provided.
   */
  constructor(network) {
    const vtru = network.get(Web3.VTRU);
    const bsc = network.get(Web3.BSC);
    const eth = network.get(Web3.ETH);
    if (!vtru) {
      throw new Error("❌ A VTRU network instance is required.");
    }

    this.tokenStakedVtru = new TokenStakedVtru(vtru);
    this.tokenStakedSevo = bsc ? new TokenStakedSevo(bsc) : null;
    this.tokenVerse = new TokenVerse(vtru);
    this.tokenVibe = new TokenVibe(vtru);
    this.tokenVortex = new TokenVortex(vtru);
    this.tokenWallet = new TokenWallet(vtru);
    this.tokenWalletEth = eth ? new TokenWallet(eth) : null;
    this.tokenWalletBsc = bsc ? new TokenWallet(bsc) : null;  
  }

  /**
   * Retrieves wallet details, including balances, stakes, totalVERSE, totalVIBE ... totalVORTEX.
   * 
   * @param {Array<string>} wallets - The wallet addresses.
   * @param {boolean} [full=false] - Whether to include VERSE and VIBE details.
   * @param {boolean} [formatOutput=false] - Whether to format numerical outputs.
   * @returns {Promise<Object>} An aggregated JSON object of wallet details.
   */
  async get(wallets, full = false, formatOutput = false) {
    try {
      const sections = [];

      // Always include wallet balance and staked details.
      sections.push({
        contract: this.tokenWallet,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        key: "VTRU Held",
        digits: 2,
        format: formatOutput,
      });

      sections.push({
        contract: this.tokenStakedVtru,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        key: "VTRU Staked",
        digits: 2,
        format: formatOutput,
      });

      // Include VERSE and VIBE details if "full" is true.
      if (full) {
        sections.push({
          contract: this.tokenVerse,
          formatNumbers: formatNumbers,
          formatNumber: formatNumber,
          key: "VERSE",
          digits: 0,
          format: formatOutput,
        });

        sections.push({
          contract: this.tokenVibe,
          formatNumbers: formatNumbers,
          formatNumber: formatNumber,
          key: "VIBE",
          digits: 0,
          format: formatOutput,
        });

        sections.push({
          contract: this.tokenVortex,
          formatNumbers: formatNumbers,
          formatNumber: formatNumber,
          key: "VORTEX",
          digits: 0,
          format: formatOutput,
        });
      }

      // Add totalETH wallet details if the totalETH instance is available.
      if (this.tokenWalletEth) {
        sections.push({
          contract: this.tokenWalletEth,
          formatNumbers: formatRawNumbers,
          formatNumber: formatRawNumber,
          key: "ETH",
          digits: 2,
          format: formatOutput,
        });

      }

      // Add BSC staked details if the BSC instance is available.
      if (this.tokenWalletBsc) {
        sections.push({
          contract: this.tokenWalletBsc,
          formatNumbers: formatRawNumbers,
          formatNumber: formatRawNumber,
          key: "BNB",
          digits: 2,
          format: formatOutput,
        });
      }

      // Add BSC staked details if the BSC instance is available.
      if (this.tokenStakedSevo) {
        sections.push({
          contract: this.tokenStakedSevo,
          formatNumbers: formatRawNumbers,
          formatNumber: formatRawNumber,
          key: "SEVO-X Staked",
          digits: 2,
          format: formatOutput,
        });
      }

      const genericDetails = new GenericDetails(sections);
      return await genericDetails.get(wallets);
      
    } catch (error) {
      console.error("❌ Error retrieving wallet details:", error.message);
      throw error;
    }
  }
}

module.exports = Sections;
