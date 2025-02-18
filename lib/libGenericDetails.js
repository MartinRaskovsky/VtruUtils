/**
 * libGenericDetails.js
 * 
 * A class for retrieving and formatting network-independent wallet details.
 * This class handles multiple sections, computes wallet balances, 
 * and formats results accordingly.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

class GenericDetails {
    
    /**
     * Initializes the GenericDetails class with section definitions.
     * Each section contains a contract instance and formatting rules.
     * 
     * @param {Array} sections - Array of section objects containing contract instances and format settings.
     */
    constructor(sections) {
        this.sections = sections;
    }

    /**
     * Retrieves wallet balances across multiple sections, computes totals, 
     * and formats the results.
     * 
     * @param {string[]} wallets - Array of wallet addresses to fetch details for.
     * @returns {Promise<Object>} An object containing formatted wallet balances and totals.
     */
    async get(wallets) {
        let result = { wallets };
    
        try {
            const balance = [];
            const total = [];
            const N = this.sections.length;
    
            // Fetch balances for each section
            for (let i = 0; i < N; i++) {
                const contract = this.sections[i]['contract'];
                let bal = await contract.getBalances(wallets);
                bal = bal.map(n => (n == null ? 0n : n)); // Handle nulls
                balance.push(bal);
            }

            // Compute total balances per section
            for (let i = 0; i < N; i++) {
                total.push(balance[i].reduce((sum, n) => sum + n, 0n));
            }
    
            // Format and add balances to the result
            for (let i = 0; i < N; i++) {
                const formatNumbers = this.sections[i]['formatNumbers'];
                const digits = this.sections[i]['digits'];
                const key = this.getSectionKey(this.sections[i]['key']);
                result[key] = formatNumbers(balance[i], digits);
            }
    
            // Format and add total balances to the result
            for (let i = 0; i < N; i++) {
                const formatNumber = this.sections[i]['formatNumber'];
                const digits = this.sections[i]['digits'];
                const key = this.getTotalKey(this.sections[i]['key']);
                const format = this.sections[i]['format'];
                result[key] = format ? formatNumber(total[i], digits) : total[i];
            }
    
        } catch (error) {
            console.error("❌ Error fetching wallet details:", error.message);

            // Ensure structured error handling by setting default values
            for (let i = 0; i < this.sections.length; i++) {
                result[this.getSectionKey(this.sections[i]['key'])] = [];
                result[this.getTotalKey(this.sections[i]['key'])] = 0n;
            }
        }

        return result;
    }

    formatTotals(data) {
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const formatNumber = this.sections[i]['formatNumber'];
            const digits = this.sections[i]['digits'];
            const key = this.getTotalKey(this.sections[i]['key']);
            data[key] = formatNumber(data[key], digits);
        }
    }

    formatGen(pre, sums) {
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const formatNumber = this.sections[i]['formatNumber'];
            const digits = 0;//this.sections[i]['digits'];
            const sumKey = this.getPreKey(pre, this.sections[i]['key']);
            if (!sums[sumKey]) sums[sumKey] = 0n;
            sums[sumKey] = formatNumber(sums[sumKey], digits);
        }
    }

    genTotals(pre, sums, data) {
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const sumKey = this.getPreKey(pre, this.sections[i]['key']);
            const totalKey = this.getTotalKey(this.sections[i]['key']);
            if (!sums[sumKey]) sums[sumKey] = 0n;
            sums[sumKey] += data[totalKey];
        }
    }

    getTotals(summary) {
        const tot = { count: ''};
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const totalKey = this.getPreKey('total', this.sections[i]['key']);
            if (!summary[totalKey]) summary[totalKey] = 0n;
            tot[totalKey] = summary[totalKey];
        }
        return tot;
    }

    getTotalSep(summary) {
        const sep = { count: ''};
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const totalKey = this.getPreKey('total', this.sections[i]['key']);
            sep[totalKey] = "...";
        }
        return sep;
    }

    getFinals(summary) {
        const fin = { count: summary.analyzedVaultCount};
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const totalKey = this.getPreKey('total', this.sections[i]['key']);
            const finalKey = this.getPreKey('final', this.sections[i]['key']);
            if (!summary[finalKey]) summary[finalKey] = 0n;
            fin[totalKey] = summary[finalKey];
        }
        return fin;
    }

    totalsClose(sums)      { return this.formatGen('total', sums); }
    totalsAdd(sums, data)  { return this.genTotals('total', sums, data); }
    finalsClose(sums)      { return this.formatGen('final', sums); }
    finalsAdd(sums, data)  { return this.genTotals('final', sums, data); }
  
   /**
    * Strips spaces and hyphens from the given string.
    * @param {string} input - The string to strip spaces and hyphens from.
    * @return {string} - The stripped string.
    */
    stripSpacesAndHyphens(input) {
        return input.replace(/[\s-]/g, '');
    }

    /**
     * Generates a formatted key name for wallet-specific balances.
     * 
     * @param {string} key - Section key name.
     * @returns {string} Formatted key.
     */
    getSectionKey(key) {
        return `section${this.stripSpacesAndHyphens(key)}`;
    }
    
    /**
     * Generates a formatted key name for total balances.
     * 
     * @param {string} key - Section key name.
     * @returns {string} Formatted keys.
     */
    getTotalKey(key) {
        return `total${this.stripSpacesAndHyphens(key)}`;
    }

    getPreKey(pre, key) {
        return `${pre}${this.stripSpacesAndHyphens(key)}`;
    }

    getNetworkKeys() {
        let keys = [];
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const key = this.sections[i]['network'];
            keys.push(key);
        }
        return keys;
     }

    getSectionTitles() {
        let keys = [];
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const key = this.sections[i]['key'];
            keys.push(key);
        }
        return keys;
     }
    
    getSectionKeys() {
        let keys = [];
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const key = this.getSectionKey(this.sections[i]['key']);
            keys.push(key);
        }
        return keys;
     }

     getTotalKeys() {
        let keys = [];
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const key = this.getTotalKey(this.sections[i]['key']);
            keys.push(key);
        }
        return keys;
     }

     getDecimals() {
        let decimals = [];
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const decimal = this.sections[i]['digits'];
            decimals.push(decimal);
        }
        return decimals;
     }

}

module.exports = GenericDetails;

