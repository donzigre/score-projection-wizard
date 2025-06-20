
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useParcelles } from '@/contexts/ParcellesContext';
import { useDataValidation } from '@/hooks/useDataValidation';
import { EmptyState } from '@/components/ui/EmptyState';
import { Calculator, TrendingUp } from 'lucide-react';

const RatiosFinanciersSection = () => {
  const { data } = useFinancialData();
  const { parcelles } = useParcelles();
  const { canGenerateReports, hasCompanyInfo } = useDataValidation();

  if (!hasCompanyInfo) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyse des Ratios Financiers</h2>
          <p className="text-gray-600">Indicateurs clés de performance et de santé financière</p>
        </div>

        <EmptyState
          title="Configuration requise"
          description="Veuillez d'abord configurer les informations de votre entreprise pour voir les ratios financiers."
          actionText="Aller à la Configuration"
          onAction={() => console.log('Navigate to configuration')}
          icon={<Calculator className="h-12 w-12" />}
        />
      </div>
    );
  }

  if (!canGenerateReports || parcelles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyse des Ratios Financiers</h2>
          <p className="text-gray-600">Indicateurs clés de performance et de santé financière</p>
        </div>

        <EmptyState
          title="Données de parcelles requises"
          description="Pour analyser les ratios financiers, vous devez d'abord créer des parcelles et leur assigner des cultures."
          actionText="Gérer les Parcelles"
          onAction={() => console.log('Navigate to parcelles')}
          icon={<TrendingUp className="h-12 w-12" />}
        />
      </div>
    );
  }

  const calculateFinancialRatios = () => {
    // Calculs basés sur les données réelles des parcelles
    const totalCapital = data.fundingSources.reduce((sum, source) => sum + source.amount, 0);
    const totalAssets = data.fixedAssets.reduce((sum, asset) => sum + (asset.quantity * asset.unitPrice), 0);
    
    if (totalCapital === 0 || totalAssets === 0) {
      return [];
    }

    const equity = totalCapital * 0.6; // Estimation
    const debt = totalCapital - equity;
    
    const debtToEquityRatio = equity > 0 ? debt / equity : 0;
    const equityRatio = totalCapital > 0 ? equity / totalCapital : 0;
    
    // Calculs basés sur les revenus réels des parcelles
    const totalRevenue = parcelles.reduce((sum, parcelle) => {
      const product = data.products.find(p => p.id === parcelle.cultureId);
      if (product) {
        return sum + (product.unitsPerMonth * product.pricePerUnit * 12);
      }
      return sum;
    }, 0);
    
    const margeNette = totalRevenue > 0 ? totalRevenue * 0.15 : 0;
    const rentabiliteFondsPropres = equity > 0 ? margeNette / equity : 0;
    
    return [
      { name: 'Endettement / Fonds Propres', value: debtToEquityRatio, target: 1.5 },
      { name: 'Autonomie Financière', value: equityRatio, target: 0.4 },
      { name: 'Marge Nette', value: margeNette / totalRevenue, target: 0.15 },
      { name: 'Rentabilité Fonds Propres', value: rentabiliteFondsPropres, target: 0.1 }
    ];
  };

  const ratios = calculateFinancialRatios();

  if (ratios.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyse des Ratios Financiers</h2>
          <p className="text-gray-600">Indicateurs clés de performance et de santé financière</p>
        </div>

        <EmptyState
          title="Données financières insuffisantes"
          description="Pour calculer les ratios financiers, vous devez configurer vos sources de financement et actifs fixes."
          actionText="Point de Départ"
          onAction={() => console.log('Navigate to starting point')}
          icon={<Calculator className="h-12 w-12" />}
        />
      </div>
    );
  }

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
              <YAxis tickFormatter={(value) => typeof value === 'number' ? value.toFixed(2) : String(value)} />
              <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(2) : String(value)} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Ratio" />
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
