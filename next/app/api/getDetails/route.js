/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * getDetails API Route
 *
 * Executes per-token detail scripts (e.g., VTRU Staked, VIBE) using vault + wallets.
 * Dynamically determines grouping support per type (e.g., stake, bsc).
 *
 * Used by:
 * - SectionBlock.jsx → modal view
 * - lib/apiClient.js → loadSectionDetails()
 * - Script mapping via libDefs.js → getScriptForType()
 */

import { getScriptForType, getIsGrouperTypeByType } from '../../../lib/libDefs';
import { handleVaultWalletScript } from '../../../lib/apiRouteUtils';
import { debugLog } from '../../../lib/logger.js';

const MODULE = 'getDetails';

export async function POST(req) {
  debugLog(MODULE, "POST");
  const body = await req.json();
  const { type } = body;

  try {
    const scriptName = getScriptForType(type);
    const supportsGrouping = getIsGrouperTypeByType(type);

    return handleVaultWalletScript({
      body,
      scriptName,
      moduleName: 'getDetails',
      useGrouping: supportsGrouping,
      parseAsJSON: true,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

