/**
 * sections.js
 *
 * Handles the rendering and processing of sections.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

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
        case 'BSC':  return(`<A target=”_blank” href="https://bscscan.com/address/${address}">${label}</A>`);
        case 'ETH':  return(`<A target=”_blank” href="https://etherscan.io/address/${address}">${label}</A>`);
        case 'VTRU': return(`<A target=”_blank” href="https://explorer.vitruveo.xyz/address/${address}">${label}</A>`);
        default:     return "";    
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
                ${generateSections(modifiedData, vault)}         
                <tr class="section-header"><td colspan="3">Summary</td></tr>
                ${generateTotals(modifiedData)}
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
    modifiedData.sectionKeys.forEach((key, kindex) => {
        if (currentData[key]) {
            const decimals = modifiedData.decimals[kindex] ? modifiedData.decimals[kindex] : 0;
            modifiedData[key] = currentData[key].map((currValue, index) => {
                const wallet = currentData.wallets[index];
                const prevIndex = previousWalletsHash[wallet];
                const prevValue = (prevIndex !== undefined && previousData[key] !== undefined) ? previousData[key][prevIndex] : null;
                return getDifference(currValue, prevValue, decimals);
            });
        }
    });

    // Process totals
    modifiedData.totalKeys.forEach((key, kindex) => {
        const decimals = modifiedData.decimals[kindex];
        modifiedData[key] = getDifference(currentData[key], previousData[key], decimals);
    });

    return modifiedData;
}

function generateTotals(modifiedData) {
    const sectionTitles = modifiedData.sectionTitles;
    const totalKeys = modifiedData.totalKeys;
    let rows = sectionTitles.map((title, index) => {
        const totalKey = totalKeys[index];
        return generateLastRow(title, modifiedData[totalKey]);
    }).filter(row => row).join("");
    return rows;
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

function generateSections(modifiedData, vault) {
    const sectionTitles = modifiedData.sectionTitles;
    const sectionKeys = modifiedData.sectionKeys;
    const totalKeys = modifiedData.totalKeys;
    const networkKeys =  modifiedData.networkKeys;
    let rows = sectionTitles.map((title, index) => {
        const sectionKey = sectionKeys[index];
        const networkKey = networkKeys[index];
        const totalKey = totalKeys[index];
        return generateSection(title, networkKey, vault, modifiedData.wallets, modifiedData[sectionKey], modifiedData[totalKey]);
    }).filter(row => row).join("");
    return rows;
}         

function generateSection(title, networkKey, vault, wallets, values, total) {
    if (!wallets || wallets.length === 0 || !values) return "";
    let rows = wallets.map((wallet, index) => {
        const balance = values[index];
        if (!balance || !balance.value || balance.value === "0.00" || balance.value === "0") return ""; // Skip empty rows
        let address = explorerURL(networkKey, wallet);
        if (vault.toLowerCase() === wallet) {
            address = `<strong>${address}</strong>`;
        }
        return `
            <tr class="section-row">
                <td class="wallet-cell">${address}</td>
                ${formatScalarDiff(balance)}
                <td class="balance-cell decimal-align">${balance.value}</td>
            </tr>
        `;
    }).filter(row => row).join("");

    let stakeControls = "";
    const type = detailType[title];
    if (type) {
        groupControls = "";
        const encodedWallets = encodeURIComponent(JSON.stringify(wallets));
        if (hasGroups[title]) {
            groupControls = `
            <span class="group-label">Grouped by:</span>
                <label class="radio-label"><input type="radio" name="grouping${type}" value="none" checked> None</label>
                <label class="radio-label"><input type="radio" name="grouping${type}" value="day"> Day</label>
                <label class="radio-label"><input type="radio" name="grouping${type}" value="month"> Month</label>
                <label class="radio-label"><input type="radio" name="grouping${type}" value="year"> Year</label>
                `;
        }
        stakeControls = `
        <tr class="total-row">
          <td colspan="3">
            <div class="stake-controls">
                <button class="stake-btn" data-modal-type="${type}" data-vault="${vault}" data-wallets="${encodedWallets}" onclick="openDetailsModal('${type}', '${vault}', '${encodedWallets}', selectedGrouping, event)">View ${title} Details</button>
                ${groupControls}
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
    if (event.target.name.startsWith("grouping")) {
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

