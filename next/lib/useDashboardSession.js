import { useEffect, useState } from 'react';
import { loadCurrentDashboard, performLogout } from './apiClient';

export function useDashboardSession() {
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

  return { stage, setStage, dashboardData, setDashboardData };
}
