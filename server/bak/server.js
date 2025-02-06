const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { runScript, runVaultSet, runStakeContract } = require('./scripts');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the correct `src/public/` directory
app.use(express.static(path.join(__dirname, '../public')));

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API to run scripts with command-line arguments
app.post('/run-script', async (req, res) => {
    try {
        const { scriptName, args } = req.body;
        if (!scriptName) return res.status(400).json({ error: "scriptName is required" });

        const result = await runScript(scriptName, args || []);
        res.json({ success: true, output: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to process Vault + Wallets data
app.post('/api/vaultset', async (req, res) => {
    try {
        const { vault, wallets } = req.body;
        const result = await runVaultSet(vault, wallets);
        res.json({ success: true, output: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to process Stake Contract queries
app.post('/api/stakecontract', async (req, res) => {
    try {
        const { wallets } = req.body;
        if (!wallets || wallets.length === 0) return res.status(400).json({ error: "Wallet address is required" });

        const result = await runStakeContract(wallets);
        res.json({ success: true, output: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

