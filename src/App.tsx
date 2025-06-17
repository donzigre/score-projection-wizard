import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { ParcellesProvider } from '@/contexts/ParcellesContext';
import GestionParcellesSection from '@/components/sections/GestionParcellesSection';

function App() {
  return (
    <FinancialDataProvider>
      <ParcellesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ParcellesProvider>
    </FinancialDataProvider>
  );
}

export default App;
