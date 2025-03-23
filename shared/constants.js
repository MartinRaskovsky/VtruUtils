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
const NET_POL   = "POL";

// Section Titles

// Native Coins
const SEC_BNB         = "BNB";
const SEC_ETH         = "ETH";
const SEC_POL         = "POL";
const SEC_VTRU        = "VTRU";

// VTRU bridged
const SEC_VTRU_BSC    = "VTRU on BSC";
const SEC_VTRU_ETH    = "VTRU on ETH";

// USDC
const SEC_USDC_VTRU   = "USDC on VTRU(USDC.pol)";
const SEC_USDC_ETH    = "USDC on ETH";
const SEC_USDC_BSC    = "USDC on BSC";
const SEC_USDC_POL    = "USDC on POL";

// Staked
const SEC_VTRU_STAKED  = "VTRU Staked";
const SEC_SEVOX_STAKED = "SEVO-X Staked";

// Vitruveo Coins & Tokens
const SEC_VERSE       = "VERSE";
const SEC_VIBE        = "VIBE";
const SEC_VORTEX      = "VORTEX";
const SEC_VTRO        = "VTRO";
const SEC_VUSD        = "VUSD";
const SEC_WVTRU       = "wVTRU";

// Sabong
const SEC_SEVO        = "SEVO";
const SEC_SEVOX       = "SEVO-X";

// Vitruveo Exchange
const SEC_V3DEX       = "V3DEX";
const SEC_VITDEX      = "VITDEX";

// Section mapping for summary with subsections
const sectionSummary = [
    { name: 'Native Coins',            sections: [SEC_BNB, SEC_ETH, SEC_POL, SEC_VTRU] },
    { name: 'VTRU Bridged',            sections: [SEC_VTRU_BSC, SEC_VTRU_ETH] },
    { name: 'USDC',                    sections: [SEC_USDC_VTRU, SEC_USDC_ETH, SEC_USDC_BSC, SEC_USDC_POL] },
    { name: 'Staked',                  sections: [SEC_VTRU_STAKED, SEC_SEVOX_STAKED] },
    { name: 'Vitruveo Coins & Tokens', sections: [SEC_VERSE, SEC_VIBE, SEC_VORTEX, SEC_VTRO, SEC_VUSD, SEC_WVTRU] },
    { name: 'Sabong',                  sections: [SEC_SEVO, SEC_SEVOX ]},
    { name: 'Vitruveo Exchange',       sections: [SEC_V3DEX, SEC_VITDEX] },
  ];

// Section mapping for details popups
const detailType = {
    [SEC_VTRU_STAKED]: "stake",
    [SEC_SEVOX_STAKED]: "bsc",
    [SEC_VIBE]: "vibe",
    [SEC_VORTEX]: "vortex",
};

// These groupping defs are needed also in perl-lib/Defs.pm: %group_type_map
const hasGroups = {
    [SEC_VTRU_STAKED]: true,
    [SEC_SEVOX_STAKED]: true,
};

// Export for Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SEC_VTRU,
        SEC_VTRU_STAKED,
        SEC_VTRO,
        SEC_VUSD,
        SEC_WVTRU,
        SEC_VERSE,
        SEC_VIBE,
        SEC_VORTEX,
        SEC_V3DEX,
        SEC_VITDEX,
        SEC_SEVO,
        SEC_SEVOX,
        SEC_SEVOX_STAKED,
        SEC_ETH,
        SEC_BNB,
        SEC_POL,
        SEC_VTRU_ETH,
        SEC_VTRU_BSC,
        SEC_USDC_VTRU,
        SEC_USDC_ETH,
        SEC_USDC_BSC,
        SEC_USDC_POL,
        NET_VTRU,
        NET_ETH,
        NET_BSC,
        NET_POL,
        detailType,
        hasGroups,
        sectionSummary
    };
}

// Export for Browser
if (typeof window !== "undefined") {
    window.constants = {
        SEC_VTRU,
        SEC_VTRU_STAKED,
        SEC_VTRO,
        SEC_VUSD,
        SEC_WVTRU,
        SEC_VERSE,
        SEC_VIBE,
        SEC_VORTEX,
        SEC_V3DEX,
        SEC_VITDEX,
        SEC_SEVO,
        SEC_SEVOX,
        SEC_SEVOX_STAKED,
        SEC_ETH,
        SEC_BNB,
        SEC_POL,
        SEC_VTRU_ETH,
        SEC_VTRU_BSC,
        SEC_USDC_VTRU,
        SEC_USDC_ETH,
        SEC_USDC_BSC,
        SEC_USDC_POL,
        NET_VTRU,
        NET_ETH,
        NET_BSC,
        NET_POL,
        detailType,
        hasGroups,
        sectionSummary
    };

}

