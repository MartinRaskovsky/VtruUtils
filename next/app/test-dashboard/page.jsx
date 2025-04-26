
'use client';

/**
 * Author: Dr Martín Raskovsky
 * Date: April 2025
 *
 * This is the main dashboard page for the React version of VaWa.
 * Users can input a vault + wallets set using the `DashboardInputForm`,
 * which submits to the `/api/getSections` endpoint (a React equivalent of `driver.cgi`).
 *
 * Once data is returned, it renders a full dashboard using the
 * `SectionRenderer` component: summary + section blocks + totals.
 */

import React, { useState } from 'react';
import VaWaDashboardLayout from '../../components/VaWaDashboardLayout';
import DashboardInputForm from '../../components/DashboardInputForm';
import SectionRenderer from '../../components/SectionRenderer';

export default function ReactDashboardPage() {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(true);
  
  const handleDataLoaded = (result) => {
    setData(result);
    setShowForm(false); // Hide form when data loads
  };
  
  const handleBack = () => {
    setData(null);      // Clear data
    setShowForm(true);  // Show form again
  };
  
  return (
  <VaWaDashboardLayout onBack={handleBack}>

    {showForm && <DashboardInputForm onDataLoaded={handleDataLoaded} />}

    {!showForm && data && <SectionRenderer data={data} />}
  </VaWaDashboardLayout>
  );
}

