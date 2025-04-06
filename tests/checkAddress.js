#!/usr/bin/env node

const { getAddress } = require("ethers");

const input = '0xD8da6BF26964aF9D7eEd9e03E53415D37aA96045';

const addr = input.toLowerCase();        // normalize
console.log(getAddress(addr));  
