
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency, formatPercentage } from '@/utils/formatting';

const CompteResultatSection = () => {
  const { data } = useFinancialData();

  const calculateIncomeStatement = () => {
    const results = [];
    
    for (let year = 1; year <= 3; year++) {
      // Calcul du chiffre d'affaires
      const revenue = data.products?.reduce((total, product) => {
        const growthFactor = Math.pow(1.1, year - 1); // 10% de croissance par an
        return total + (product.unitsPerMonth * product.pricePerUnit * 12 * growthFactor);
      }, 0) || 0;

      // Calcul du coût des ventes
      const cogs = data.products?.reduce((total, product) => {
        const growthFactor = Math.pow(1.1, year - 1);
        return total + (product.unitsPerMonth * product.cogsPerUnit * 12 * growthFactor);
      }, 0) || 0;

      const grossProfit = revenue - cogs;
      const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

      // Charges d'exploitation
      const operatingExpenses = (data.operatingExpenses || [])
        .filter(expense => !expense.isAutoCalculated)
        .reduce((total, expense) => {
          const growthFactor = Math.pow(1 + (expense.growthRate / 100), year - 1);
          return total + (expense.monthlyAmount * 12 * growthFactor);
        }, 0);

      // Masse salariale
      const payroll = 15000 * 12 * Math.pow(1.03, year - 1);

      // Amortissements (5% des immobilisations)
      const depreciation = data.calculations?.totalFixedAssets * 0.05 || 0;

      // Intérêts
      const interests = (data.calculations?.monthlyLoanPayments?.commercial || 0) * 12 * 0.3; // 30% des paiements = intérêts

      const totalOperatingCosts = operatingExpenses + payroll + depreciation + interests;
      const ebitda = grossProfit - operatingExpenses - payroll;
      const ebit = ebitda - depreciation;
      const ebt = ebit - interests;

      // Impôts (28% du bénéfice avant impôt)
      const taxes = ebt > 0 ? ebt * 0.28 : 0;
      const netIncome = ebt - taxes;

      const netMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;

      results.push({
        year,
        revenue,
        cogs,
        grossProfit,
        grossMargin,
        operatingExpenses,
        payroll,
        depreciation,
        interests,
        ebitda,
        ebit,
        ebt,
        taxes,
        netIncome,
        netMargin
      });
    }
    
    return results;
  };

  const incomeData = calculateIncomeStatement();

  const chartData = incomeData.map(data => ({
    year: `Année ${data.year}`,
    "Chiffre d'Affaires": data.revenue,
    "Coût des Ventes": data.cogs,
    "Charges d'Exploitation": data.operatingExpenses + data.payroll,
    "Résultat Net": data.netIncome
  }));

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Compte de Résultat Prévisionnel</h2>
        <p className="text-gray-600">Analyse de la rentabilité sur 3 ans</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution des Résultats</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="Chiffre d'Affaires" fill="#2563eb" />
              <Bar dataKey="Coût des Ventes" fill="#dc2626" />
              <Bar dataKey="Charges d'Exploitation" fill="#f59e0b" />
              <Bar dataKey="Résultat Net" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {incomeData.map((yearData) => (
          <Card key={yearData.year}>
            <CardHeader>
              <CardTitle>Compte de Résultat - Année {yearData.year}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">PRODUITS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chiffre d'Affaires</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(yearData.revenue)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-2 mt-4">
                      <span className="font-semibold">CHARGES</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coût des Ventes</span>
                      <span className="text-red-600">
                        {formatCurrency(yearData.cogs)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold bg-green-50 p-2 rounded">
                      <span>Marge Brute</span>
                      <span className="text-green-600">
                        {formatCurrency(yearData.grossProfit)} ({formatPercentage(yearData.grossMargin)})
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Charges d'Exploitation</span>
                      <span className="text-red-600">
                        {formatCurrency(yearData.operatingExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Masse Salariale</span>
                      <span className="text-red-600">
                        {formatCurrency(yearData.payroll)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between font-semibold bg-blue-50 p-2 rounded">
                      <span>EBITDA</span>
                      <span className="text-blue-600">
                        {formatCurrency(yearData.ebitda)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Amortissements</span>
                      <span className="text-red-600">
                        {formatCurrency(yearData.depreciation)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold bg-blue-50 p-2 rounded">
                      <span>EBIT</span>
                      <span className="text-blue-600">
                        {formatCurrency(yearData.ebit)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Charges Financières</span>
                      <span className="text-red-600">
                        {formatCurrency(yearData.interests)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Résultat Avant Impôt</span>
                      <span className={yearData.ebt >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(yearData.ebt)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Impôts sur Sociétés (28%)</span>
                      <span className="text-red-600">
                        {formatCurrency(yearData.taxes)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold bg-gray-100 p-3 rounded border-t-2">
                      <span>RÉSULTAT NET</span>
                      <span className={yearData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(yearData.netIncome)} ({formatPercentage(yearData.netMargin)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Résumé sur 3 ans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 text-center">
            {incomeData.map((yearData) => (
              <div key={yearData.year} className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Année {yearData.year}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">CA: </span>
                    <span className="font-semibold">{formatCurrency(yearData.revenue)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Marge Brute: </span>
                    <span className="font-semibold">{formatPercentage(yearData.grossMargin)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Résultat Net: </span>
                    <span className={`font-bold ${yearData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(yearData.netIncome)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Marge Nette: </span>
                    <span className="font-semibold">{formatPercentage(yearData.netMargin)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompteResultatSection;
