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

}

module.exports = EvmBlockchain;

