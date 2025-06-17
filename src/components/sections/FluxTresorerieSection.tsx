import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { convertOperatingCapitalToLegacy } from '@/utils/dataAdapters';

const FluxTresorerieSection = () => {
  const { data, calculations } = useFinancialData();

  // Calcul des flux de trésorerie mensuels
  const calculateCashFlow = () => {
    const cashFlowData = [];
    const legacyOperatingCapital = convertOperatingCapitalToLegacy(data.operatingCapital);
    let cumulativeCash = legacyOperatingCapital.workingCapital || 25000;
    
    for (let month = 1; month <= 36; month++) {
      const year = Math.ceil(month / 12);
      
      // Calcul des encaissements (ventes)
      const monthlyRevenue = data.products?.reduce((total, product) => {
        const growthFactor = Math.pow(1.1, year - 1); // 10% de croissance par an
        return total + (product.unitsPerMonth * product.pricePerUnit * growthFactor);
      }, 0) || 0;
      
      // Répartition selon conditions de paiement
      const cashSales = monthlyRevenue * 0.4; // 40% comptant
      const net30 = month > 1 ? monthlyRevenue * 0.4 * 0.95 : 0; // 40% à 30j (5% d'impayés)
      const net60 = month > 2 ? monthlyRevenue * 0.15 * 0.9 : 0; // 15% à 60j (10% d'impayés)
      const collections = cashSales + net30 + net60;
      
      // Calcul des décaissements
      const monthlyCOGS = data.products?.reduce((total, product) => {
        const growthFactor = Math.pow(1.1, year - 1);
        return total + (product.unitsPerMonth * product.cogsPerUnit * growthFactor);
      }, 0) || 0;
      
      const monthlyOperatingExpenses = (data.operatingExpenses || [])
        .reduce((total, expense) => {
          const growthFactor = Math.pow(1 + (expense.growthRate / 100), year - 1);
          return total + (expense.monthlyAmount * growthFactor);
        }, 0);
      
      const monthlyPayroll = 15000 * Math.pow(1.03, year - 1); // Masse salariale avec 3% de croissance
      
      const totalPayments = monthlyCOGS + monthlyOperatingExpenses + monthlyPayroll;
      
      const netCashFlow = collections - totalPayments;
      cumulativeCash += netCashFlow;
      
      // Gestion ligne de crédit
      const creditLineUsed = cumulativeCash < 0 ? Math.abs(cumulativeCash) : 0;
      const availableCash = Math.max(0, cumulativeCash);
      
      cashFlowData.push({
        month,
        year,
        collections,
        payments: totalPayments,
        netCashFlow,
        cumulativeCash: availableCash,
        creditLineUsed,
        monthName: `${year}-${(month - 1) % 12 + 1}`
      });
    }
    
    return cashFlowData;
  };

  const cashFlowData = calculateCashFlow();
  const chartData = cashFlowData.filter((_, index) => index % 3 === 0); // Afficher tous les 3 mois

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Flux de Trésorerie</h2>
        <p className="text-gray-600">Analyse des encaissements, décaissements et position de trésorerie</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution de la Trésorerie sur 3 ans</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cumulativeCash" 
                stroke="#2563eb" 
                name="Trésorerie Disponible"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="creditLineUsed" 
                stroke="#dc2626" 
                name="Ligne de Crédit Utilisée"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Résumé Année 1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Encaissements:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(cashFlowData.slice(0, 12).reduce((sum, item) => sum + item.collections, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Décaissements:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(cashFlowData.slice(0, 12).reduce((sum, item) => sum + item.payments, 0))}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Flux Net Année 1:</span>
                <span className={`font-bold ${cashFlowData.slice(0, 12).reduce((sum, item) => sum + item.netCashFlow, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(cashFlowData.slice(0, 12).reduce((sum, item) => sum + item.netCashFlow, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicateurs Clés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Trésorerie Minimale:</span>
                <span className="font-semibold">
                  {formatCurrency(Math.min(...cashFlowData.map(item => item.cumulativeCash)))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ligne de Crédit Max Utilisée:</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(Math.max(...cashFlowData.map(item => item.creditLineUsed)))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trésorerie Fin Année 3:</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(cashFlowData[35]?.cumulativeCash || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flux Mensuels Détaillés - Année 1</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Mois</th>
                  <th className="text-right p-2">Encaissements</th>
                  <th className="text-right p-2">Décaissements</th>
                  <th className="text-right p-2">Flux Net</th>
                  <th className="text-right p-2">Trésorerie</th>
                  <th className="text-right p-2">Crédit Utilisé</th>
                </tr>
              </thead>
              <tbody>
                {cashFlowData.slice(0, 12).map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.monthName}</td>
                    <td className="text-right p-2 text-green-600">{formatCurrency(item.collections)}</td>
                    <td className="text-right p-2 text-red-600">{formatCurrency(item.payments)}</td>
                    <td className={`text-right p-2 ${item.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(item.netCashFlow)}
                    </td>
                    <td className="text-right p-2 font-medium">{formatCurrency(item.cumulativeCash)}</td>
                    <td className="text-right p-2 text-orange-600">{formatCurrency(item.creditLineUsed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FluxTresorerieSection;
