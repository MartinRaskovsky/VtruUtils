/**
 * This module implements the Network class, which manages multiple blockchain
 * network connections using the Web3 class.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require('./libWeb3');

class Network {
  /**
   * Constructs a new Network instance with the given network identifiers.
   * Each identifier is used to create a corresponding Web3 connection.
   *
   * @param {Array<string>} ids - Array of network IDs (e.g., [Web3.VTRU, Web3.BSC])
   */
  constructor(ids) {
    this.networks = {};
    for (const id of ids) {
      // Web3.create() returns an instance immediately (with internal async init).
      this.networks[id] = Web3.create(id);
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
   * @returns {Object} The object containing all Web3 connections.
   */
  getAll() {
    return this.networks;
  }
}

module.exports = { Network };

