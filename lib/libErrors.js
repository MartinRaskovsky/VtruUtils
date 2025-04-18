// libErrors.js

const permanentErrorTerms = [
    "No tokens owned",
    "invalid token",
    "account not found",
    "invalid public key",
    "wallet not found",
    "Off-curve address",
    "Request failed with status code 400",
    "SPL Token account does not exist",
    "CALL_EXCEPTION: missing revert" // NEW addition
];

/**
 * Returns true if the reason contains a known permanent error.
 * @param {string} reason 
 * @returns {boolean}
 */
function isPermanentError(reason = "") {
    return permanentErrorTerms.some(term => reason.includes(term));
}

/**
 * Returns a normalized reason string for logging or classification.
 * Pulls from error.reason, error.message, or fallback cases.
 * @param {Error} error 
 * @returns {string}
 */
function extractReason(error) {
    const reason = error?.reason || error?.message || "";

    if (
        error?.code === 'CALL_EXCEPTION' &&
        error?.data == null &&
        error?.reason == null
    ) {
        return "CALL_EXCEPTION: missing revert";
    }

    return reason;
}


module.exports = {
    isPermanentError,
    extractReason,
};

