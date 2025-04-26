// src/next/components/DashboardWithNames.jsx

'use client';

import { useState, useEffect } from 'react';
import SectionRenderer from './SectionRenderer';
import { fetchNameMap } from '../lib/fetchNames';
import { setNameCache } from '../lib/nameCache';

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Wrapper component that ensures name cache is loaded BEFORE rendering the dashboard.
 */
export default function DashboardWithNames({ data }) {
  //console.log(`DashboardWithNames(${data})`);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wallets = data?.wallets || [];
    fetchNameMap(wallets).then(nameMap => {
      setNameCache(nameMap);
      setReady(true);
    });
  }, [data]);

  if (!ready) return <p style={{ color: 'white' }}>Loading...</p>;

  return <SectionRenderer data={data} />;
}

