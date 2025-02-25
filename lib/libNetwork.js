/**
 * libNetwork.js
 * 
 * This module implements the Network class, which manages multiple blockchain
 * network connections using the Web3 class.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require('../lib/libWeb3');

class Network {
  
  /**
   * Initializes the Network instance with the specified network identifiers.
   * Each identifier is used to create a corresponding Web3 connection.
   * 
   * @param {Array<string>} ids - Array of network IDs (e.g., [Web3.VTRU, Web3.BSC]).
   *     or <sstring> id - Network ID (e.g., Web3.VTRU).
   */
  constructor(ids) {
    this.networks = {};
    // Web3.create() returns an instance immediately (with internal async init).
    if (Array.isArray(ids)) {
      for (const id of ids) {
        this.networks[id] = Web3.create(id);
      }
    } else {
      this.networks[ids] = Web3.create(ids);
    }
  }

  /**
   * Retrieves the Web3 instance associated with a given network identifier.
   * 
   * @param {string} id - The network identifier.
   * @returns {Web3} The corresponding Web3 instance.
   */
  get(id) {
    return this.networks[id];
  }

  /**
   * Returns an object mapping all network identifiers to their Web3 instances.
   * 
   * @returns {Object} An object containing all Web3 connections.
   */
  getAll() {
    return this.networks;
  }
}

module.exports = Network;
