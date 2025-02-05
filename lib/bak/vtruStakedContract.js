/**
 * VtruStakedContract.js
 * 
 * Handles interaction with the CoreStake contract, providing methods
 * to retrieve staked balances and stake details for individual and
 * multiple wallets, including maturity calculation.
 *
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const { isAddress, getAddress } = require("ethers");
const VtruContract = require("./vtruContract");

class VtruStakedContract extends VtruContract {
    constructor(config, web3) {
        super(config, web3, "CoreStake");
        this.provider = web3.getProvider(); // Assign provider at construction
    }

    async getStakedBalance(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("Contract instance unavailable.");
            if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);

            const walletAddress = getAddress(wallet);
            const result = await contract.getUserStakesInfo(walletAddress);
            const stakes = result[0];

            if (!Array.isArray(stakes)) throw new Error("Invalid stake data format.");

            return stakes.reduce((sum, stake) => sum + (stake[4] || 0n), 0n);
        } catch (error) {
            console.error(`❌ Error fetching balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    async getStakedBalances(wallets) {
        try {
            if (!Array.isArray(wallets)) throw new Error("Invalid wallets input. Expected an array.");
            if (wallets.length === 0) return [];

            return await Promise.all(wallets.map(wallet => this.getStakedBalance(wallet)));
        } catch (error) {
            console.error("❌ Error fetching staked balances for wallets:", error.message);
            return [];
        }
    }

    async getStakedDetail(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("Contract instance unavailable.");
    
            if (!isAddress(wallet)) {
                throw new Error(`Invalid Ethereum address: ${wallet}`);
            }
    
            const walletAddress = getAddress(wallet);
            const result = await contract.getUserStakesInfo(walletAddress);
            const stakes = result[0];
    
            if (!Array.isArray(stakes)) throw new Error("Invalid stake data format.");
    
            // Get current block number (converted from BigInt to Number)
            const currentBlock = Number(await this.provider.getBlockNumber());
    
            return stakes.map(stake => {
                const endBlock = Number(stake[3]); // Convert from BigInt
                const maturitySeconds = Math.max(0, (endBlock - currentBlock) * 5);
                const maturityDays = Math.floor(maturitySeconds / 86400); // Convert seconds to days
    
                const stakeData = {
                    wallet: wallet,
                    amount: stake[4],
                    unstakeAmount: stake[5],
                    lockedAmount: stake[6],
                    availableToUnstake: stake[7] ? stake[6] : 0n, // If eligible, unstakeable amount = lockedAmount
                    maturityDays
                };
    
                return stakeData;
            });
    
        } catch (error) {
            console.error(`❌ Error fetching details for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    async getStakedDetails(wallets) {
        try {
            if (!Array.isArray(wallets)) throw new Error("Invalid wallets input. Expected an array.");
            if (wallets.length === 0) return [];    

            const detailsArray = await Promise.all(wallets.map(wallet => this.getStakedDetail(wallet)));
            return detailsArray.flat();
        } catch (error) {
            console.error("❌ Error fetching staked details for wallets:", error.message);
            return [];
        }
    }
}

module.exports = VtruStakedContract;

