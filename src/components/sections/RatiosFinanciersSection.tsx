
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/formatting';

const RatiosFinanciersSection = () => {
  const { data, calculations } = useFinancialData();

  const calculateRatios = () => {
    const results = [];
    
    for (let year = 1; year <= 3; year++) {
      // Données de base
      const revenue = data.products?.reduce((total, product) => {
        const growthFactor = Math.pow(1.1, year - 1);
        return total + (product.unitsPerMonth * product.pricePerUnit * 12 * growthFactor);
      }, 0) || 0;

      const cogs = data.products?.reduce((total, product) => {
        const growthFactor = Math.pow(1.1, year - 1);
        return total + (product.unitsPerMonth * product.cogsPerUnit * 12 * growthFactor);
      }, 0) || 0;

      const grossProfit = revenue - cogs;
      const netIncome = grossProfit * 0.15; // Estimation 15% de marge nette

      // Données du bilan
      const totalAssets = calculations.totalFixedAssets * 0.9 + 100000 + (year * 50000);
      const totalEquity = calculations.totalFundingSources * 0.6 + (netIncome * year);
      const currentAssets = 80000 + (year * 30000);
      const currentLiabilities = 40000 + (year * 15000);
      const inventory = 15000 + (year * 5000);

      // RATIOS DE LIQUIDITÉ
      const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
      const quickRatio = currentLiabilities > 0 ? (currentAssets - inventory) / currentLiabilities : 0;
      
      // RATIOS D'ENDETTEMENT
      const totalDebt = calculations.totalFundingSources - data.fundingSources.ownersEquityAmount;
      const debtToEquity = totalEquity > 0 ? totalDebt / totalEquity : 0;
      const debtToAssets = totalAssets > 0 ? totalDebt / totalAssets : 0;
      const debtServiceCoverage = grossProfit > 0 ? grossProfit / (calculations.monthlyLoanPayments.commercial * 12) : 0;

      // RATIOS DE RENTABILITÉ
      const revenueGrowth = year > 1 ? 0.1 : 0; // 10% de croissance
      const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
      const netMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
      const roe = totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0;
      const roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;

      // RATIOS D'EFFICACITÉ
      const daysReceivable = revenue > 0 ? (currentAssets * 0.3) / (revenue / 365) : 0; // 30% des actifs circulants = créances
      const inventoryTurnover = cogs > 0 ? cogs / inventory : 0;
      const assetTurnover = totalAssets > 0 ? revenue / totalAssets : 0;

      results.push({
        year,
        revenue,
        netIncome,
        totalAssets,
        totalEquity,
        currentAssets,
        currentLiabilities,
        inventory,
        // Liquidité
        currentRatio,
        quickRatio,
        // Endettement
        debtToEquity,
        debtToAssets,
        debtServiceCoverage,
        // Rentabilité
        revenueGrowth,
        grossMargin,
        netMargin,
        roe,
        roa,
        // Efficacité
        daysReceivable,
        inventoryTurnover,
        assetTurnover
      });
    }
    
    return results;
  };

  const ratiosData = calculateRatios();

  const benchmarks = {
    currentRatio: { good: 2.0, warning: 1.5 },
    quickRatio: { good: 1.0, warning: 0.8 },
    debtToEquity: { good: 0.5, warning: 1.0 },
    grossMargin: { good: 40, warning: 25 },
    netMargin: { good: 10, warning: 5 },
    roe: { good: 15, warning: 10 },
    roa: { good: 8, warning: 5 },
    assetTurnover: { good: 1.5, warning: 1.0 }
  };

  const getRatioStatus = (value: number, ratio: string) => {
    const benchmark = benchmarks[ratio as keyof typeof benchmarks];
    if (!benchmark) return 'neutral';
    
    if (ratio === 'debtToEquity') {
      return value <= benchmark.good ? 'good' : value <= benchmark.warning ? 'warning' : 'danger';
    } else {
      return value >= benchmark.good ? 'good' : value >= benchmark.warning ? 'warning' : 'danger';
    }
  };

  const chartData = ratiosData.map(data => ({
    year: `Année ${data.year}`,
    "Ratio de Liquidité": data.currentRatio,
    "Marge Brute (%)": data.grossMargin,
    "Marge Nette (%)": data.netMargin,
    "ROE (%)": data.roe,
    "Rotation Actifs": data.assetTurnover
  }));

  const radarData = [
    { ratio: 'Liquidité', value: ratiosData[2]?.currentRatio * 50 || 0, fullMark: 150 },
    { ratio: 'Solvabilité', value: (2 - (ratiosData[2]?.debtToEquity || 0)) * 50, fullMark: 100 },
    { ratio: 'Rentabilité', value: ratiosData[2]?.roe || 0, fullMark: 25 },
    { ratio: 'Efficacité', value: ratiosData[2]?.assetTurnover * 50 || 0, fullMark: 100 },
    { ratio: 'Croissance', value: (ratiosData[2]?.revenueGrowth || 0) * 500, fullMark: 100 },
    { ratio: 'Marge', value: ratiosData[2]?.grossMargin || 0, fullMark: 60 }
  ];

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'good': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'warning': return <Minus className="h-4 w-4 text-orange-500" />;
      case 'danger': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ratios Financiers</h2>
        <p className="text-gray-600">Analyse de la performance et de la santé financière</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Ratios Clés</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Ratio de Liquidité" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="Marge Brute (%)" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="ROE (%)" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Globale - Année 3</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="ratio" />
                <PolarRadiusAxis />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ratios de Liquidité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratiosData.map((yearData) => (
              <div key={yearData.year} className="border-b pb-3 last:border-b-0">
                <h4 className="font-medium text-gray-700 mb-2">Année {yearData.year}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Ratio de Liquidité:</span>
                    <div className="flex items-center gap-1">
                      <StatusIcon status={getRatioStatus(yearData.currentRatio, 'currentRatio')} />
                      <span className="font-medium">{formatNumber(yearData.currentRatio)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ratio de Liquidité Réduite:</span>
                    <div className="flex items-center gap-1">
                      <StatusIcon status={getRatioStatus(yearData.quickRatio, 'quickRatio')} />
                      <span className="font-medium">{formatNumber(yearData.quickRatio)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ratios d'Endettement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratiosData.map((yearData) => (
              <div key={yearData.year} className="border-b pb-3 last:border-b-0">
                <h4 className="font-medium text-gray-700 mb-2">Année {yearData.year}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Dette/Capitaux Propres:</span>
                    <div className="flex items-center gap-1">
                      <StatusIcon status={getRatioStatus(yearData.debtToEquity, 'debtToEquity')} />
                      <span className="font-medium">{formatNumber(yearData.debtToEquity)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Couverture Service Dette:</span>
                    <div className="flex items-center gap-1">
                      <StatusIcon status={yearData.debtServiceCoverage > 1.5 ? 'good' : 'warning'} />
                      <span className="font-medium">{formatNumber(yearData.debtServiceCoverage)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ratios de Rentabilité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratiosData.map((yearData) => (
              <div key={yearData.year} className="border-b pb-3 last:border-b-0">
                <h4 className="font-medium text-gray-700 mb-2">Année {yearData.year}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Marge Brute:</span>
                    <div className="flex items-center gap-1">
                      <StatusIcon status={getRatioStatus(yearData.grossMargin, 'grossMargin')} />
                      <span className="font-medium">{formatPercentage(yearData.grossMargin)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ROE:</span>
                    <div className="flex items-center gap-1">
                      <StatusIcon status={getRatioStatus(yearData.roe, 'roe')} />
                      <span className="font-medium">{formatPercentage(yearData.roe)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ROA:</span>
                    <div className="flex items-center gap-1">
                      <StatusIcon status={getRatioStatus(yearData.roa, 'roa')} />
                      <span className="font-medium">{formatPercentage(yearData.roa)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ratios d'Efficacité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratiosData.map((yearData) => (
              <div key={yearData.year} className="border-b pb-3 last:border-b-0">
                <h4 className="font-medium text-gray-700 mb-2">Année {yearData.year}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Délai Recouvrement:</span>
                    <span className="font-medium">{Math.round(yearData.daysReceivable)} jours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rotation Stocks:</span>
                    <span className="font-medium">{formatNumber(yearData.inventoryTurnover)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rotation Actifs:</span>
                    <div className="flex items-center gap-1">
                      <StatusIcon status={getRatioStatus(yearData.assetTurnover, 'assetTurnover')} />
                      <span className="font-medium">{formatNumber(yearData.assetTurnover)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benchmarks et Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Benchmarks Sectoriels</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Ratio de Liquidité:</span>
                  <span>≥ 2.0 (Bon) | ≥ 1.5 (Acceptable)</span>
                </div>
                <div className="flex justify-between">
                  <span>Dette/Capitaux Propres:</span>
                  <span>≤ 0.5 (Bon) | ≤ 1.0 (Acceptable)</span>
                </div>
                <div className="flex justify-between">
                  <span>Marge Brute:</span>
                  <span>≥ 40% (Bon) | ≥ 25% (Acceptable)</span>
                </div>
                <div className="flex justify-between">
                  <span>ROE:</span>
                  <span>≥ 15% (Bon) | ≥ 10% (Acceptable)</span>
                </div>
                <div className="flex justify-between">
                  <span>Rotation Actifs:</span>
                  <span>≥ 1.5 (Bon) | ≥ 1.0 (Acceptable)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Points d'Amélioration</h4>
              <div className="space-y-2 text-sm">
                {ratiosData[2]?.currentRatio < 1.5 && (
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">⚠</span>
                    <span>Améliorer la liquidité en réduisant les stocks ou augmentant la trésorerie</span>
                  </div>
                )}
                {ratiosData[2]?.debtToEquity > 1.0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">⚠</span>
                    <span>Réduire l'endettement ou renforcer les capitaux propres</span>
                  </div>
                )}
                {ratiosData[2]?.grossMargin < 25 && (
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500">⚠</span>
                    <span>Améliorer la marge brute en optimisant les coûts ou prix de vente</span>
                  </div>
                )}
                {ratiosData[2]?.assetTurnover < 1.0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500">⚠</span>
                    <span>Optimiser l'utilisation des actifs pour générer plus de revenus</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatiosFinanciersSection;
