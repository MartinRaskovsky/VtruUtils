#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 *
 * Active test for the Network class.
 */

const { Web3 } = require('../lib/libWeb3');
const { Network } = require("../lib/libNetwork");

async function ident(net) {
  if (net) {
    // Await both asynchronous calls if necessary.
    const id = net.getId();
    const latestBlock = await net.getLatestBlockNumber();
    console.log(id, latestBlock);
  }
}

async function main() {
  try {
    // Correct the class name and remove unnecessary await
    const network = await new Network([Web3.VTRU, Web3.BSC]);
    const vtru = network.get(Web3.VTRU);
    const bsc = network.get(Web3.BSC);

    await ident(vtru);
    await ident(bsc);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

