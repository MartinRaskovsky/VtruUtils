// src/lib/DashboardSessionContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import { loadCurrentDashboard, performLogout } from './apiClient';

const DashboardSessionContext = createContext();

export function DashboardSessionProvider({ children }) {
  const [stage, setStage] = useState('checking');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const json = await loadCurrentDashboard();

        if (json.error === 'No session' || json.error === 'Invalid session') {
          console.warn(`[Session] ${json.error} — logging out.`);
          await performLogout();
          setStage('login');
          return;
        }

        if (json.error === 'No current set') {
          console.warn('[Session] No current set — initializing dashboard with empty state.');
          setDashboardData({ vault: '', wallets: [], setName: '' });
          setStage('dashboard');
          return;
        }

        setDashboardData(json);
        setStage('dashboard');
      } catch (err) {
        console.error('[Session] Unexpected failure — logging out.', err);
        await performLogout();
        setStage('login');
      }
    }

    checkSession();
  }, []);

  return (
    <DashboardSessionContext.Provider value={{ stage, setStage, dashboardData, setDashboardData }}>
      {children}
    </DashboardSessionContext.Provider>
  );
}

export function useDashboardSession() {
  return useContext(DashboardSessionContext);
}

