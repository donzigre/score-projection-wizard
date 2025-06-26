
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
  const { hasCompanyInfo } = useDataValidation();

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

  const calculateFinancialRatios = () => {
    // Utiliser les données pré-remplies du contexte financier
    const totalCapital = data.fundingSources?.reduce((sum, source) => sum + source.amount, 0) || 0;
    const totalAssets = data.fixedAssets?.reduce((sum, asset) => sum + (asset.quantity * asset.unitPrice), 0) || 0;
    const totalRevenue = data.products?.reduce((sum, product) => {
      const cycles = Math.floor(12 / (product.cycleMonths + (product.periodeRepos || 0)));
      return sum + (product.rendementReel * product.pricePerUnit * cycles);
    }, 0) || 0;
    
    const totalExpenses = (data.operatingExpenses?.reduce((sum, expense) => sum + (expense.monthlyAmount * 12), 0) || 0) +
                         (data.payrollData?.totalPayroll ? data.payrollData.totalPayroll * 12 : 0);
    
    if (totalCapital === 0 && totalAssets === 0 && totalRevenue === 0) {
      return [];
    }

    // Calculs basés sur les données disponibles
    const equity = data.fundingSources?.find(source => source.type.includes('Capital') || source.type.includes('Propre'))?.amount || totalCapital * 0.6;
    const debt = totalCapital - equity;
    
    const debtToEquityRatio = equity > 0 ? debt / equity : 0;
    const equityRatio = totalCapital > 0 ? equity / totalCapital : 0;
    
    const margeNette = totalRevenue - totalExpenses;
    const margeNetteRatio = totalRevenue > 0 ? margeNette / totalRevenue : 0;
    const rentabiliteFondsPropres = equity > 0 ? margeNette / equity : 0;
    
    return [
      { 
        name: 'Endettement / Fonds Propres', 
        value: Math.max(0, debtToEquityRatio), 
        target: 1.5,
        unit: 'ratio'
      },
      { 
        name: 'Autonomie Financière', 
        value: Math.max(0, equityRatio), 
        target: 0.4,
        unit: '%'
      },
      { 
        name: 'Marge Nette', 
        value: Math.max(0, margeNetteRatio), 
        target: 0.15,
        unit: '%'
      },
      { 
        name: 'Rentabilité Fonds Propres', 
        value: Math.max(0, rentabiliteFondsPropres), 
        target: 0.1,
        unit: '%'
      }
    ];
  };

  const ratios = calculateFinancialRatios();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyse des Ratios Financiers</h2>
        <p className="text-gray-600">Indicateurs clés de performance et de santé financière</p>
        {ratios.length > 0 && (
          <p className="text-sm text-amber-600 mt-2">
            Données basées sur votre configuration actuelle - Ajustez vos paramètres pour des résultats précis
          </p>
        )}
      </div>

      {ratios.length === 0 ? (
        <EmptyState
          title="Données financières insuffisantes"
          description="Pour calculer les ratios financiers, configurez vos sources de financement, actifs fixes et prévisions de ventes."
          actionText="Point de Départ"
          onAction={() => console.log('Navigate to starting point')}
          icon={<Calculator className="h-12 w-12" />}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Ratios Financiers Clés</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ratios} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis tickFormatter={(value) => typeof value === 'number' ? value.toFixed(2) : String(value)} />
                  <Tooltip 
                    formatter={(value, name) => [
                      typeof value === 'number' ? value.toFixed(3) : String(value), 
                      name
                    ]} 
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Valeur Actuelle" />
                  <Bar dataKey="target" fill="#82ca9d" name="Cible" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ratios.map((ratio) => (
              <Card key={ratio.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{ratio.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        Valeur: {ratio.value.toFixed(3)}{ratio.unit === '%' ? '%' : ''}
                      </span>
                      <span className="text-sm text-gray-500">
                        Cible: {ratio.target.toFixed(2)}{ratio.unit === '%' ? '%' : ''}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ratio.value >= ratio.target * 0.8 ? 'bg-green-500' : 
                          ratio.value >= ratio.target * 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${Math.min((ratio.value / ratio.target) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-600">
                      {ratio.value >= ratio.target * 0.8 ? 
                        'Performance satisfaisante' : 
                        ratio.value >= ratio.target * 0.5 ? 
                        'Performance modérée' : 
                        'À améliorer'
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RatiosFinanciersSection;
