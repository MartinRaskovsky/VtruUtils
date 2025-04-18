document.addEventListener('DOMContentLoaded', () => {
  let vault = "";
  let walletList = [];
  let setName = "current";

  try {
    const data = JSON.parse(window.name || '{}');
    window.name = "";

    vault = data.vault || "";
    const walletString = data.wallets || "";
    setName = data.setName || "current";

    // ✅ Store values in hidden fields for use during save
    document.getElementById("vaultHidden").value = vault;
    document.getElementById("walletsHidden").value = walletString;
    document.getElementById("setNameHidden").value = setName;

    walletList = walletString.split(/\s+/).map(x => x.trim()).filter(Boolean);

    console.log("vault=", vault);
    console.log("wallets=", walletList);
    console.log("setName=", setName);
  } catch (err) {
    console.error("Could not parse window.name:", err);
  }

  // ✅ Load wallet names from DB
  fetch('/cgi-bin/namesdb.cgi', {
    method: 'POST',
    body: JSON.stringify({
      action: 'load',
      name: setName,
      vault,
      wallets: walletList
    }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(nameMap => {
    const data = walletList.map(address => ({
      address,
      name: nameMap[address] || ""
    }));
  
    data.sort((a, b) => (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase()));
    populateTable(data);
  })
  .catch(err => {
    console.error("Name fetch error:", err);
    showError("Could not load wallet names.");
  });

  document.getElementById('nameForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveNames();
  });
});

function populateTable(data) {
  const tbody = document.querySelector('#walletTable tbody');
  tbody.innerHTML = '';

  data.forEach(({ address, name }) => {
    const row = document.createElement('tr');

    const td1 = document.createElement('td');
    td1.textContent = address;
    row.appendChild(td1);

    const td2 = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = address;
    input.value = name || '';
    input.classList.add('text-input');
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    td2.appendChild(input);

    row.appendChild(td2);
    tbody.appendChild(row);
  });
}

function saveNames() {
  const vault = document.getElementById("vaultHidden")?.value?.trim() || "";
  const walletsRaw = document.getElementById("walletsHidden")?.value?.trim() || "";
  const setName = document.getElementById("setNameHidden")?.value?.trim() || "current";

  const wallets = walletsRaw.split(/\s+/).map(x => x.trim()).filter(Boolean);

  const inputs = document.querySelectorAll('#walletTable input');
  const nameMap = {};
  const nameSet = new Set();

  for (let input of inputs) {
    const rawName = input.value.trim();
    const lowerName = rawName.toLowerCase();

    if (rawName && nameSet.has(lowerName)) {
      showError("Duplicate names are not allowed.");
      return;
    }

    if (rawName) nameSet.add(lowerName);
    nameMap[input.name] = rawName;
  }

  const payload = {
    action: "names",
    name: setName,
    vault,
    wallets,
    wallet_names: nameMap
  };

  fetch('/cgi-bin/namesdb.cgi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(result => {
    if (result.success !== false) {
      window.location.href = "/cgi-bin/index.cgi";
    } else {
      showError(result.message || "Could not save wallet names.");
    }
  })
  .catch(() => showError("Could not save wallet names."));
}

function cancelNameEdit() {
  window.location.href = "/cgi-bin/index.cgi";
}

function showError(msg) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = msg;
  errorDiv.style.display = 'block';
}

