/**
 * evmBlockchain.js
 *
 * Ethereum blockchain interaction class.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const BlockchainBase = require('./blockchainBase');
const { getNativeBalance } = require('./libEvm');
//const { getNativeBalances } = require('./libEvmBatch');

class EvmBlockchain extends BlockchainBase {
    /**
     * Initializes the Ethereum blockchain instance.
     * @param {Object} provider - The Ethereum provider instance.
     */
    constructor(provider) {
        super();
        this.provider = provider;
    }

    /**
     * Retrieves the native balance for a given wallet.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|bigint>} The native balance.
     */
    async getBalance(wallet) {
        //console.log(`EvmBlockchain::getBalance(${wallet})`);
        return await getNativeBalance(this.provider, wallet);
    }

    /**
     * Retrieves native balances for multiple wallets.
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|bigint>>} An array of native balances.
     */
    /*async getBalances(wallets) {
        console.log(`EvmBlockchain::getBalances(${wallets})`);
        return await getNativeBalances(this.provider, wallets);
    }*/
}

module.exports = EvmBlockchain;

