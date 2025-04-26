/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * API Route Utilities
 *
 * Shared helper for executing CLI scripts in POST-based API routes.
 */

import { runNodeScript } from './scriptRunner';
import { debugLog } from './logger';

/**
 * Standard API handler for vault + wallet + optional grouping.
 * Used by: getSections, getDetails
 */
export async function handleVaultWalletScript({
  body,
  scriptName,
  moduleName,
  useGrouping = false,
  parseAsJSON = true,
}) {
  try {
    let { vault, wallets = [], grouping = 'none' } = body;

    if (vault === 'undefined' || vault === null) vault = '';
    if (!vault && wallets.length === 0) {
      return new Response(JSON.stringify({ error: 'Vault or wallet list required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    debugLog(moduleName, `POST vault=${vault || 'none'}, group=${grouping}, wallets=${wallets.length}`);

    const args = [];
    if (vault) args.push('-v', vault);
    if (wallets.length) args.push(...wallets);
    if (useGrouping && grouping && grouping !== 'none') args.push('-g', grouping);

    const result = await runNodeScript(scriptName, args, parseAsJSON, moduleName);

    const bodyOut = parseAsJSON ? JSON.stringify(result) : result;
    return new Response(bodyOut, {
      status: 200,
      headers: {
        'Content-Type': parseAsJSON
          ? 'application/json'
          : 'text/html; charset=utf-8',
      },
    });
  } catch (err) {
    console.error(`[${moduleName}] ❌ ${err.message}`);
    const errorBody = parseAsJSON
      ? JSON.stringify({ error: 'Script execution failed' })
      : `<h3 style="color:red;">Script error: ${err.message}</h3>`;
    return new Response(errorBody, {
      status: 500,
      headers: {
        'Content-Type': parseAsJSON
          ? 'application/json'
          : 'text/html; charset=utf-8',
      },
    });
  }
}

