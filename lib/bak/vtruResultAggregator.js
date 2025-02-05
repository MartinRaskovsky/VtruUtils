/**
 * VtruResultAggregator.js
 * Handles the logic for aggregation of results.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

/**
 * Class for aggregating and summarizing results.
 */
class VtruResultAggregator {
    constructor() {
        this.results = [];
        this.count = 0;
    }

    /**
     * Adds a data object to the results array.
     * @param {Object} data - The data object to add.
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
     * @param {string} label - The label to sort by.
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
     * @returns {Array<Object>} The array of aggregated results.
     */
    get() {
        return this.results;
    }
}

module.exports = VtruResultAggregator;

