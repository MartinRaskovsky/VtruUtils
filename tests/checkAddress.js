#!/usr/bin/env node

const { getAddress } = require("ethers");

//console.log(getAddress("0xd9aaEC86B65d86f6a9b61B2aF5DdA7fC9C89e5b7"));

// Convert from lowercase → checksummed
//const raw = "0xd9aaec86b65d86f6a9b61b2af5dda7fc9c89e5b7";
//console.log(getAddress(raw));

//console.log(getAddress("0xd9aaEC86B65d86f6A9B61B2aF5DdA7fC9C89E5b7"));
console.log(getAddress("0xd9aaec86b65d86f6a9b61b2af5dda7fc9c89e5b7")); // ✅

