/**
 * libFriendly.js
 * 
 * Shared utility for formatting user-friendly error messages.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

function FriendlyErrorMessage(error) {
    let code = error?.code?.toString?.();

    if (!code && typeof error.message === 'string') {
        const match = error.message.match(/"code"\s*:\s*(-?\d+)/);
        if (match) {
            code = match[1];
        } else if (error.message.includes("429 Too Many Requests")) {
            code = "429";
        } else if (error.message.includes("off curve")) {
            code = "OFFCURVE";
        } else if (error.message.includes("base58")) {
            code = "BAD58";
        } else {
            code = "UNKNOWN";
        }
    }

    const known = {
        "429": "Too Many Requests – rate limit exceeded.",
        "-32005": "Network RPC limit reached.",
        "TIMEOUT": "The request timed out.",
        "OFFCURVE": "Invalid Solana public key (off-curve).",
        "BAD58": "Malformed Solana address (not base58)."
    };

    const base = known[code] ?? error.message ?? "Unknown error occurred.";
    return `❌ Error code ${code}: ${base}`;
}

module.exports = { FriendlyErrorMessage };

