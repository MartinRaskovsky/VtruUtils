/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * getSections API Route
 *
 * Executes the `getSections.js` script to retrieve top-level balance sections.
 * Enhances the result with diff comparison and logging.
 */

import { handleVaultWalletScript } from '../../../lib/apiRouteUtils';
import { getSignature, findLatestLog, writeCurrentLog, computeDifferences } from '../../../lib/logs.js';
import { getSessionEmail } from '../../../lib/loginServer.js';
import { loadWalletNameMap } from '../../../lib/db.js';
import { debugLog } from '../../../lib/logger.js';

const MODULE = 'getSections';

export async function POST(req) {
  debugLog(MODULE, "POST");
  const body = await req.json();
  const { vault, wallets = [], set_name = '' } = body;

  const email = await getSessionEmail();

  const result = await handleVaultWalletScript({
    body,
    scriptName: 'getSections.js',
    moduleName: 'getSections',
    useGrouping: false,
    parseAsJSON: true,
  }).then(async (res) => {
    if (!res || !res.body) return res;
    const data = await res.json();

    if (data && typeof data === 'object') {
      try {
        const walletNameMap = await loadWalletNameMap();
        data.wallet_names = walletNameMap;

        const signature = getSignature(email, data.address, data.wallets);
        const previous = await findLatestLog(signature);
        await writeCurrentLog(signature, data, previous);
        if (previous) computeDifferences(data, previous);
      } catch (err) {
        console.error('[getSections] ⚠️ Diff/log error:', err.message);
      }
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  return result;
}
