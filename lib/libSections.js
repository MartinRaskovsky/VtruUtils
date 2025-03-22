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

const Web3 = require('../lib/libWeb3');
const GenericDetails = require("../lib/libGenericDetails");

// pure vtru tokens
const TokenVerse = require("../lib/tokenVerse");
const TokenVibe = require("../lib/tokenVibe");
const TokenVortex = require("../lib/tokenVortex");
const TokenVtro = require("../lib/tokenVtro");
const TokenVusd = require("../lib/tokenVusd");
const TokenWVtru = require("../lib/tokenWVtru");

const TokenV3dex = require("../lib/tokenV3dex");
const TokenVitdex = require("../lib/tokenVitdex");

const TokenSevo = require("../lib/tokenSevo");
const TokenSevoX = require("../lib/tokenSevoX");

// staked
const TokenStakedVtru = require("../lib/tokenStakedVtru");
const TokenStakedSevoX = require("../lib/tokenStakedSevoX");

// network own coins
const TokenWallet = require("../lib/tokenWallet");

// usdc
const TokenUsdc  = require("../lib/tokenUsdc");

// bridged vtru
const TokenVtruEth = require("../lib/tokenVtruEth");
const TokenVtruBsc = require("../lib/tokenVtruBsc");

const {
  formatRawNumber,
  formatRawNumbers,
  formatNumber,
  formatNumbers,
  formatVusdNumber,
  formatVusdNumbers,
} = require("../lib/vtruUtils");

const {
  SEC_VTRU,
  SEC_VTRU_STAKED,
  SEC_VTRO,
  SEC_VUSD,
  SEC_WVTRU,
  SEC_VERSE,
  SEC_VIBE,
  SEC_VORTEX,
  SEC_V3DEX,
  SEC_VITDEX,
  SEC_SEVO,
  SEC_SEVOX,
  SEC_SEVOX_STAKED,
  SEC_ETH,
  SEC_BNB,
  SEC_POL,
  SEC_VTRU_ETH,
  SEC_VTRU_BSC,
  SEC_USDC_VTRU,
  SEC_USDC_ETH,
  SEC_USDC_BSC,
  SEC_USDC_POL,
  NET_VTRU,
  NET_ETH,
  NET_BSC,
  NET_POL,
} = require('../shared/constants');

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
  constructor(network, full = false, formatOutput = false) {
    //console.log('Sections: ', full);
    const vtru = network.get(Web3.VTRU);
    const bsc = network.get(Web3.BSC);
    const eth = network.get(Web3.ETH);
    const pol = network.get(Web3.POL);
    if (!vtru) {
      throw new Error("❌ A VTRU network instance is required.");
    }

    // Vitruveo Coins & Tokens
    this.tokenVtroHeld = new TokenVtro(vtru);
    this.tokenVusd     = new TokenVusd(vtru);
    this.tokenWVtru    = new TokenWVtru(vtru);
    this.tokenVerse    = new TokenVerse(vtru);
    this.tokenVibe     = new TokenVibe(vtru);
    this.tokenVortex   = new TokenVortex(vtru);

    // Vitruveo Exchange
    this.tokenV3dex    = new TokenV3dex(vtru);
    this.tokenVitdex   = new TokenVitdex(vtru);

    // Sabong
    this.tokenSevo     = vtru? new TokenSevo(vtru) : null;
    this.tokenSevoX    = bsc ? new TokenSevoX(bsc) : null;

    // Staked
    this.tokenStakedVtru  = vtru? new TokenStakedVtru(vtru): null;
    this.tokenStakedSevoX = bsc ? new TokenStakedSevoX(bsc): null;

    // Native Coins
    this.tokenWalletVtru = vtru? new TokenWallet(vtru): null;
    this.tokenWalletEth  = eth ? new TokenWallet(eth) : null;
    this.tokenWalletBsc  = bsc ? new TokenWallet(bsc) : null;
    this.tokenWalletPol  = pol ? new TokenWallet(pol) : null;

    // USDC
    this.tokenUsdcVtru = vtru? new TokenUsdc(vtru): null;
    this.tokenUsdcEth  = eth ? new TokenUsdc(eth)  : null;
    this.tokenUsdcBsc  = bsc ? new TokenUsdc(bsc)  : null;
    this.tokenUsdcPol  = pol ? new TokenUsdc(pol)  : null;

    // VTRU Bridged
    this.tokenVtruEth = eth ? new TokenVtruEth(eth) : null;
    this.tokenVtruBsc = bsc ? new TokenVtruBsc(bsc) : null;  

    this.full = full;
    this.formatOutput = formatOutput;
    this.initSections();
    this.genericDetails = new GenericDetails(this.sections);
  }

  initSections() {
    this.sections = [];

    // Always include wallet balance and staked details.
    this.sections.push({
      contract: this.tokenWalletVtru,
      formatNumbers: formatRawNumbers,
      formatNumber: formatRawNumber,
      network: NET_VTRU,
      key: SEC_VTRU,
      digits: 2,
      format: this.formatOutput,
    });

    this.sections.push({
      contract: this.tokenStakedVtru,
      formatNumbers: formatRawNumbers,
      formatNumber: formatRawNumber,
      network: NET_VTRU,
      key: SEC_VTRU_STAKED,
      digits: 2,
      format: this.formatOutput,
    });

    this.sections.push({
      contract: this.tokenVtroHeld,
      formatNumbers: formatRawNumbers,
      formatNumber: formatRawNumber,
      network: NET_VTRU,
      key: SEC_VTRO,
      digits: 2,
      format: this.formatOutput,
    });

    this.sections.push({
      contract: this.tokenVusd,
      formatNumbers: formatVusdNumbers,
      formatNumber: formatVusdNumber,
      network: NET_VTRU,
      key: SEC_VUSD,
      digits: 2,
      format: this.formatOutput,
    });

    this.sections.push({
      contract: this.tokenWVtru,
      formatNumbers: formatRawNumbers,
      formatNumber: formatRawNumber,
      network: NET_VTRU,
      key: SEC_WVTRU,
      digits: 2,
      format: this.formatOutput,
    });

    // Include VERSE and VIBE details if "full" is true.
    if (this.full) {

      if (this.tokenUsdcVtru) {
        this.sections.push({
          contract: this.tokenUsdcVtru,
          formatNumbers: formatVusdNumbers,
          formatNumber: formatVusdNumber,
          network: NET_VTRU,
          key: SEC_USDC_VTRU,
          digits: 2,
          format: this.formatOutput,
        });
      }

      this.sections.push({
        contract: this.tokenVerse,
        formatNumbers: formatNumbers,
        formatNumber: formatNumber,
        network: NET_VTRU,
        key: SEC_VERSE,
        digits: 0,
        format: this.formatOutput,
      });

      this.sections.push({
        contract: this.tokenVibe,
        formatNumbers: formatNumbers,
        formatNumber: formatNumber,
        network: NET_VTRU,
        key: SEC_VIBE,
        digits: 0,
        format: this.formatOutput,
      });

      this.sections.push({
        contract: this.tokenVortex,
        formatNumbers: formatNumbers,
        formatNumber: formatNumber,
        network: NET_VTRU,
        key: SEC_VORTEX,
        digits: 0,
        format: this.formatOutput,
      });

      this.sections.push({
        contract: this.tokenV3dex,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        network: NET_VTRU,
        key: SEC_V3DEX,
        digits: 2,
        format: this.formatOutput,
      });

      this.sections.push({
        contract: this.tokenVitdex,
        formatNumbers: formatNumbers,
        formatNumber: formatNumber,
        network: NET_VTRU,
        key: SEC_VITDEX,
        digits: 0,
        format: this.formatOutput,
      });

      // Add SEVO details if the instance is available.
      if (this.tokenSevo) {
        this.sections.push({
          contract: this.tokenSevo,
          formatNumbers: formatRawNumbers,
          formatNumber: formatRawNumber,
          network: NET_VTRU,
          key: SEC_SEVO,
          digits: 2,
          format: this.formatOutput,
        });
      }
    }

    // Add ETH wallet details if the ETH instance is available.
    if (this.tokenWalletEth) {
      this.sections.push({
        contract: this.tokenWalletEth,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        network: NET_ETH,
        key: SEC_ETH,
        digits: 2,
        format: this.formatOutput,
      });
    }

    // Add VTRU ETH bridged details if the ETH instance is available.
    if (this.tokenVtruEth) {
      this.sections.push({
        contract: this.tokenVtruEth,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        network: NET_ETH,
        key: SEC_VTRU_ETH,
        digits: 2,
        format: this.formatOutput,
      });
    }

    // Add USDC ETH details if the ETH instance is available.
    if (this.tokenUsdcEth) {
      this.sections.push({
        contract: this.tokenUsdcEth,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        network: NET_ETH,
        key: SEC_USDC_ETH,
        digits: 2,
        format: this.formatOutput,
      });
    }

    // Add BSC staked details if the BSC instance is available.
    if (this.tokenWalletBsc) {
      this.sections.push({
        contract: this.tokenWalletBsc,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        network: NET_BSC,
        key: SEC_BNB,
        digits: 2,
        format: this.formatOutput,
      });
    }

      // Add SEVO-X balance details if the BSC instance is available.
      if (this.tokenSevoX) {
        this.sections.push({
          contract: this.tokenSevoX,
          formatNumbers: formatRawNumbers,
          formatNumber: formatRawNumber,
          network: NET_BSC,
          key: SEC_SEVOX,
          digits: 2,
          format: this.formatOutput,
        });
      }

    // Add SEVO-X staked details if the BSC instance is available.
    if (this.tokenStakedSevoX) {
      this.sections.push({
        contract: this.tokenStakedSevoX,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        network: NET_BSC,
        key: SEC_SEVOX_STAKED,
        digits: 2,
        format: this.formatOutput,
      });
    }

    // Add VTRU BSC bridged details if the BSC instance is available.
    if (this.tokenVtruBsc) {
      this.sections.push({
        contract: this.tokenVtruBsc,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        network: NET_BSC,
        key: SEC_VTRU_BSC,
        digits: 2,
        format: this.formatOutput,
      });
    }

    // Add USDC BSC details if the BSC instance is available.
    if (this.tokenUsdcBsc) {
      this.sections.push({
        contract: this.tokenUsdcBsc,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        network: NET_BSC,
        key: SEC_USDC_BSC,
        digits: 2,
        format: this.formatOutput,
      });
    }

    // Add POL wallet details if the POL instance is available.
    if (this.tokenWalletPol) {
      this.sections.push({
        contract: this.tokenWalletPol,
        formatNumbers: formatRawNumbers,
        formatNumber: formatRawNumber,
        network: NET_POL,
        key: SEC_POL,
        digits: 2,
        format: this.formatOutput,
      });
    }

    // Add USDC POL details if the POL instance is available.
    if (this.tokenUsdcPol) {
    this.sections.push({
      contract: this.tokenUsdcPol,
      formatNumbers: formatVusdNumbers,
      formatNumber: formatVusdNumber,
      network: NET_POL,
      key: SEC_USDC_POL,
      digits: 2,
      format: this.formatOutput,
    });
  }
  }

  /**
   * Retrieves wallet details, including balances, stakes, totalVERSE, totalVIBE ... totalVORTEX.
   * 
   * @param {Array<string>} wallets - The wallet addresses.
   * @param {boolean} [full=false] - Whether to include VERSE and VIBE details.
   * @param {boolean} [formatOutput=false] - Whether to format numerical outputs.
   * @returns {Promise<Object>} An aggregated JSON object of wallet details.
   */
  async get(wallets) {
    try {
      return await this.genericDetails.get(wallets);
    } catch (error) {
      console.error("❌ Error retrieving wallet details:", error.message);
      throw error;
    }
  }

  formatTotals(data)     { this.genericDetails.formatTotals(data);  }
  totalsAdd(sums, data)  { this.genericDetails.totalsAdd(sums, data); }
  totalsClose(sums)      { this.genericDetails.totalsClose(sums); }
  finalsAdd(fins, data)  { this.genericDetails.finalsAdd(fins, data);}
  finalsClose(fins)      { this.genericDetails.finalsClose(fins); }
  getTotals(summary)     { return this.genericDetails.getTotals(summary); }
  getTotalSep(summary)   { return this.genericDetails.getTotalSep(summary); }
  getFinals(summary)     { return this.genericDetails.getFinals(summary); }
  getNetworkKeys()       { return this.genericDetails.getNetworkKeys(); }
  getSectionTitles()     { return this.genericDetails.getSectionTitles(); }
  getSectionKeys()       { return this.genericDetails.getSectionKeys(); }
  getTotalKeys()         { return this.genericDetails.getTotalKeys(); }
  getDecimals()         { return this.genericDetails.getDecimals(); }

}

module.exports = Sections;
