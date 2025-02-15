/**
 * vaultset.js
 *
 * Handles the rendering and processing of Vault and Wallet details.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const SEC_VTRU_HELD   = "VTRU Held";
const SEC_VTRU_STAKED = "VTRU Staked";
const SEC_VERSE       = "VERSE";
const SEC_VIBE        = "VIBE";
const SEC_VORTEX      = "VORTEX";
const SEC_SEVOX       = "SEVO-X Staked";
const SEC_ETH         = "ETH";
const SEC_BNB         = "BNB";         

/**
 * Fetching data and updating the UI.
 */
async function runSections() {
    let vault = document.getElementById('vaultAddress').value.trim();
    let wallets = document.getElementById('walletAddresses').value.trim();
    const outputElement = document.getElementById('output');
    if (!vault) {
        vault = "";
    }

    wallets = wallets
        ? wallets.split(/\s+/).map(addr => addr.trim()).filter(addr => addr.length > 0)
        : [];

    try {
        const response = await fetch('/api/sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vault, wallets })
        });

        const textResult = await response.text();

        const result = JSON.parse(textResult);
        if (result.success) {
            if (!result.output.previousData) result.output.previousData = {};
            const modifiedData = computeDifferencesForDisplay(result.output.currentData, result.output.previousData);
            outputElement.innerHTML = renderVaultSet(modifiedData);
        } else {
            //console.error("❌ Error in response:", result.error);
            outputElement.textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        console.error("❌ Fetch Error:", error);
        outputElement.textContent = "Error connecting to the server.";
    }
}

// 🔥 Ensure `runSections` is globally available
window.runSections = runSections;

function explorerURL(type, address, label = null) {
    if (label === null) label = address;
    switch (type) {
        case 'bsc':
        case 'SEVO-X':
            return(`<A target=”_blank” href="https://bscscan.com/address/${address}">${label}</A>`);
        case 'ETH':
            return(`<A target=”_blank” href="https://etherscan.io/address/${address}">${label}</A>`);
        case 'BNB':
            return(`<A target=”_blank” href="https://bscscan.com//address/${address}">${label}</A>`);
        case 'stake':
        case 'VTRU':
        default:
            return(`<A target=”_blank” href="https://explorer.vitruveo.xyz/address/${address}">${label}</A>`);
      } 
}

// 🔥 Ensure `explorerURL` is globally available
window.explorerURL = explorerURL;

function formatScalarDiff(scalarData) {
    const { diff, prev } = scalarData;
    if (diff === null || diff === undefined) return '<td>&nbsp;</td>';
    const numb = parseFloat(diff);
    const ch = (numb > 0) ? '+' : '-';
    const mod = (numb > 0) ? 'increase' : 'decrease';
    return `<td class="diff-value decimal-align ${mod}">(${ch}${diff})</td>`;
}

function renderVaultSet(modifiedData) {
    const vault = modifiedData.address;
    const name = modifiedData.name;
    const count = modifiedData.wallets.length;
    const plural = (count === 1) ? "" : "es";
    const vaultTitle = `${name}<br>Analysed ${count} address${plural}`;

    return `
        <h2>${vaultTitle}</h2>
        <table>
            <thead>
                <tr>
                    <th>WALLET</th>
                    <th>CHANGE</th>
                    <th>BALANCE</th>
                </tr>
            </thead>
            <tbody>
                ${generateSection(SEC_VTRU_HELD, vault, modifiedData.wallets, modifiedData.sectionVTRUHeld, modifiedData.totalVTRUHeld)}
                ${generateSection(SEC_VTRU_STAKED, vault, modifiedData.wallets, modifiedData.sectionVTRUStaked, modifiedData.totalVTRUStaked)}
                ${generateSection(SEC_VERSE, vault, modifiedData.wallets, modifiedData.sectionVERSE, modifiedData.totalVERSE)}
                ${generateSection(SEC_VIBE,  vault, modifiedData.wallets, modifiedData.sectionVIBE,  modifiedData.totalVIBE)}
                ${generateSection(SEC_VORTEX,  vault, modifiedData.wallets, modifiedData.sectionVORTEX,  modifiedData.totalVORTEX)}
                ${generateSection(SEC_SEVOX, vault, modifiedData.wallets, modifiedData.sectionSEVOXStaked, modifiedData.totalSEVOXStaked)}
                ${generateSection(SEC_ETH, vault, modifiedData.wallets, modifiedData.sectionETH, modifiedData.totalETH)}
                ${generateSection(SEC_BNB, vault, modifiedData.wallets, modifiedData.sectionBNB, modifiedData.totalBNB)}          
                <tr class="section-header"><td colspan="3">Summary</td></tr>
                ${generateLastRow(SEC_VTRU_HELD, modifiedData.totalVTRUHeld)}
                ${generateLastRow(SEC_VTRU_STAKED, modifiedData.totalVTRUStaked)}
                ${generateLastRow(SEC_VERSE, modifiedData.totalVERSE)}
                ${generateLastRow(SEC_VIBE, modifiedData.totalVIBE)}
                ${generateLastRow(SEC_VORTEX, modifiedData.totalVORTEX)}
                ${generateLastRow(SEC_SEVOX, modifiedData.totalSEVOXStaked)}
                ${generateLastRow(SEC_ETH, modifiedData.totalETH)}
                ${generateLastRow(SEC_BNB, modifiedData.totalBNB)}
            </tbody>
        </table>
    `;
}

function computeDifferencesForDisplay(currentData, previousData) {
    //if (!previousData) return currentData; // No previous data, return as is

    let modifiedData = JSON.parse(JSON.stringify(currentData)); // Clone the data

    // Convert previous wallets array into a hash { walletAddress: index }
    let previousWalletsHash = {};
    if (previousData.wallets) {
        previousData.wallets.forEach((wallet, index) => {
            previousWalletsHash[wallet] = index;
        });
    }

    function getDifference(curr, prev, decimals = 2) {
        if (!prev || !curr || curr === prev) return { value: curr, diff: null, prev: '' }; // No change
    
        const numCurr = parseFloat(curr.replace(/,/g, '')) || 0;
        const numPrev = parseFloat(prev.replace(/,/g, '')) || 0;
        const diff = numCurr - numPrev;
        const formattedDiff = parseFloat(diff).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        return { value: curr, diff: formattedDiff, prev: prev };
    }

    // Process scalar balance
    modifiedData.balance = getDifference(currentData.balance, previousData.balance);

    // Process wallet-based arrays using the hash lookup
    ["sectionVTRUHeld", "sectionVTRUStaked", "sectionVIBE", "sectionVORTEX", "sectionVERSE", "sectionSEVOXStaked", "sectionBNB", "sectionETH"].forEach(field => {
        if (currentData[field]) {
            modifiedData[field] = currentData[field].map((currValue, index) => {
                const wallet = currentData.wallets[index];
                const prevIndex = previousWalletsHash[wallet];
                const prevValue = (prevIndex !== undefined && previousData[field] !== undefined) ? previousData[field][prevIndex] : null;
                const decimals = (field === "sectionVERSE" || field === "sectionVIBE" || field === "sectionVORTEX")? 0: 2;
                return getDifference(currValue, prevValue, decimals);
            });
        }
    });

    // Process totals
    ["totalVTRUHeld", "totalVTRUStaked", "totalVERSE", "totalVIBE", "totalVORTEX", "totalSEVOXStaked", "totalBNB", "totalETH"].forEach(field => {
        const decimals = (field === "totalVERSE" || field === "totalVIBE" || field === "totalVORTEX")? 0: 2;
        modifiedData[field] = getDifference(currentData[field], previousData[field], decimals);
    });

    return modifiedData;
}

function generateLastRow(label, data) {
    if (!data || !data.value || data.value === "0" || data.value === "0.00") return "";
        return `
                    <tr class="total-row">
                    <td><strong>Total ${label}</strong></td>
                    ${formatScalarDiff(data)}
                    <td class="balance-cell"><strong>${data.value}</strong></td>
                </tr>`
}

function generateSection(title, vault, wallets, values, total) {
    if (!wallets || wallets.length === 0 || !values) return "";
    let rows = wallets.map((wallet, index) => {
        const balance = values[index];
        if (!balance || !balance.value || balance.value === "0.00" || balance.value === "0") return ""; // Skip empty rows
        let address = explorerURL(title, wallet);
        if (vault === wallet) {
            address = `<strong>${address}</strong>`;
        }
        return `
            <tr>
                <td class="wallet-cell">${address}</td>
                ${formatScalarDiff(balance)}
                <td class="balance-cell decimal-align">${balance.value}</td>
            </tr>
        `;
    }).filter(row => row).join("");

    let stakeControls = "";
    if (title === SEC_VTRU_STAKED) {
        const encodedWallets = encodeURIComponent(JSON.stringify(wallets));
        stakeControls = `
        <tr class="total-row">
          <td colspan="3">
            <div class="stake-controls">
                <button class="stake-btn" data-modal-type="stake" data-vault="${vault}" data-wallets="${encodedWallets}" onclick="openDetailsModal('stake', '${vault}', '${encodedWallets}', selectedGrouping, event)">View Stakes</button>
                <span class="group-label">Grouped by:</span>
                <label class="radio-label"><input type="radio" name="grouping" value="none" checked> None</label>
                <label class="radio-label"><input type="radio" name="grouping" value="day"> Day</label>
                <label class="radio-label"><input type="radio" name="grouping" value="month"> Month</label>
                <label class="radio-label"><input type="radio" name="grouping" value="year"> Year</label>
            </div>
          </td>
        </tr>
        `;
    } else if (title === SEC_SEVOX) {
        const encodedWallets = encodeURIComponent(JSON.stringify(wallets));
        stakeControls = `
        <tr class="total-row">
            <td colspan="3">
                <div class="stake-controls">
                    <button class="stake-btn" data-modal-type="bsc" data-vault="${vault}" data-wallets="${encodedWallets}" onclick="openDetailsModal('bsc', '${vault}', '${encodedWallets}', "none";, event)> View SEVO-X Stakes </button>
                </div>
            </td>
        </tr>
        `;
    } else if (title === SEC_VIBE) {
        const encodedWallets = encodeURIComponent(JSON.stringify(wallets));
        stakeControls = `
        <tr class="total-row">
            <td colspan="3">
                <div class="stake-controls">
                    <button class="stake-btn" data-modal-type="vibe" data-vault="${vault}" data-wallets="${encodedWallets}" onclick="openDetailsModal('vibe', '${vault}', '${encodedWallets}', "none";, event)> View Vibe Details</button>
                </div>
            </td>
        </tr>
        `;
    } else if (title === SEC_VORTEX) {
        const encodedWallets = encodeURIComponent(JSON.stringify(wallets));
        stakeControls = `
        <tr class="total-row">
            <td colspan="3">
                <div class="stake-controls">
                    <button class="stake-btn" data-modal-type="vortex" data-vault="${vault}" data-wallets="${encodedWallets}" onclick="openDetailsModal('vortex', '${vault}', '${encodedWallets}', "none";, event)> View Vortex Details</button>
                </div>
            </td>
        </tr>
        `;
    }

    return rows
    ? `
        <tr class="section-header"><td colspan="3">${title}</td></tr>
        ${rows}
        <tr class="total-row">
            <td><strong>Total ${title}</strong></td>
            ${formatScalarDiff(total)}
            <td class="balance-cell decimal-align"><strong>${total.value}</strong></td>
        </tr>
        ${stakeControls}
        <tr class="spacer-row"><td colspan="3"></td></tr>
    `
    : "";
}

// Handle Grouping Toggle Events
let selectedGrouping = "none";
document.body.addEventListener("change", function (event) {
    if (event.target.name === "grouping") {
        selectedGrouping = event.target.value;
    }
});

// Ensure OpenDetailsModal includes the grouping option
document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("stake-btn")) {
        const type = event.target.getAttribute("data-modal-type");
        const vault = event.target.getAttribute("data-vault");
        const walletsEncoded = event.target.getAttribute("data-wallets");
        openDetailsModal(type, vault, walletsEncoded, selectedGrouping, event);

    }
});

