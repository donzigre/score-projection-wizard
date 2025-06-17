
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useParcelles } from '@/contexts/ParcellesContext';
import { formatCurrency } from '@/utils/formatting';
import { convertOperatingCapitalToLegacy } from '@/utils/dataAdapters';

const FluxTresorerieAgricoleSection = () => {
  const { data, calculations, calculateProductRevenue } = useFinancialData();
  const { parcelles } = useParcelles();

  // Calcul des flux de trésorerie agricoles par cycles
  const calculateAgriculturalCashFlow = () => {
    const cashFlowData = [];
    const legacyOperatingCapital = convertOperatingCapitalToLegacy(data.operatingCapital);
    let cumulativeCash = legacyOperatingCapital.workingCapital || 25000;
    
    // Obtenir les produits avec parcelles assignées
    const activeProducts = data.products.filter(p => p.parcelleId);

    for (let month = 1; month <= 36; month++) {
      const year = Math.ceil(month / 12);
      let monthlyRevenue = 0;
      let monthlyCosts = 0;
      
      // Calculer les revenus basés sur les cycles de récolte
      activeProducts.forEach(product => {
        const parcelle = parcelles.find(p => p.id === product.parcelleId);
        if (!parcelle) return;

        const cycleMonths = product.cycleMonths || 3;
        const periodeRepos = product.periodeRepos || 0;
        const totalCycleTime = cycleMonths + periodeRepos;
        
        // Vérifier si c'est un mois de récolte
        const isHarvestMonth = month % totalCycleTime === 0;
        
        if (isHarvestMonth) {
          const rendement = product.rendementReel || product.rendementEstime || 0;
          const revenueRecolte = rendement * parcelle.surface * product.pricePerUnit;
          monthlyRevenue += revenueRecolte;
        }

        // Coûts répartis sur la durée du cycle
        const coutsMensuels = (parcelle.coutsPrepration + parcelle.coutsIntrants + 
                              parcelle.coutsMainOeuvre + parcelle.autresCouts) / cycleMonths;
        
        // Ajouter les coûts pendant les mois de production
        if (month % totalCycleTime <= cycleMonths) {
          monthlyCosts += coutsMensuels;
        }
      });

      // Autres charges d'exploitation
      const monthlyOperatingExpenses = (data.operatingExpenses || [])
        .reduce((total, expense) => {
          const growthFactor = Math.pow(1 + (expense.growthRate / 100), year - 1);
          return total + (expense.monthlyAmount * growthFactor);
        }, 0);

      const monthlyPayroll = calculations.totalMonthlySalaries + calculations.totalMonthlyCharges;
      
      const totalExpenses = monthlyCosts + monthlyOperatingExpenses + monthlyPayroll;
      const netCashFlow = monthlyRevenue - totalExpenses;
      cumulativeCash += netCashFlow;
      
      // Gestion ligne de crédit
      const creditLineUsed = cumulativeCash < 0 ? Math.abs(cumulativeCash) : 0;
      const availableCash = Math.max(0, cumulativeCash);
      
      cashFlowData.push({
        month,
        year,
        monthName: `${year}-${(month - 1) % 12 + 1}`,
        revenue: monthlyRevenue,
        costs: monthlyCosts,
        operatingExpenses: monthlyOperatingExpenses + monthlyPayroll,
        totalExpenses,
        netCashFlow,
        cumulativeCash: availableCash,
        creditLineUsed,
        isHarvestMonth: monthlyRevenue > 0
      });
    }
    
    return cashFlowData;
  };

  // Calculer les cycles de production par culture
  const calculateProductionCycles = () => {
    const activeProducts = data.products.filter(p => p.parcelleId);
    
    return activeProducts.map(product => {
      const parcelle = parcelles.find(p => p.id === product.parcelleId);
      if (!parcelle) return null;

      const cycleMonths = product.cycleMonths || 3;
      const periodeRepos = product.periodeRepos || 0;
      const cyclesParAn = Math.floor(12 / (cycleMonths + periodeRepos));
      const rendement = product.rendementReel || product.rendementEstime || 0;
      const revenueParCycle = rendement * parcelle.surface * product.pricePerUnit;
      const revenueAnnuel = revenueParCycle * cyclesParAn;

      return {
        culture: product.name,
        parcelle: parcelle.nom,
        surface: parcelle.surface,
        cycleMonths,
        cyclesParAn,
        rendement,
        revenueParCycle,
        revenueAnnuel
      };
    }).filter(Boolean);
  };

  const cashFlowData = calculateAgriculturalCashFlow();
  const productionCycles = calculateProductionCycles();
  const chartData = cashFlowData.filter((_, index) => index % 3 === 0); // Afficher tous les 3 mois

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Flux de Trésorerie Agricole</h2>
        <p className="text-gray-600">Analyse des flux basée sur les cycles de production réels</p>
      </div>

      {/* Cycles de production */}
      <Card>
        <CardHeader>
          <CardTitle>Cycles de Production par Culture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {productionCycles.map((cycle, index) => (
              <div key={index} className="bg-green-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Culture</Label>
                    <p className="font-medium">{cycle.culture}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Cycle</Label>
                    <p className="font-medium">{cycle.cycleMonths} mois ({cycle.cyclesParAn} cycles/an)</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Revenue/cycle</Label>
                    <p className="font-medium text-green-600">{formatCurrency(cycle.revenueParCycle)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Revenue annuel</Label>
                    <p className="font-medium text-green-600">{formatCurrency(cycle.revenueAnnuel)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphique des flux de trésorerie */}
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
                dataKey="revenue" 
                stroke="#16a34a" 
                name="Revenus (Récoltes)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="totalExpenses" 
                stroke="#dc2626" 
                name="Dépenses Totales"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenus par mois de récolte */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus par Période de Récolte - Année 1</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData.slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="revenue" fill="#16a34a" name="Revenus de Récolte" />
              <Bar dataKey="costs" fill="#f59e0b" name="Coûts de Production" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tableau détaillé année 1 */}
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
                  <th className="text-right p-2">Revenus Récolte</th>
                  <th className="text-right p-2">Coûts Production</th>
                  <th className="text-right p-2">Charges Exploitation</th>
                  <th className="text-right p-2">Flux Net</th>
                  <th className="text-right p-2">Trésorerie</th>
                </tr>
              </thead>
              <tbody>
                {cashFlowData.slice(0, 12).map((item, index) => (
                  <tr key={index} className={`border-b ${item.isHarvestMonth ? 'bg-green-50' : ''}`}>
                    <td className="p-2">
                      {item.monthName}
                      {item.isHarvestMonth && <span className="ml-2 text-green-600">🌾</span>}
                    </td>
                    <td className="text-right p-2 text-green-600">{formatCurrency(item.revenue)}</td>
                    <td className="text-right p-2 text-orange-600">{formatCurrency(item.costs)}</td>
                    <td className="text-right p-2 text-red-600">{formatCurrency(item.operatingExpenses)}</td>
                    <td className={`text-right p-2 ${item.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(item.netCashFlow)}
                    </td>
                    <td className="text-right p-2 font-medium">{formatCurrency(item.cumulativeCash)}</td>
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

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

export default FluxTresorerieAgricoleSection;
