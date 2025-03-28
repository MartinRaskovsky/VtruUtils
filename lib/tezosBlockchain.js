/**
 * tezosBlockchain.js
 *
 * Tezos blockchain interaction class.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const BlockchainBase = require('./blockchainBase');
const { getNativeBalance } = require('./libTezos');
//const { getNativeBalances } = require('./libTezosBatch');

class TezosBlockchain extends BlockchainBase {
    /**
     * Initializes the Tezos blockchain instance.
     * @param {Object} tezosToolkit - The Tezos toolkit instance.
     */
    constructor(tezosToolkit) {
        super();
        this.connection = tezosToolkit;
    }

    /**
     * Retrieves the native balance for a given wallet.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|bigint>} The native balance.
     */
    async getBalance(wallet) {
        //console.log(`tezosBlockchain::getBalance(${wallet})`);
        return await getNativeBalance(this.connection, wallet);
    }

    /**
     * Retrieves native balances for multiple wallets.
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|bigint>>} An array of native balances.
     */
    /*async getBalances(wallets) {
        console.log(`tezosBlockchain::getBalances(${wallets})`);
        return await getNativeBalances(this.tezos, wallets);
    }*/
}

module.exports = TezosBlockchain;

