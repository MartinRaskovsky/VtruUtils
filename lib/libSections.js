/**
 * libSections.js (Refactored)
 * 
 * Uses TokenFactory to instantiate token classes and assemble sections dynamically.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Web3 = require('../lib/libWeb3');
const GenericDetails = require("../lib/libGenericDetails");
const TokenFactory = require("../lib/TokenFactory");

const {
  SEC_VTRU, SEC_VTRU_STAKED, SEC_VTRO, SEC_VUSD, SEC_WVTRU,
  SEC_VERSE, SEC_VIBE, SEC_VORTEX, SEC_V3DEX, SEC_VITDEX,
  SEC_SEVO, SEC_SEVOX, SEC_SEVOX_STAKED,
  SEC_ETH, SEC_BNB, SEC_POL, SEC_SOL, SEC_TEZ,
  SEC_VTRU_ETH, SEC_VTRU_BSC,
  SEC_USDC_VTRU, SEC_USDC_ETH, SEC_USDC_BSC, SEC_USDC_POL, SEC_USDC_SOL,
  NET_VTRU, NET_ETH, NET_BSC, NET_POL, NET_SOL, NET_TEZ,
} = require('../shared/constants');

const sectionKeys = [
  SEC_VTRU, SEC_VTRU_STAKED, SEC_VTRO, SEC_VUSD, SEC_WVTRU,
  SEC_VERSE, SEC_VIBE, SEC_VORTEX, SEC_V3DEX, SEC_VITDEX,
  SEC_SEVO, SEC_SEVOX, SEC_SEVOX_STAKED,
  SEC_ETH, SEC_BNB, SEC_POL, SEC_SOL, SEC_TEZ,
  SEC_VTRU_ETH, SEC_VTRU_BSC,
  SEC_USDC_VTRU, SEC_USDC_ETH, SEC_USDC_BSC, SEC_USDC_POL, SEC_USDC_SOL,
];

class Sections {
  constructor(network, full = false, formatOutput = false) {

    this.full = full;
    this.formatOutput = formatOutput;
    this.networkMap = new Map([
      [Web3.VTRU, network.get(Web3.VTRU)],
      [Web3.BSC,  network.get(Web3.BSC)],
      [Web3.ETH,  network.get(Web3.ETH)],
      [Web3.POL,  network.get(Web3.POL)],
      [Web3.SOL,  network.get(Web3.SOL)],
      [Web3.TEZ,  network.get(Web3.TEZ)],
    ]);

    //console.debug("✅ Available networks:", Array.from(this.networkMap.entries()));

    this.sections = [];

    for (const key of sectionKeys) {
      const section = TokenFactory.create(key, this.networkMap, formatOutput);

      /*if (!section) {
        console.log(`🚫 TokenFactory returned null for key: ${key}`);
      } else {
        console.log(`✅ Factory created:`, {
          key,
          contract: section.contract.constructor.name,
          address: section.contract.getAddress?.(),
        });
      }*/

      if (!section) continue;

      // Include VERSE, VIBE, etc. only if full=true or not flagged
      const isFullOnly = [
        SEC_VERSE, SEC_VIBE, SEC_VORTEX, SEC_V3DEX, SEC_VITDEX, SEC_SEVO
      ].includes(key);

      if (!this.full && isFullOnly) continue;

      this.sections.push(section);
    }

    this.genericDetails = new GenericDetails(this.sections);
    //console.debug(`🧪 Constructed ${this.sections.length} sections`);
    //for (const s of this.sections) {
    //  console.debug(`  ➕ Section: ${s.key} on ${s.network}`);
    //}

  }

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
  finalsAdd(fins, data)  { this.genericDetails.finalsAdd(fins, data); }
  finalsClose(fins)      { this.genericDetails.finalsClose(fins); }
  getTotals(summary)     { return this.genericDetails.getTotals(summary); }
  getTotalSep(summary)   { return this.genericDetails.getTotalSep(summary); }
  getFinals(summary)     { return this.genericDetails.getFinals(summary); }
  getNetworkKeys()       { return this.genericDetails.getNetworkKeys(); }
  getSectionTitles()     { return this.genericDetails.getSectionTitles(); }
  getSectionKeys()       { return this.genericDetails.getSectionKeys(); }
  getTotalKeys()         { return this.genericDetails.getTotalKeys(); }
  getDecimals()          { return this.genericDetails.getDecimals(); }
}

module.exports = Sections;

