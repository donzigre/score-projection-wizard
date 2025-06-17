import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { convertFundingSourcesToLegacy } from '@/utils/dataAdapters';

const RatiosFinanciersSection = () => {
  const { data, calculations } = useFinancialData();

  const calculateFinancialRatios = () => {
    const legacyFundingSources = convertFundingSourcesToLegacy(data.fundingSources);
    
    // Ratios de structure
    const totalCapital = calculations.totalFundingSources;
    const equity = legacyFundingSources.ownersEquityAmount || 100000;
    const debt = totalCapital - equity;
    
    const debtToEquityRatio = equity > 0 ? debt / equity : 0;
    const equityRatio = totalCapital > 0 ? equity / totalCapital : 0;
    
    // Ratios de liquidité (BFR)
    const stockRotation = 50; // Jours
    const clientRotation = 30; // Jours
    const fournisseurRotation = 45; // Jours
    
    const bfrEnJours = stockRotation + clientRotation - fournisseurRotation;
    
    // Ratios de rentabilité
    const chiffreAffaires = data.products?.reduce((total, product) => {
      return total + (product.unitsPerMonth * product.pricePerUnit * 12);
    }, 0) || 0;
    const resultatNet = chiffreAffaires * 0.1; // Hypothèse de 10% de marge nette
    
    const margeNette = chiffreAffaires > 0 ? resultatNet / chiffreAffaires : 0;
    const rentabiliteFondsPropres = equity > 0 ? resultatNet / equity : 0;
    const levierFinancier = equity > 0 ? debt / equity : 0;
    
    return [
      { name: 'Endettement / Fonds Propres', value: debtToEquityRatio, target: 1.5 },
      { name: 'Autonomie Financière', value: equityRatio, target: 0.4 },
      { name: 'BFR (jours de CA)', value: bfrEnJours, target: 45 },
      { name: 'Marge Nette', value: margeNette, target: 0.15 },
      { name: 'Rentabilité Fonds Propres', value: rentabiliteFondsPropres, target: 0.1 },
      { name: 'Effet de levier', value: levierFinancier, target: 0.5 }
    ];
  };

  const ratios = calculateFinancialRatios();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyse des Ratios Financiers</h2>
        <p className="text-gray-600">Indicateurs clés de performance et de santé financière</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ratios Financiers Clés</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ratios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => value.toFixed(2)} />
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Ratio" />
              <Line dataKey="target" stroke="red" name="Cible" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ratios.map((ratio) => (
          <Card key={ratio.name}>
            <CardHeader>
              <CardTitle>{ratio.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  Valeur: {ratio.value.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Cible: {ratio.target.toFixed(2)}
                </p>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.min(ratio.value / ratio.target, 1) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RatiosFinanciersSection;
