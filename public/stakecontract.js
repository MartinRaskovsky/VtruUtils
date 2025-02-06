async function openStakeModal(vault, walletsEncoded, event) {
    //console.log("🔍 openStakeModal() called with:", vault, walletsEncoded, event);
    
    const modal = document.getElementById('stakeModal');
    const modalContent = document.getElementById('stakeModalContent');

    if (!vault) {
        alert("Vault address is missing.");
        return;
    }

    if (!event) {
        console.error("❌ Error: Missing event object!");
        return;
    }

    modal.style.display = "none";

    try {
        const wallets = JSON.parse(decodeURIComponent(walletsEncoded));

        const response = await fetch('/api/stakecontract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vault, wallets })
        });

        const textResult = await response.text();
        const result = JSON.parse(textResult);

        if (result.success) {
            modalContent.innerHTML = renderStakeContract(result.output);
            
            // ✅ Ensure the modal is actually displayed
            modal.style.display = "block";
            modal.style.opacity = "1"; // Ensure it’s fully visible

            // ✅ Adjust Modal Width Dynamically Based on Content
            const modalWidth = Math.min(window.innerWidth * 0.6, 500);
            const modalHeight = window.innerHeight * 0.5; // 50% of viewport height

            let x = event.pageX - modalWidth / 2;
            let y = event.pageY - modalHeight / 2;

            // Ensure modal is within viewport bounds
            x = Math.max(20, Math.min(window.innerWidth - modalWidth - 20, x));
            y = Math.max(20, Math.min(window.innerHeight - modalHeight - 20, y));

            modal.style.width = `${modalWidth}px`;
            modal.style.height = `${modalHeight}px`;
            modal.style.left = `${x}px`;
            modal.style.top = `${y}px`;

            //console.log("✅ Modal positioned at:", x, y, "Width:", modalWidth);
        } else {
            modalContent.innerHTML = `<p>Error: ${result.error}</p>`;
        }
    } catch (error) {
        console.error("❌ Fetch Error:", error);
        modalContent.innerHTML = "<p>Error connecting to the server.</p>";
    }
}

// Function to close the modal
function closeStakeModal() {
    document.getElementById('stakeModal').style.display = "none";
}

window.openStakeModal = openStakeModal;
window.closeStakeModal = closeStakeModal;

function renderStakeContract(data) {
    return `
        <table>
            <thead>
                <tr>
                    <th>Wallet</th>
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
                        <td class="wallet-cell">${window.truncateAddress(row.wallet)}</td> <!-- ✅ Ensure truncation -->
                        <td class="decimal-align">${row.amount}</td>
                        <td class="decimal-align">${row.reward}</td>
                        <td class="decimal-align">${row.totalStaked}</td>
                        <td class="decimal-align">${row.availableToUnstake}</td>
                        <td>${row.estimatedMaturity}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}



