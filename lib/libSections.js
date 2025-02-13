/**
 * libSections.js
 * 
 * Handles creates the sections to collect block chain wallet details.
 * Retrieves balances, stakes, verses, and vibes while maintaining
 * systematic and efficient blockchain access.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require('../lib/libWeb3');
const GenericDetails = require("../lib/libGenericDetails");

const TokenWallet = require("../lib/tokenWallet");
const TokenStakedVtru = require("../lib/tokenStakedVtru");
const TokenVerse = require("../lib/tokenVerse");
const TokenVibe = require("../lib/tokenVibe");
const TokenStakedSevo = require("../lib/tokenStakedSevo");

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

    this.tokenWallet = new TokenWallet(vtru);
    this.stakedContract = new TokenStakedVtru(vtru);
    this.verseContract = new TokenVerse(vtru);
    this.vibeContract = new TokenVibe(vtru);
    this.ethWalletContract = eth ? new TokenWallet(eth) : null;
    this.bscWalletContract = bsc ? new TokenWallet(bsc) : null;  
    this.tokenStakedSevo = bsc ? new TokenStakedSevo(bsc) : null;
  }

  /**
   * Retrieves wallet details, including balances, stakes, verses, and vibes.
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
        key: "balance",
        digits: 2,
        format: formatOutput,
      });

      sections.push({
        contract: this.stakedContract,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        key: "stake",
        digits: 2,
        format: formatOutput,
      });

      // Include VERSE and VIBE details if "full" is true.
      if (full) {
        sections.push({
          contract: this.verseContract,
          formatNumbers: formatNumbers,
          formatNumber: formatNumber,
          key: "verse",
          digits: 0,
          format: formatOutput,
        });

        sections.push({
          contract: this.vibeContract,
          formatNumbers: formatNumbers,
          formatNumber: formatNumber,
          key: "vibe",
          digits: 0,
          format: formatOutput,
        });
      }

      // Add ETH wallet details if the ETH instance is available.
      if (this.ethWalletContract) {
        sections.push({
          contract: this.ethWalletContract,
          formatNumbers: formatRawNumbers,
          formatNumber: formatRawNumber,
          key: "eth",
          digits: 2,
          format: formatOutput,
        });

      }

      // Add BSC staked details if the BSC instance is available.
      if (this.bscWalletContract) {
        sections.push({
          contract: this.bscWalletContract,
          formatNumbers: formatRawNumbers,
          formatNumber: formatRawNumber,
          key: "bsc",
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
          key: "sevox",
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
