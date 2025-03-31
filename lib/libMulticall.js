/**
 * libMulticall.js
 * 
 * Utility for running multicall operations using viem.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

/**
 * libMulticall.js
 * 
 * Utility for running multicall operations using viem.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const { createPublicClient, http } = require("viem");
const { chainMap, resolveViemChainById } = require('./viemChains');

/**
 * Resolves a chain from chainMap using its numeric chain ID.
 * 
 * @param {number} chainId
 * @returns {object|null}
 */
//function resolveViemChainById(chainId) {
//    return Object.values(chainMap).find(c => c.id === chainId) || null;
//}

/**
 * Executes a multicall for a list of contract calls.
 * 
 * @param {number} chainId - Numeric chain ID (e.g., 1, 56, 137, 1490)
 * @param {Array} calls - Array of { address, abi, functionName, args }
 * @returns {Promise<Array<{ status: 'success'|'error', data: any }>>}
 */
async function multicall(chainId, calls) {
    const chain = resolveViemChainById(chainId);
    if (!chain) {
        throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    const client = createPublicClient({
        chain,
        transport: http(),
    });

    if (typeof client.multicall !== "function") {
        throw new Error("❌ viem client does not support multicall(). Check your viem version.");
    }

    try {
        const results = await client.multicall({
            contracts: calls,
        });

        if (!Array.isArray(results)) {
            throw new Error("❌ Unexpected result type from multicall (expected array).");
        }

        return results.map((res) =>
            res.status === "success"
                ? { status: "success", data: res.result }
                : { status: "error", data: null }
        );
    } catch (err) {
        console.error("❌ Multicall error:", err.message);
        return calls.map(() => ({ status: "error", data: null }));
    }
}

module.exports = { multicall };
