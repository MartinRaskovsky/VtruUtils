// src/next/lib/logs.js

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Logs and Diff Utilities
 * ------------------------
 * This module mirrors Perl Logs.pm:
 * - Creates signatures for log files
 * - Finds previous log
 * - Writes current log if different
 * - Computes differences (wallet & totals)
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { debugLog, logError } from './logger.js';

const MODULE = 'logs';
const LOG_DIR = path.resolve(process.cwd(), 'public/data');

function deepSortObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepSortObject);
  } else if (obj && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = deepSortObject(obj[key]);
        return acc;
      }, {});
  }
  return obj;
}


// ─────────────────────────────────────────────
// Signature Generation
// ─────────────────────────────────────────────
export function getSignature(email, vault, wallets = []) {
  //debugLog(MODULE, `getSignature(${email}, ${vault}, wallets=${wallets.length})`);

  let sig = '';
  if (email) {
    sig += email.replace(/@/g, '').replace(/[^a-zA-Z0-9_.-]/g, '');
  }

  const addresses = [];
  if (vault) addresses.push(vault);
  if (wallets && Array.isArray(wallets)) addresses.push(...wallets);

  const cleaned = addresses.map(a => a.replace(/^0x/, '').replace(/[^a-zA-Z0-9]/g, ''));
  cleaned.sort();

  const segmentLen = cleaned.length <= 1 ? 10 : cleaned.length <= 3 ? 6 : cleaned.length <= 5 ? 4 : 3;

  for (const addr of cleaned) {
    if (addr.length >= segmentLen * 2) {
      sig += `_${addr.slice(0, segmentLen)}_${addr.slice(-segmentLen)}`;
    } else {
      sig += `_${addr}`;
    }
  }

  return sig.slice(0, 200);
}

// ─────────────────────────────────────────────
// File Naming / Path Helpers
// ─────────────────────────────────────────────
export function getISOTimeStamp() {
  const now = new Date();
  const ms = now.getMilliseconds();
  return now.toISOString().replace(/:/g, '-').replace(/\..+/, `-${String(ms).padStart(3, '0')}Z`);
}

export function logFileName(signature, timestamp) {
  return `${signature}_${timestamp}.json`;
}

// ─────────────────────────────────────────────
// Latest Log Lookup
// ─────────────────────────────────────────────
export async function findLatestLog(signature) {
  //debugLog(MODULE, `findLatestLog(${signature})`);
  try {
    const files = await fs.readdir(LOG_DIR);
    const matched = files
      .filter(f => f.startsWith(signature) && f.endsWith('.json'))
      .sort()
      .reverse();
    if (!matched.length) return null;

    const fullPath = path.join(LOG_DIR, matched[0]);
    const content = await fs.readFile(fullPath, 'utf8');
    debugLog(MODULE, `Read=${fullPath}`);
    //debugLog(MODULE, `Read=${content}`);
    return JSON.parse(content);
  } catch (err) {
    logError(`Error in findLatestLog: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────
// Log Writing (only if changed)
export async function writeCurrentLog(signature, currentData, previousData = null) {
  //debugLog(MODULE, `writeCurrentLog(${signature})`);
  try {
    const sortedCurrent = deepSortObject(currentData);
    const newJson = JSON.stringify(sortedCurrent, null, 2);

    if (previousData) {
      const sortedPrevious = deepSortObject(previousData);
      const oldJson = JSON.stringify(sortedPrevious, null, 2);
      if (newJson === oldJson) {
        //debugLog(MODULE, `oldJson=${oldJson}`);
        //debugLog(MODULE, `newJson=${newJson}`);
        debugLog(MODULE, "Not written old json equals new json");
        return; // No change
      }
    }

    const fileName = logFileName(signature, getISOTimeStamp());
    const fullPath = path.join(LOG_DIR, fileName);
    await fs.writeFile(fullPath, newJson, 'utf8');
    debugLog(MODULE, `Written: ${fullPath}`);
  } catch (err) {
    logError(`writeCurrentLog failed: ${err.message}`);
  }
}


// ─────────────────────────────────────────────
// Difference Calculation
// ─────────────────────────────────────────────

function computeDifference(key, current, previous) {
  if (!current || !previous || current === previous) return '';
  if (current === '0 (unavailable)' || previous === '0 (unavailable)') return '';

  const a = parseFloat(String(current).replace(/,/g, '')) || 0;
  const b = parseFloat(String(previous).replace(/,/g, '')) || 0;
  const diff = a - b;

  if (diff === 0) return '';
  const cls = diff > 0 ? 'diff-cell increase' : 'diff-cell decrease';
  debugLog(MODULE, `${key}\t${diff} ${a} ${b} ${cls}`);
  return `<span class="${cls}">(${diff > 0 ? '+' : ''}${diff.toFixed(2)})</span>`;
}

export function computeChainDiffs(current, previous) {
  debugLog('logs', `computeChainDiffs: wallets=${current.wallets?.length || 0}, sectionKeys=${current.sectionKeys?.length || 0}`);
  const walletIndex = {};
  const prevWallets = previous?.wallets || [];
  for (let i = 0; i < prevWallets.length; i++) {
    walletIndex[prevWallets[i].toLowerCase()] = i;
  }

  if (!current.__diffs) current.__diffs = {};

  for (const sectionKey of current.sectionKeys || []) {
    if (!current[sectionKey] || !previous[sectionKey]) {
      debugLog('logs', `⚠️ Skipping section ${sectionKey}`);
      continue;
    }

    current.__diffs[sectionKey] = [];
    for (let i = 0; i < current.wallets.length; i++) {
      const wallet = current.wallets[i]?.toLowerCase();
      const prevIdx = walletIndex[wallet];
      const prevVal = prevIdx !== undefined ? previous[sectionKey][prevIdx] : '';
      const currVal = current[sectionKey][i];
      const diff = computeDifference(`${sectionKey}[${i}]`, currVal, prevVal);
      current.__diffs[sectionKey][i] = diff;
    }
  }

  // Totals
  const totalDiffs = [];
  for (let i = 0; i < current.totalKeys.length; i++) {
    const k = current.totalKeys[i];
    totalDiffs.push(computeDifference(`Total[${i}]`, current[k], previous[k]));
  }
  current.__diff_totals = totalDiffs;
}

export function computeDifferences(current, previous) {
  debugLog('logs', 'computeDifferences()');
  if (!current || !previous) return;

  ['evm', 'sol', 'tez'].forEach(chain => {
    if (current[chain] && previous[chain]) {
      computeChainDiffs(current[chain], previous[chain]);
    }
  });
}
