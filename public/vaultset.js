async function runVaultSet() {
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
        const response = await fetch('/api/vaultset', {
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

// 🔥 Ensure `runVaultSet` is globally available
window.runVaultSet = runVaultSet;

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
    const count = modifiedData.wallets.length - 1; //dont count vault;
    const plural = (count === 1) ? "" : "s";
    const vaultTitle = `${name}<br>${vault}<br>Vault + ${count} wallet${plural}`;

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
                ${generateTableSection("Held", vault, modifiedData.wallets, modifiedData.walletBalances, modifiedData.held)}
                ${generateTableSection("Staked", vault, modifiedData.wallets, modifiedData.walletStaked, modifiedData.staked)}
                ${generateTableSection("Verse", vault, modifiedData.wallets, modifiedData.walletVerses, modifiedData.verses, false, "VERSES")}
                ${generateTableSection("Vibe", vault, modifiedData.wallets, modifiedData.walletVibes, modifiedData.vibes, false, "VIBES")}
                <tr class="section-header"><td colspan="3">Summary</td></tr>
                <tr class="total-row">
                    <td><strong>Total VTRU Held</strong></td>
                    ${formatScalarDiff(modifiedData.held)}
                    <td class="balance-cell"><strong>${modifiedData.held.value}</strong></td>
                </tr>
                <tr class="total-row">
                    <td><strong>Total VTRU Staked</strong></td>
                    ${formatScalarDiff(modifiedData.staked)}
                    <td class="balance-cell"><strong>${modifiedData.staked.value}</strong></td>
                </tr>
                <tr class="total-row">
                    <td><strong>Total Verses</strong></td>
                    ${formatScalarDiff(modifiedData.verses)}
                    <td class="balance-cell"><strong>${modifiedData.verses.value}</strong></td>
                </tr>
                <tr class="total-row">
                    <td><strong>Total Vibes</strong></td>
                    ${formatScalarDiff(modifiedData.vibes)}
                    <td class="balance-cell"><strong>${modifiedData.vibes.value}</strong></td>
                </tr>
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
    ["walletBalances", "walletStaked", "walletVibes", "walletVerses"].forEach(field => {
        if (currentData[field]) {
            modifiedData[field] = currentData[field].map((currValue, index) => {
                const wallet = currentData.wallets[index];
                const prevIndex = previousWalletsHash[wallet];
                const prevValue = prevIndex !== undefined ? previousData[field][prevIndex] : null;
                const decimals = (field === "walletVibes" || field === "walletVerses")? 0: 2;
                return getDifference(currValue, prevValue, decimals);
            });
        }
    });

    // Process totals
    ["held", "staked", "verses", "vibes"].forEach(field => {
        const decimals = (field === "verses" || field === "vibes")? 0: 2;
        modifiedData[field] = getDifference(currentData[field], previousData[field], decimals);
    });

    return modifiedData;
}

function generateTableSection(title, vault, wallets, values, total, showVTRU = false, totalLabel = title) {
    if (!wallets || wallets.length === 0) return "";

    let rows = wallets.map((wallet, index) => {
        const balance = values[index];
        if (!balance || !balance.value || balance.value === "0.00") return ""; // Skip empty rows
        let address = wallet;
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

    let stakedButton = "";
    if (title === "Staked") {
        const encodedWallets = encodeURIComponent(JSON.stringify(wallets));
        stakedButton = `
            <button class="stake-toggle-btn" data-vault="${vault}" data-wallets="${encodedWallets}" onclick="openStakeModal('${vault}', '${encodedWallets}', event)">▼</button>
        `;
    }    

    return rows
    ? `
        <tr class="section-header"><td colspan="3">${title}</td></tr>
        ${rows}
        <tr class="total-row">
            <td><strong>Total ${totalLabel} ${stakedButton}</strong></td>
            ${formatScalarDiff(total)}
            <td class="balance-cell decimal-align"><strong>${total.value}</strong></td>
        </tr>
        <tr class="spacer-row"><td colspan="3"></td></tr>
    `
    : "";
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("stake-toggle-btn")) {
            //console.log("✅ ▼ Button Clicked:", event.target);

            const vault = event.target.getAttribute("data-vault");
            const walletsEncoded = event.target.getAttribute("data-wallets");

            if (!vault || !walletsEncoded) {
                console.error("❌ Missing vault or wallets data!");
                return;
            }

            openStakeModal(vault, walletsEncoded, event); // ✅ Explicitly pass event
        }
    });
});

function truncateAddress(address) {
    return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

// Make function globally available
window.truncateAddress = truncateAddress;

