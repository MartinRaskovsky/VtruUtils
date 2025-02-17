/**
 * A utility to prettify output to the console.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

function prettyfier(rows, title, keys) {
    const columnWidths = {};

    // Determine the maximum width for each column
    keys.forEach(key => {
        columnWidths[key] = rows.reduce((max, row) => {
            const value = row[key] ? String(row[key]) : "";
            return Math.max(max, value.length);
        }, key.length);
    });

    // Calculate total width of the table
    const totalWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0) + (keys.length - 1) * 3;

    // Center the title
    //const alignedTitle = title ? title.padStart(Math.floor((totalWidth + title.length) / 2), ' ') : "";
    const alignedTitle = title; // left justified title

    // Format the table headers and separators
    const headers = keys.map(key => key.padStart(columnWidths[key], ' ')).join(' | ');
    const separator = keys.map(key => '-'.repeat(columnWidths[key])).join('-|-');

    // Filter out rows that contain only empty values
    const formattedRows = rows.filter(row => Object.values(row).some(value => value !== ""));

    // Format the row data
    const formattedData = formattedRows.map(row => {
        return keys.map(key => String(row[key] || "").padStart(columnWidths[key], ' ')).join(' | ');
    });

    // Ensure proper output formatting
    return title ? [alignedTitle, headers, separator, ...formattedData].join('\n') : [headers, separator, ...formattedData].join('\n');
}

function prettyfier2(wallets, data, total, title, keys) {
    let rows = [];
    for (let i = 0; i < wallets.length; i++) {
        if (data[i] !== "0" && data[i] !== "0.00") {
            rows.push({wallet: wallets[i], balance: data[i]});
        }
    }
    rows.push({wallet: 'Total', balance: total});
    console.log("\n" + prettyfier(rows, title, keys));
}

/**
 * Prints formatted data or JSON to the console.
 * 
 * @param {Array} rows - The data to be printed.
 * @param {string} [title=""] - Optional title for the table.
 * @param {Array} [keys=[]] - Keys to extract for table formatting.
 * @param {boolean} [format=false] - Whether to format output as a table or raw JSON.
 */
function toConsole(rows, title = "", keys = [], format = false) {
    if (format && keys.length > 0) {
        console.log("\n" + prettyfier(rows, title, keys));
    } else {
        console.log(JSON.stringify(rows, null, 2));
    }
}

module.exports = { toConsole, prettyfier, prettyfier2 };
