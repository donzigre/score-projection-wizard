
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useParcelles } from '@/contexts/ParcellesContext';
import { useDataValidation } from '@/hooks/useDataValidation';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/formatting';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { FinancialRatio, DiagnosticAlert } from '@/types/financial';

const OutilsDiagnosticSection = () => {
  const { data } = useFinancialData();
  const { parcelles, getTotalMetrics } = useParcelles();
  const { canGenerateReports, hasCompanyInfo } = useDataValidation();

  if (!hasCompanyInfo) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Outils de Diagnostic Financier</h2>
          <p className="text-gray-600">Analyse des ratios clés et alertes pour une gestion proactive</p>
        </div>

        <EmptyState
          title="Configuration requise"
          description="Veuillez d'abord configurer les informations de votre entreprise pour accéder aux outils de diagnostic."
          actionText="Aller à la Configuration"
          onAction={() => console.log('Navigate to configuration')}
          icon={<AlertTriangle className="h-12 w-12" />}
        />
      </div>
    );
  }

  if (!canGenerateReports || parcelles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Outils de Diagnostic Financier</h2>
          <p className="text-gray-600">Analyse des ratios clés et alertes pour une gestion proactive</p>
        </div>

        <EmptyState
          title="Données de parcelles requises"
          description="Pour effectuer un diagnostic financier, vous devez d'abord créer des parcelles et configurer leurs cultures."
          actionText="Gérer les Parcelles"
          onAction={() => console.log('Navigate to parcelles')}
          icon={<TrendingUp className="h-12 w-12" />}
        />
      </div>
    );
  }

  const totalMetrics = getTotalMetrics();
  
  const generateFinancialRatios = (): FinancialRatio[] => {
    const totalCapital = data.fundingSources.reduce((sum, source) => sum + source.amount, 0);
    
    if (totalCapital === 0 || totalMetrics.revenus === 0) {
      return [];
    }

    // Ratios basés sur les données réelles
    const liquidityRatio = totalMetrics.revenus > 0 ? (totalMetrics.revenus - totalMetrics.coutsTotaux) / totalMetrics.revenus : 0;
    const profitMargin = totalMetrics.revenus > 0 ? totalMetrics.margeTotale / totalMetrics.revenus : 0;
    const returnOnInvestment = totalCapital > 0 ? totalMetrics.margeTotale / totalCapital : 0;

    return [
      { name: 'Ratio de Liquidité', value: liquidityRatio, benchmark: 0.2, status: liquidityRatio >= 0.2 ? 'good' : 'warning' },
      { name: 'Marge Bénéficiaire', value: profitMargin, benchmark: 0.15, status: profitMargin >= 0.15 ? 'good' : 'warning' },
      { name: 'Retour sur Investissement', value: returnOnInvestment, benchmark: 0.1, status: returnOnInvestment >= 0.1 ? 'good' : 'warning' }
    ];
  };

  const generateDiagnosticAlerts = (): DiagnosticAlert[] => {
    const alerts: DiagnosticAlert[] = [];
    
    // Analyse basée sur les métriques réelles des parcelles
    if (totalMetrics.margeTotale < 0) {
      alerts.push({
        id: 'negative-margin',
        category: 'Rentabilité',
        message: 'Marge totale négative détectée',
        severity: 'error',
        recommendation: 'Révisez vos coûts de production ou augmentez vos prix de vente'
      });
    }

    if (totalMetrics.rentabilite < 10) {
      alerts.push({
        id: 'low-profitability',
        category: 'Rentabilité',
        message: 'Rentabilité faible (< 10%)',
        severity: 'warning',
        recommendation: 'Optimisez vos processus de production pour réduire les coûts'
      });
    }

    // Analyse des parcelles non rentables
    const parcellesNonRentables = parcelles.filter(parcelle => {
      const product = data.products.find(p => p.id === parcelle.cultureId);
      return product && parcelle.rendementAttendu * product.pricePerUnit < parcelle.coutsPrepration;
    });

    if (parcellesNonRentables.length > 0) {
      alerts.push({
        id: 'unprofitable-parcels',
        category: 'Parcelles',
        message: `${parcellesNonRentables.length} parcelle(s) potentiellement non rentable(s)`,
        severity: 'warning',
        recommendation: 'Analysez les coûts et rendements de ces parcelles'
      });
    }

    return alerts;
  };

  const financialRatios = generateFinancialRatios();
  const diagnosticAlerts = generateDiagnosticAlerts();

  if (financialRatios.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Outils de Diagnostic Financier</h2>
          <p className="text-gray-600">Analyse des ratios clés et alertes pour une gestion proactive</p>
        </div>

        <EmptyState
          title="Sources de financement requises"
          description="Pour effectuer un diagnostic complet, vous devez configurer vos sources de financement dans le Point de Départ."
          actionText="Point de Départ"
          onAction={() => console.log('Navigate to starting point')}
          icon={<AlertTriangle className="h-12 w-12" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Outils de Diagnostic Financier</h2>
        <p className="text-gray-600">Analyse des ratios clés et alertes pour une gestion proactive</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ratios Financiers Clés</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialRatios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alertes et Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          {diagnosticAlerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-green-600 mb-2">✅ Aucune alerte détectée</div>
              <p className="text-gray-600">Votre plantation semble en bonne santé financière.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {diagnosticAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'error' ? 'border-red-500 bg-red-50' : 
                  alert.severity === 'warning' ? 'border-orange-500 bg-orange-50' : 
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className={`font-semibold ${
                    alert.severity === 'error' ? 'text-red-700' : 
                    alert.severity === 'warning' ? 'text-orange-700' : 
                    'text-blue-700'
                  }`}>
                    [{alert.category}] {alert.message}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    💡 {alert.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé des métriques des parcelles */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé Financier de la Plantation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Coûts Totaux</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(totalMetrics.coutsTotaux)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Revenus Attendus</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalMetrics.revenus)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Marge Totale</p>
              <p className={`text-xl font-bold ${totalMetrics.margeTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalMetrics.margeTotale)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Rentabilité</p>
              <p className={`text-xl font-bold ${totalMetrics.rentabilite >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalMetrics.rentabilite.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutilsDiagnosticSection;
