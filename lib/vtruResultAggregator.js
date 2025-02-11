/**
 * VtruResultAggregator.js
 * 
 * Handles the logic for aggregating and summarizing results.
 * Supports adding, sorting, and retrieving structured data.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

class VtruResultAggregator {
    
    /**
     * Initializes the result aggregator.
     * Maintains an array of results and a count of added entries.
     */
    constructor() {
        this.results = [];
        this.count = 0;
    }

    /**
     * Adds a data object to the results array.
     * Optionally logs the entry count and name when verbose mode is enabled.
     * 
     * @param {Object} data - The data object to add.
     * @param {number} [verbose=1] - If truthy, logs the entry.
     */
    add(data, verbose = 1) {
        if (data?.name) {
            this.count++;
            if (verbose) console.log("%d\t%s", this.count, data.name);
        }
        this.results.push(data);
    }

    /**
     * Sorts results in descending order based on a specified label.
     * 
     * @param {string} label - The key to sort by.
     */
    sort(label) {
        if (!Array.isArray(this.results) || this.results.length === 0) {
            return [];
        }
    
        this.results.sort((a, b) => {
            const valA = parseFloat(a[label]) || 0;
            const valB = parseFloat(b[label]) || 0;
            return valB - valA; // Descending order
        });
    }

    /**
     * Retrieves the aggregated results.
     * 
     * @returns {Array<Object>} The array of aggregated results.
     */
    get() {
        return this.results;
    }
}

module.exports = VtruResultAggregator;
