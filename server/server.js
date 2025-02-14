#!/usr/bin/env node

 /**
 * server.js
 * 
 * Express server handling API requests for running scripts, 
 * processing Vault and Stake Contract queries, and serving static files.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { runScript, runGetSections, runGetDetails } = require('./scripts');

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Serve static files from `src/public/`
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Default route to serve `index.html`
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * API endpoint to execute scripts with command-line arguments.
 * 
 * @route POST /run-script
 * @body { scriptName: string, args: string[] }
 * @returns {Object} { success: boolean, output?: string, error?: string }
 */
app.post('/run-script', async (req, res) => {
    try {
        const { scriptName, args = [] } = req.body;
        if (!scriptName) {
            return res.status(400).json({ error: "scriptName is required" });
        }

        const result = await runScript(scriptName, args);
        res.json({ success: true, output: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * API endpoint to process Vault + Wallets data.
 * 
 * @route POST /api/sections
 * @body { vault: string, wallets: string[] }
 * @returns {Object} { success: boolean, output?: Object, error?: string }
 */
app.post('/api/sections', async (req, res) => {
    try {
        const { vault, wallets } = req.body;
        const result = await runGetSections(vault, wallets);
        res.json({ success: true, output: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * API endpoint to process Stake Contract queries.
 * 
 * @route POST /api/details
 * @body { type: string, vault: string, wallets: string[], grouping: string }
 * @returns {Object} { success: boolean, output?: Object, error?: string }
 */
app.post('/api/details', async (req, res) => {
    try {
        const { type, vault, wallets, grouping } = req.body;
        if (!wallets || wallets.length === 0) {
            return res.status(400).json({ error: "At least one wallet address is required" });
        }

        const result = await runGetDetails(type, vault, wallets, grouping);
        res.json({ success: true, output: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

