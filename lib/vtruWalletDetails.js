/**
 * VtruWalletDetails.js
 * Handles the logic to collect wallet details.
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require('../lib/libWeb3');
const { Network } = require("../lib/libNetwork");
const GenericDetails = require("../lib/libGenericDetails");

const VtruWalletContract = require("../lib/vtruWalletContract");
const VtruStakedContract = require("../lib/vtruStakedContract");
const VtruVerseContract = require("../lib/vtruVerseContract");
const VtruVibeContract = require("../lib/vtruVibeContract");
const BscStakedContract = require("../lib/bscStakedContract");

const {
  formatRawNumber,
  formatRawNumbers,
  formatNumber,
  formatNumbers,
} = require("../lib/vtruUtils");

/**
 * Class for aggregating wallet details.
 */
class VtruWalletDetails {
  /**
   * Constructor for VtruWalletDetails.
   * @param {Object} network - The network instances.
   */
  constructor(network) {
    const vtru = network.get(Web3.VTRU);
    const bsc = network.get(Web3.BSC);
    if (!vtru) {
      throw new Error("A vtru instance is required.");
    }

    this.walletContract = new VtruWalletContract(vtru);
    this.stakedContract = new VtruStakedContract(vtru);
    this.verseContract = new VtruVerseContract(vtru);
    this.vibeContract = new VtruVibeContract(vtru);  
    this.bscStakedContract = bsc ? new BscStakedContract(bsc) : null;
  }

  /**
   * Retrieves wallet details including balances, stakes, verses, and vibes.
   *
   * @param {Array<string>} wallets - The wallet addresses.
   * @param {boolean} [full=false] - Whether to include VERSE and VIBE details.
   * @param {boolean} [formatOutput=false] - Whether to format numerical outputs.
   * @returns {Promise<Array<Object>>} An array of wallet detail sections.
   */
  async get(wallets, full = false, formatOutput = false) {
    try {
      const sections = [];

      // Always include wallet balance and staked details.
      sections.push({
        contract: this.walletContract,
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

      // Add BSC staked details if the bsc instance is provided.
      if (this.bscStakedContract) {
        sections.push({
          contract: this.bscStakedContract,
          formatNumbers: formatRawNumbers,
          formatNumber: formatRawNumber,
          key: "sevox",
          digits: 2,
          format: formatOutput,
        });
      }

      const genericDetails = new GenericDetails(sections);
      const json = await genericDetails.get(wallets);

      return json;
    } catch (error) {
      console.error("Error retrieving wallet details:", error);
      throw error;
    }
  }
}

module.exports = VtruWalletDetails;
