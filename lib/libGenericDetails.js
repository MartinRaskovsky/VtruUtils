#!/usr/bin/env node

/**
 * libGenericDetails.js
 * A class for generic netword independent wallet details.
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 *
 */

class GenericDetails {
    constructor(sections) {
        this.sections = sections;
    }

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
                bal = bal.map(n => (n == null ? 0n : n));  // Handle nulls
                balance.push(bal);
            }
    
            // Sum and handle null values
            for (let i = 0; i < N; i++) {
                let balances = balance[i];
                balances = balances.reduce((sum, n) => sum + n, 0n);
                total.push(balances);
            }
    
            // Format and add wallet balances to result
            for (let i = 0; i < N; i++) {
                const formatNumbers = this.sections[i]['formatNumbers'];
                const digits = this.sections[i]['digits'];
                const key = this.getWalletKey(this.sections[i]['key']);
                result[key] = formatNumbers(balance[i], digits);
            }
    
            // Format and add total balances to result
            for (let i = 0; i < N; i++) {
                const formatNumber = this.sections[i]['formatNumber'];
                const digits = this.sections[i]['digits'];
                const key = this.getTotalKey(this.sections[i]['key']);
                const format = this.sections[i]['format'];
                result[key] = format ? formatNumber(total[i], digits) : total[i];
            }
    
        } catch (error) {
            console.error("Error fetching wallet details:", error.message);
            for (let i = 0; i < N; i++) {
                const key = getWalletKey(this.sections[i]['key']);
                result[key] = [];
            }
            for (let i = 0; i < N; i++) {
                const key = `${this.sections[i]['key']}`;
                result[key] = 0n;
            }
        }
    
        return result;
    }

    getWalletKey(key) {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        const suffix = (key === 'stake') ? 'd' : 's';
        return `wallet${name}${suffix}`;
    }
    
    getTotalKey(key) {
        const name = (key === 'balance') ? 'held' : key;
        const suffix = (key === 'stake') ? 'd' : (key === 'balance') ? '' : 's';
        return `${name}${suffix}`;
    }

}

module.exports = GenericDetails;
