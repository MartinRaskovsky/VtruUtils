function openSaveAddressSetModal() {
    const modal = document.getElementById('saveSetsModal');
    const input = document.getElementById('saveSetName');

    if (modal) {
        modal.classList.add('active');
    }

    if (input) {
        input.value = ''; // Ensure blank input on open
    }
}

function closeLoadSetsModal() {
    const modal = document.getElementById('saveSetsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openLoadSetsModal() {
    const modal = document.getElementById('LoadSetsModal');
    const select = document.getElementById('savedSetSelect');
    const getBtn = document.getElementById('loadSetBtn');

    if (modal) {
        modal.classList.add('active');
    }

    select.innerHTML = '<option>Loading...</option>';

    fetch('listsets.cgi')
        .then(res => res.json())
        .then(data => {
            select.innerHTML = '';
            if (data.sets.length === 0) {
                // Nothing to load — disable button and close modal
                getBtn.setAttribute('disabled', 'disabled');
                modal.classList.remove('active');
                return;
            }

            // Enable the button if it was previously disabled
            getBtn.removeAttribute('disabled');

            data.sets.forEach(setName => {
                const option = document.createElement('option');
                option.value = setName;
                option.textContent = setName;
                select.appendChild(option);
            });
        })
        .catch(() => {
            select.innerHTML = '<option disabled>Error loading sets</option>';
        });
}

function closeLoadSet() {
    const modal = document.getElementById('LoadSetsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

let initialVaultValue = '';   // Store initial vault address
let initialWalletValue = '';  // Store initial wallet addresses

function resetInitialValues(vault, wallets) {
    initialVaultValue = vault; 
    initialWalletValue = wallets;
}

function updateCurrentSetName(name) {
    const currentSetElement = document.getElementById('currentSetName');
    currentSetElement.textContent = name;
}

function LoadSet() {
    const selected = document.getElementById('savedSetSelect').value;
    if (!selected) return;

    fetch(`loadset.cgi?name=${encodeURIComponent(selected)}`)
        .then(res => res.json())
        .then(data => {
 
            resetInitialValues(data.vault, data.wallets.join('\n'));
            updateCurrentSetName(data.name)

            // Set the vault and wallet values
            document.getElementById('vaultAddress').value = initialVaultValue;
            document.getElementById('walletAddresses').value = initialWalletValue;
  
            window.validateForm();
            closeLoadSet();
        })
        .catch(() => {
            alert('Failed to load address set.');
        });
}

function markVaultNameAsEdited() {
    const vaultInput = document.getElementById('vaultAddress');
    const walletInput = document.getElementById('walletAddresses');
    const currentSetElement = document.getElementById('currentSetName');

    // Check if the current value differs from the initial value (i.e., it was edited)
    if (vaultInput.value !== initialVaultValue || walletInput.value !== initialWalletValue) {
        currentSetElement.textContent = currentSetElement.textContent.replace(" (edited)", "") + " (edited)";
    } else {
        // Remove the (edited) mark if no changes were made
        currentSetElement.textContent = currentSetElement.textContent.replace(" (edited)", "");
    }
}

// Listen for changes on the vault and wallet inputs
document.getElementById('vaultAddress').addEventListener('input', markVaultNameAsEdited);
document.getElementById('walletAddresses').addEventListener('input', markVaultNameAsEdited);

function saveSets() {
    const name = document.getElementById('saveSetName').value.trim();
    const vault = document.getElementById('vaultAddress').value.trim();
    const wallets = document.getElementById('walletAddresses').value.trim();

    if (!name || (!vault && !wallets)) return;

    const params = new URLSearchParams({ name, vault, wallets });

    fetch('savesets.cgi?' + params.toString())
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                closeLoadSetsModal();

                // ✅ Enable the Load button quietly if it was disabled
                const getBtn = document.getElementById('loadSetBtn');
                if (getBtn) getBtn.removeAttribute('disabled');
                
                resetInitialValues(vault,  wallets);
                updateCurrentSetName(name);
            } else {
                alert(data.message || 'Failed to save set.');
            }
        })
        .catch(() => alert('Error saving set.'));
}

function showDeleteConfirmation() {
    const selected = document.getElementById('savedSetSelect').value;
    if (!selected) return;

     document.getElementById('LoadSetsModal').classList.remove('active');

    document.getElementById('deleteSetNameLabel').textContent = selected;
    document.getElementById('confirmDeleteModal').style.display = 'block';
}

function closeConfirmDeleteModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
}

function confirmDeleteSet() {
    const name = document.getElementById('savedSetSelect').value;
    if (!name) return;

    fetch(`deleteset.cgi?name=${encodeURIComponent(name)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                closeConfirmDeleteModal();
                closeLoadSet();

                const currentSetElement = document.getElementById('currentSetName');
                if (name === currentSetElement) {
                    updateCurrentSetName("");
                }

                // Refresh the list
                setTimeout(() => openLoadSetsModal(), 100);
            } else {
                alert("Failed to delete set."); // Optional: Convert to branded error box
            }
        })
        .catch((error) => {
            alert(`Error deleting set: ${error.message}`);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById('saveSetsBtn');
    const getBtn = document.getElementById('loadSetBtn');
    const modal = document.getElementById('saveSetsModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            openSaveAddressSetModal();
        });

        const detailsBtn = document.getElementById('getDetailsBtn');
        if (detailsBtn) {
            saveBtn.disabled = detailsBtn.disabled;
        }
    }

    if (getBtn) {
        getBtn.addEventListener('click', openLoadSetsModal);

        // ✅ Disable Get button if no sets exist (on page load)
        fetch('listsets.cgi')
            .then(res => res.json())
            .then(data => {
                if (data.sets.length === 0) {
                    getBtn.setAttribute('disabled', 'disabled');
                } else {
                    getBtn.removeAttribute('disabled');
                }
                window.validateForm();
            })
            .catch(() => {
                console.log("⚠️ Could not load saved sets list");
                getBtn.setAttribute('disabled', 'disabled');
                window.validateForm();
            });
    }
   
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteSet);
    }
});



