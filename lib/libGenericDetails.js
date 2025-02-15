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

    async formatTotals(data) {
        const N = this.sections.length;
        for (let i = 0; i < N; i++) {
            const formatNumber = this.sections[i]['formatNumber'];
            const digits = this.sections[i]['digits'];
            const key = this.getTotalKey(this.sections[i]['key']);
            data[key] = formatNumber(data[key], digits);
        }
    }

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

