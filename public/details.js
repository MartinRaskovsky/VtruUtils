/**
 * details.js
 *
 * Handles modal interactions for staking details across different networks.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

/**
 * Opens the stake modal and fetches stake details.
 * 
 * @param {string} type - The type of details (e.g., 'bsc', 'vibe', 'vortex', 'vtru').
 * @param {string} vault - The vault address.
 * @param {string} walletsEncoded - Encoded JSON string of wallet addresses.
 * @param {string} grouping - Grouping parameter.
 */
async function openDetailsModal(type, vault, walletsEncoded, grouping) {
    const modal = document.getElementById('DetailsModal');
    const modalContent = document.getElementById('DetailsModalContent');

    if (!vault) {
        alert("Vault address is missing.");
        return;
    }

    modal.style.display = "none";

    try {
        const wallets = JSON.parse(decodeURIComponent(walletsEncoded));

        const response = await fetch('/api/details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, vault, wallets, grouping })
        });

        const textResult = await response.text();
        const result = JSON.parse(textResult);

        if (result.success) {
            modalContent.innerHTML = renderDetailContent(type, grouping, result.output);
            modal.style.display = "block";
            modal.style.opacity = "1";
            modal.classList.add("active"); // ✅ Only activate when content is ready
            modal.style.visibility = "visible"; // ✅ Now make it visible

            // Ensuring the modal stays centered
            Object.assign(modal.style, {
                width: "fit-content",
                maxWidth: "90%",
                height: "auto",
                maxHeight: "80vh",
                overflow: "auto",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            });
        } else {
            modalContent.innerHTML = `<p>Error: ${result.error}</p>`;
        }
    } catch (error) {
        console.error("❌ Fetch Error:", error);
        modalContent.innerHTML = "<p>Error connecting to the server.</p>";
    }
}

/**
 * Closes the stake modal.
 */
function closeDetailsModal() {
    document.getElementById('DetailsModal').style.display = "none";
}

/**
 * Generates the appropriate details rendering based on type.
 * 
 * @param {string} type - The details type (e.g., 'bsc', 'vibe', 'vortex', 'vtru').
 * @param {string} grouping - The grouping type.
 * @param {Array} data - The stake data.
 * @returns {string} - Rendered HTML content.
 */
function renderDetailContent(type, grouping, data) {
    switch (type) {
        case "bsc":     return renderBscStakeDetails(grouping, data);
        case "vibe":    return renderVibeDetails(grouping, data);
        case "vortex":  return renderVortexDetails(grouping, data);
        case "bsc":     return renderBscStakeDetails(grouping, data);
        default:        return renderVtruStakeDetails(grouping, data);
    }
}

/**
 * Truncates a wallet address for better display.
 * 
 * @param {string} address - The wallet address.
 * @returns {string} - Truncated address.
 */
function truncateAddress(address) {
    return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

/**
 * Retrieves the explorer link with a formatted label.
 * 
 * @param {string} type - The blockchain type.
 * @param {string} grouping - The grouping type.
 * @param {string} data - The wallet address or identifier.
 * @returns {string} - Explorer URL formatted as an HTML link.
 */
function getLabel(type, grouping, data) {
    if (grouping !== 'none') return data;
    if (grouping === 'none' && data === 'Total') return data;
    return explorerURL(type, data, truncateAddress(data));
}

/**
 * Decorates the unclaimed balance for better visibility.
 * 
 * @param {string} value - The unclaimed value.
 * @returns {string} - Decorated HTML.
 */
function decorateUnclaimed(value) {
    return value === "0.00" ? "" : `<div class="unclaimed">${value}</div>`;
}

/**
 * Renders the generic VTRU stake details.
 */
function renderVtruStakeDetails(grouping, data) {
    return `
        <h2>VTRU Staked Details</h2>
        <div class="scrollable">
            <table class="stake-table">
                <thead>
                    <tr>
                        <th>${grouping === 'none' ? 'Wallet' : '#Stakes'}</th>
                        <th>Amount</th>
                        <th>Reward</th>
                        <th>Locked</th>
                        <th>Available</th>
                        <th>Maturity</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td class="wallet-cell">${getLabel(NET_VTRU, grouping, row.wallet)}</td>
                            <td class="decimal-align">${row.amount}</td>
                            <td class="decimal-align">${row.reward}</td>
                            <td class="decimal-align">${row.totalStaked}</td>
                            <td class="decimal-align">${row.availableToUnstake}</td>
                            <td>${row.estimatedMaturity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Renders SEVO-X (BSC) stake details.
 */
function renderBscStakeDetails(grouping, data) {
    return `
        <h2>SEVO-X Staked Details</h2>
        <div class="scrollable">
            <table class="stake-table">
                <thead>
                    <tr>
                        <th>Wallet</th>
                        <th>Date</th>
                        <th>Locked</th>
                        <th>Unlocked</th>    
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td class="wallet-cell">${getLabel(NET_BSC, grouping, row.wallet)}</td>
                            <td>${row.date}</td>
                            <td class="decimal-align">${row.locked}</td>
                            <td class="decimal-align">${row.unlocked}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Renders Vibe details.
 */
function renderVibeDetails(grouping, data) {
    return `
        <h2>Vibe Details</h2>
        <div class="scrollable">
            <table class="stake-table">
                <thead>
                    <tr>
                        <th>Wallet</th>
                        <th>#Tokens</th>
                        <th>Balance</th>
                        <th>Claimed</th>
                        <th>Unclaimed</th>   
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td class="wallet-cell">${getLabel(NET_VTRU, grouping, row.wallet)}</td>
                            <td class="decimal-align">${row.noTokens}</td>
                            <td class="decimal-align">${row.balance}</td>
                            <td class="decimal-align">${row.claimed}</td>
                            <td class="decimal-align">${decorateUnclaimed(row.unclaimed)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Renders Vortex details.
 */
function renderVortexDetails(grouping, data) {
    return `
        <h2>Vortex Details</h2>
        <div class="scrollable">
            <table class="stake-table">
                <thead>
                    <tr>
                        <th>Wallet</th>
                        <th>Rarity</th>
                        <th>Count</th> 
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td class="wallet-cell">${getLabel(NET_VTRU, grouping, row.wallet)}</td>
                            <td class="decimal-align">${row.kind}</td>
                            <td class="decimal-align">${row.count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Ensure modal functions are globally available
window.openDetailsModal = openDetailsModal;
window.closeDetailsModal = closeDetailsModal;

