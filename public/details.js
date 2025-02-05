async function runScript(scriptName) {
    const outputElement = document.getElementById('output');
    const userInput = prompt("Enter command-line arguments (separated by spaces):");

    if (!userInput) {
        alert("Input is required!");
        return;
    }

    // Properly split input arguments while preserving quoted arguments
    const args = userInput.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    outputElement.textContent = "Running...";

    try {
        const requestBody = JSON.stringify({ scriptName, args });

        const response = await fetch('/run-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody
        });

        if (!response.ok) {
            console.error("Server responded with error:", response.status);
            outputElement.textContent = `Error: Server returned ${response.status}`;
            return;
        }

        const result = await response.json();

        if (result.success) {
            outputElement.innerHTML = formatOutput(scriptName, JSON.parse(result.output));
        } else {
            outputElement.textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        outputElement.textContent = "Error connecting to the server.";
    }
}

/**
 * Formats output based on the script.
 */
function formatOutput(scriptName, json) {
    if (scriptName.includes("getWalletDetails")) {
        return renderWalletDetails(json);
    } else if (scriptName.includes("getVaultDetails")) {
        return renderVaultDetails(json);
    } else {
        return `<pre>${syntaxHighlight(json)}</pre>`;
    }
}

function generateTableSection(title, wallets, values, total, showVTRU = false, totalLabel = title) {
    if (!wallets || wallets.length === 0) return "";

    let rows = wallets
        .map((wallet, index) => {
            if (!values[index] || values[index] === "0.00") return ""; // Skip empty rows
            return `
                <tr>
                    <td class="wallet-cell">${wallet}</td>
                    <td class="balance-cell">${values[index]}</td> <!-- No denomination -->
                </tr>
            `;
        })
        .filter(row => row) // Remove empty strings
        .join("");

    return rows
        ? `
            <tr class="section-header"><td colspan="2">${title}</td></tr>
            ${rows}
            <tr class="total-row">
                <td><strong>Total ${totalLabel}</strong></td>
                <td class="balance-cell"><strong>${total}</strong></td> <!-- No denomination -->
            </tr>
            <tr class="spacer-row"><td colspan="2"></td></tr> <!-- Background-colored blank line -->
        `
        : ""; // If no valid rows, remove entire section
}


function renderWalletDetails(data) {
    return `
        <h2>Wallets</h2>
        <table>
            <thead>
                <tr>
                    <th>WALLET</th>
                    <th>BALANCE</th>
                </tr>
            </thead>
            <tbody>
                ${generateTableSection("Held", data.wallets, data.walletBalances, data.held)}
                ${generateTableSection("Staked", data.wallets, data.walletStaked, data.staked)}
                ${generateTableSection("Verse", data.wallets, data.walletVerses, data.verses, false, "Verses")}
                ${generateTableSection("Vibe", data.wallets, data.walletVibes, data.vibes, false, "Vibes")}
                <tr class="section-header"><td colspan="2">Summary</td></tr>
                <tr class="total-row"><td><strong>Total VTRU Held</strong></td><td class="balance-cell"><strong>${data.held}</strong></td></tr> <!-- No denomination -->
                <tr class="total-row"><td><strong>Total VTRU Staked</strong></td><td class="balance-cell"><strong>${data.staked}</strong></td></tr> <!-- No denomination -->
                <tr class="total-row"><td><strong>Total Verses</strong></td><td class="balance-cell"><strong>${data.verses}</strong></td></tr>
                <tr class="total-row"><td><strong>Total Vibes</strong></td><td class="balance-cell"><strong>${data.vibes}</strong></td></tr>
            </tbody>
        </table>
    `;
}

function renderVaultDetails(data) {
    return `
        <h2>${data.name}</h2>
        <table class="dynamic-width">
            <thead>
                <tr>
                    <th>WALLET</th>
                    <th>BALANCE</th>
                </tr>
            </thead>
            <tbody>
                ${generateTableSection("Held", [`${data.address} Vault`, ...data.wallets], [data.balance, ...data.walletBalances], data.held)}
                ${generateTableSection("Staked", data.wallets, data.walletStaked, data.staked)}
                ${generateTableSection("Verse", data.wallets, data.walletVerses, data.verses, false, "Verses")}
                ${generateTableSection("Vibe", data.wallets, data.walletVibes, data.vibes, false, "Vibes")}
                <tr class="section-header"><td colspan="2">Summary</td></tr>
                <tr class="total-row"><td><strong>Total VTRU Held</strong></td><td class="balance-cell"><strong>${data.held}</strong></td></tr> <!-- No denomination -->
                <tr class="total-row"><td><strong>Total VTRU Staked</strong></td><td class="balance-cell"><strong>${data.staked}</strong></td></tr> <!-- No denomination -->
                <tr class="total-row"><td><strong>Total Verses</strong></td><td class="balance-cell"><strong>${data.verses}</strong></td></tr>
                <tr class="total-row"><td><strong>Total Vibes</strong></td><td class="balance-cell"><strong>${data.vibes}</strong></td></tr>
            </tbody>
        </table>
    `;
}

/**
 * JSON Syntax Highlighting
 */
function syntaxHighlight(json) {
    return `<pre>${JSON.stringify(json, null, 2)}</pre>`;
}


