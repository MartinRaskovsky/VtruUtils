/**
 * constants.js
 *
 * Shared constants across server, client, and library modules.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

// Networks
const NET_VTRU  = "VTRU";
const NET_ETH   = "ETH";
const NET_BSC   = "BSC";

// Section Titles
const SEC_VTRU_HELD   = "VTRU Held";
const SEC_VTRU_STAKED = "VTRU Staked";
const SEC_VTRO_HELD   = "VTRO Held";
const SEC_VUSD        = "VUSD";
const SEC_WVTRU       = "wVTRU";
const SEC_VERSE       = "VERSE";
const SEC_VIBE        = "VIBE";
const SEC_VORTEX      = "VORTEX";
const SEC_SEVOX       = "SEVO-X Staked";
const SEC_VTRU_ETH    = "VTRU ETH Bridged";
const SEC_VTRU_BSC    = "VTRU BSC Bridged";
const SEC_ETH         = "ETH";
const SEC_BNB         = "BNB";

// Section mapping for details popups
const detailType = {
    [SEC_VTRU_STAKED]: "stake",
    [SEC_VIBE]: "vibe",
    [SEC_VORTEX]: "vortex",
    [SEC_SEVOX]: "bsc"
};

const hasGroups = {
    [SEC_VTRU_STAKED]: true
};

// Export for Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SEC_VTRU_HELD,
        SEC_VTRU_STAKED,
        SEC_VTRO_HELD,
        SEC_VUSD,
        SEC_WVTRU,
        SEC_VERSE,
        SEC_VIBE,
        SEC_VORTEX,
        SEC_SEVOX,
        SEC_ETH,
        SEC_BNB,
        SEC_VTRU_ETH,
        SEC_VTRU_BSC,
        NET_VTRU,
        NET_ETH,
        NET_BSC,
        detailType,
        hasGroups
    };
}

// Export for Browser
if (typeof window !== "undefined") {
    window.constants = {
        SEC_VTRU_HELD,
        SEC_VTRU_STAKED,
        SEC_VTRO_HELD,
        SEC_VUSD,
        SEC_WVTRU,
        SEC_VERSE,
        SEC_VIBE,
        SEC_VORTEX,
        SEC_SEVOX,
        SEC_ETH,
        SEC_BNB,
        SEC_VTRU_ETH,
        SEC_VTRU_BSC,
        NET_VTRU,
        NET_ETH,
        NET_BSC,
        detailType,
        hasGroups
    };

}

