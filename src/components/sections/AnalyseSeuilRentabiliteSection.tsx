
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency, formatPercentage } from '@/utils/formatting';

const AnalyseSeuilRentabiliteSection = () => {
  const { data } = useFinancialData();

  const calculateBreakeven = () => {
    // Calcul de la marge brute moyenne
    const totalRevenue = data.products?.reduce((total, product) => {
      return total + (product.unitsPerMonth * product.pricePerUnit * 12);
    }, 0) || 0;

    const totalCOGS = data.products?.reduce((total, product) => {
      return total + (product.unitsPerMonth * product.cogsPerUnit * 12);
    }, 0) || 0;

    const grossMarginRate = totalRevenue > 0 ? (totalRevenue - totalCOGS) / totalRevenue : 0;

    // Calcul des charges fixes
    const annualPayroll = 15000 * 12; // Masse salariale annuelle

    const annualOperatingExpenses = (data.operatingExpenses || [])
      .filter(expense => !expense.isAutoCalculated)
      .reduce((total, expense) => {
        return total + (expense.monthlyAmount * 12);
      }, 0);

    const totalFixedCosts = annualPayroll + annualOperatingExpenses;

    // Calcul du seuil de rentabilité
    const breakevenRevenue = grossMarginRate > 0 ? totalFixedCosts / grossMarginRate : 0;
    const monthlyBreakeven = breakevenRevenue / 12;

    // Calcul par produit
    const productBreakeven = data.products?.map(product => {
      const unitMargin = product.pricePerUnit - product.cogsPerUnit;
      const unitMarginRate = product.pricePerUnit > 0 ? unitMargin / product.pricePerUnit : 0;
      const productShare = totalRevenue > 0 ? 
        (product.unitsPerMonth * product.pricePerUnit * 12) / totalRevenue : 0;
      
      const allocatedFixedCosts = totalFixedCosts * productShare;
      const breakevenUnits = unitMargin > 0 ? allocatedFixedCosts / unitMargin : 0;
      const currentUnits = product.unitsPerMonth * 12;
      const surplus = currentUnits - breakevenUnits;

      return {
        name: product.name,
        currentUnits,
        breakevenUnits,
        surplus,
        unitMargin,
        unitMarginRate,
        currentRevenue: product.unitsPerMonth * product.pricePerUnit * 12,
        breakevenRevenue: breakevenUnits * product.pricePerUnit
      };
    }) || [];

    // Marge de sécurité
    const safetyMargin = totalRevenue > 0 ? (totalRevenue - breakevenRevenue) / totalRevenue : 0;
    const safetyMarginAmount = totalRevenue - breakevenRevenue;

    return {
      grossMarginRate,
      totalFixedCosts,
      breakevenRevenue,
      monthlyBreakeven,
      currentRevenue: totalRevenue,
      safetyMargin,
      safetyMarginAmount,
      productBreakeven
    };
  };

  const breakevenData = calculateBreakeven();

  const pieData = [
    { name: 'Coûts Variables', value: breakevenData.currentRevenue * (1 - breakevenData.grossMarginRate), color: '#ef4444' },
    { name: 'Charges Fixes', value: breakevenData.totalFixedCosts, color: '#f97316' },
    { name: 'Bénéfice', value: breakevenData.safetyMarginAmount, color: '#22c55e' }
  ];

  const COLORS = ['#ef4444', '#f97316', '#22c55e'];

  const chartData = breakevenData.productBreakeven.map(product => ({
    name: product.name,
    "Ventes Actuelles": product.currentUnits,
    "Seuil Rentabilité": product.breakevenUnits,
    "Excédent": Math.max(0, product.surplus)
  }));

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyse du Seuil de Rentabilité</h2>
        <p className="text-gray-600">Détermination du point d'équilibre et de la marge de sécurité</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calculs du Seuil de Rentabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Données de Base</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Chiffre d'Affaires Annuel:</span>
                    <span className="font-medium">{formatCurrency(breakevenData.currentRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux de Marge Brute:</span>
                    <span className="font-medium">{formatPercentage(breakevenData.grossMarginRate * 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Charges Fixes Totales:</span>
                    <span className="font-medium">{formatCurrency(breakevenData.totalFixedCosts)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Seuil de Rentabilité</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CA au Seuil (Annuel):</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(breakevenData.breakevenRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CA au Seuil (Mensuel):</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(breakevenData.monthlyBreakeven)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Marge de Sécurité</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Marge de Sécurité (%):</span>
                    <span className={`font-bold ${breakevenData.safetyMargin >= 0.2 ? 'text-green-600' : 'text-orange-600'}`}>
                      {formatPercentage(breakevenData.safetyMargin * 100)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marge de Sécurité (€):</span>
                    <span className={`font-bold ${breakevenData.safetyMarginAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(breakevenData.safetyMarginAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Coûts</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seuil de Rentabilité par Produit</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Ventes Actuelles" fill="#2563eb" />
              <Bar dataKey="Seuil Rentabilité" fill="#dc2626" />
              <Bar dataKey="Excédent" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyse Détaillée par Produit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Produit</th>
                  <th className="text-right p-2">Marge Unitaire</th>
                  <th className="text-right p-2">Taux Marge</th>
                  <th className="text-right p-2">Ventes Actuelles</th>
                  <th className="text-right p-2">Seuil (unités)</th>
                  <th className="text-right p-2">Excédent</th>
                  <th className="text-right p-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {breakevenData.productBreakeven.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{product.name}</td>
                    <td className="text-right p-2">{formatCurrency(product.unitMargin)}</td>
                    <td className="text-right p-2">{formatPercentage(product.unitMarginRate * 100)}</td>
                    <td className="text-right p-2">{Math.round(product.currentUnits)}</td>
                    <td className="text-right p-2">{Math.round(product.breakevenUnits)}</td>
                    <td className={`text-right p-2 ${product.surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.round(product.surplus)}
                    </td>
                    <td className="text-right p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.surplus >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.surplus >= 0 ? 'Rentable' : 'Déficitaire'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Points Forts</h4>
              <ul className="space-y-2 text-sm">
                {breakevenData.safetyMargin > 0.2 && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Marge de sécurité confortable ({formatPercentage(breakevenData.safetyMargin * 100)})</span>
                  </li>
                )}
                {breakevenData.grossMarginRate > 0.3 && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Taux de marge brute élevé ({formatPercentage(breakevenData.grossMarginRate * 100)})</span>
                  </li>
                )}
                {breakevenData.productBreakeven.filter(p => p.surplus > 0).length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Produits rentables identifiés</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Points d'Attention</h4>
              <ul className="space-y-2 text-sm">
                {breakevenData.safetyMargin < 0.1 && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">⚠</span>
                    <span>Marge de sécurité faible - risque élevé</span>
                  </li>
                )}
                {breakevenData.grossMarginRate < 0.2 && (
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">⚠</span>
                    <span>Marge brute insuffisante</span>
                  </li>
                )}
                {breakevenData.productBreakeven.filter(p => p.surplus < 0).length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">⚠</span>
                    <span>Certains produits sont déficitaires</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyseSeuilRentabiliteSection;
