import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { convertFundingSourcesToLegacy, convertOperatingCapitalToLegacy } from '@/utils/dataAdapters';
import { FinancialRatio, DiagnosticAlert } from '@/types/financial';

const OutilsDiagnosticSection = () => {
  const { data, calculations } = useFinancialData();

  const generateFinancialRatios = (): FinancialRatio[] => {
    const legacyFundingSources = convertFundingSourcesToLegacy(data.fundingSources);
    const totalEquity = legacyFundingSources.ownersEquityAmount || 100000;

    // Ratios de liquidité
    const currentRatio = 1.5; // Actif circulant / Passif circulant
    const quickRatio = 1.0;    // (Actif circulant - Stocks) / Passif circulant

    // Ratios de rentabilité
    const grossProfitMargin = 0.35; // (Ventes - COGS) / Ventes
    const netProfitMargin = 0.15;  // Bénéfice net / Ventes
    const returnOnEquity = 0.20;   // Bénéfice net / Capitaux propres

    // Ratios d'endettement
    const debtToEquityRatio = 0.8;  // Total des dettes / Capitaux propres
    const debtToAssetRatio = 0.4;   // Total des dettes / Total des actifs

    return [
      { name: 'Ratio de Liquidité Générale', value: currentRatio, benchmark: 1.5, status: currentRatio >= 1.5 ? 'good' : 'warning' },
      { name: 'Ratio de Liquidité Restreinte', value: quickRatio, benchmark: 1.0, status: quickRatio >= 1.0 ? 'good' : 'warning' },
      { name: 'Marge Brute', value: grossProfitMargin, benchmark: 0.3, status: grossProfitMargin >= 0.3 ? 'good' : 'warning' },
      { name: 'Marge Nette', value: netProfitMargin, benchmark: 0.1, status: netProfitMargin >= 0.1 ? 'good' : 'warning' },
      { name: 'Rentabilité des Capitaux Propres', value: returnOnEquity, benchmark: 0.15, status: returnOnEquity >= 0.15 ? 'good' : 'warning' },
      { name: 'Ratio d\'Endettement', value: debtToEquityRatio, benchmark: 0.5, status: debtToEquityRatio <= 0.5 ? 'good' : 'warning' },
      { name: 'Ratio d\'Endettement sur Actifs', value: debtToAssetRatio, benchmark: 0.3, status: debtToAssetRatio <= 0.3 ? 'good' : 'warning' },
    ];
  };

  const generateDiagnosticAlerts = (): DiagnosticAlert[] => {
    const alerts: DiagnosticAlert[] = [];
    const legacyOperatingCapital = convertOperatingCapitalToLegacy(data.operatingCapital);

    // Analyse de seuil de rentabilité (point mort)
    const fixedCosts = 50000; // Coûts fixes mensuels
    const variableCostPerUnit = 500; // Coût variable par unité
    const sellingPricePerUnit = 1000; // Prix de vente par unité
    const breakEvenPoint = fixedCosts / (sellingPricePerUnit - variableCostPerUnit);

    if (breakEvenPoint > 100) {
      alerts.push({
        id: 'high-break-even',
        category: 'Rentabilité',
        message: 'Seuil de rentabilité élevé',
        severity: 'warning',
        recommendation: 'Réduisez vos coûts fixes ou augmentez vos prix de vente'
      });
    }

    // Analyse de trésorerie
    const workingCapital = legacyOperatingCapital.workingCapital || 0;
    if (workingCapital < 10000) {
      alerts.push({
        id: 'low-cash',
        category: 'Trésorerie',
        message: 'Fonds de roulement faible',
        severity: 'warning',
        recommendation: 'Augmentez votre réserve de trésorerie pour faire face aux imprévus'
      });
    }

    // Analyse de marge
    const averageMargin = 0.4; // Marge moyenne sur les ventes
    if (averageMargin < 0.3) {
      alerts.push({
        id: 'low-margin',
        category: 'Rentabilité',
        message: 'Marge bénéficiaire faible',
        severity: 'warning',
        recommendation: 'Revoyez votre stratégie de prix ou réduisez vos coûts'
      });
    }

    // Analyse d'endettement
    const debtRatio = 0.6; // Ratio d'endettement
    if (debtRatio > 0.7) {
      alerts.push({
        id: 'high-debt',
        category: 'Endettement',
        message: 'Niveau d\'endettement élevé',
        severity: 'warning',
        recommendation: 'Réduisez votre endettement ou améliorez votre rentabilité'
      });
    }

    return alerts;
  };

  const financialRatios = generateFinancialRatios();
  const diagnosticAlerts = generateDiagnosticAlerts();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderPieChart = (data: { name: string; value: number }[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderBarChart = (data: FinancialRatio[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderAlerts = () => (
    <Card>
      <CardHeader>
        <CardTitle>Alertes et Recommandations</CardTitle>
      </CardHeader>
      <CardContent>
        {diagnosticAlerts.length === 0 ? (
          <p>Aucune alerte détectée. Votre entreprise semble en bonne santé financière.</p>
        ) : (
          <ul>
            {diagnosticAlerts.map((alert) => (
              <li key={alert.id} className="mb-4">
                <div className={`font-semibold ${alert.severity === 'error' ? 'text-red-500' : alert.severity === 'warning' ? 'text-orange-500' : 'text-blue-500'}`}>
                  {alert.message}
                </div>
                <p className="text-sm">
                  Recommandation: {alert.recommendation}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Outils de Diagnostic Financier</h2>
        <p className="text-gray-600">Analyse des ratios clés et alertes pour une gestion proactive</p>
      </div>

      {renderBarChart(financialRatios, 'Ratios Financiers Clés')}
      {renderAlerts()}
    </div>
  );
};

export default OutilsDiagnosticSection;
