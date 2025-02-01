#!/usr/bin/env node

/**
* Author: Dr Martín Raskovsky
* Date: January 2025
* 
* Shows configuration as implemented by vtruConfig.
*/

const VtruConfig = require('../lib/vtruConfig');
const config = new VtruConfig();

function show(name) {
    const value=config.get(name);
    console.log(`${name}=${value}`);
}

show('CONFIG_JSON_FILE_PATH');
show('WALLETS');
show('WALLET_ADDRESS');
show('VAULT_ADDRESS');
show('START_BLOCK');
show('END_BLOCK');

