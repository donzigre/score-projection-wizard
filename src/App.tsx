
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { ParcellesProvider } from '@/contexts/ParcellesContext';
import { PlantationsProvider } from '@/contexts/PlantationsContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <FinancialDataProvider>
        <ParcellesProvider>
          <PlantationsProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </PlantationsProvider>
        </ParcellesProvider>
      </FinancialDataProvider>
    </Router>
  );
}

export default App;
