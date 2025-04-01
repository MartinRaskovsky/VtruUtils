function openSaveAddressSetModal() {
    const modal = document.getElementById('saveSetsModal');
    if (modal) {
        modal.classList.add('active');
        //console.log("✅ Save modal activated");
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

function LoadSet() {
    const selected = document.getElementById('savedSetSelect').value;
    if (!selected) return;

    fetch(`loadset.cgi?name=${encodeURIComponent(selected)}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('vaultAddress').value = data.vault;
            document.getElementById('walletAddresses').value = data.wallets.join('\n');
            validateForm();
            closeLoadSet();
        })
        .catch(() => {
            alert('Failed to load address set.');
        });
}

/*function DeleteSet() {
    const selected = document.getElementById('savedSetSelect').value;
    if (!selected) return;

    if (!confirm(`Are you sure you want to delete the set "${selected}"?`)) {
        return;
    }

    fetch(`deleteset.cgi?name=${encodeURIComponent(selected)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Optionally reload the list
                alert(`Set "${selected}" deleted.`);
                closeLoadSet();
            } else {
                alert(data.message || 'Failed to delete the set.');
            }
        })
        .catch(() => {
            alert('Error deleting set.');
        });
}*/

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


// Extend validateForm to control Save button too
const origValidateForm = validateForm;
validateForm = function () {
    origValidateForm();

    const vault = document.getElementById('vaultAddress').value.trim();
    const wallets = document.getElementById('walletAddresses').value.trim();
    const saveBtn = document.getElementById('saveSetsBtn');
    const getBtn = document.getElementById('getDetailsBtn');

    if (saveBtn && getBtn) {
        saveBtn.disabled = getBtn.disabled;
    }
};

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
            })
            .catch(() => {
                console.log("⚠️ Could not load saved sets list");
                getBtn.setAttribute('disabled', 'disabled');
            });
    }
   
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteSet);
    }
});



