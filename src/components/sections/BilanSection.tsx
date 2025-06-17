import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { convertOperatingCapitalToLegacy, convertFundingSourcesToLegacy } from '@/utils/dataAdapters';

const BilanSection = () => {
  const { data, calculations } = useFinancialData();

  const calculateBalanceSheet = () => {
    const results = [];
    
    // Convert arrays to legacy format for compatibility
    const legacyOperatingCapital = convertOperatingCapitalToLegacy(data.operatingCapital);
    const legacyFundingSources = convertFundingSourcesToLegacy(data.fundingSources);
    
    for (let year = 0; year <= 3; year++) {
      // ACTIF
      // Immobilisations nettes (moins amortissements cumulés)
      const accumulatedDepreciation = year * (calculations.totalFixedAssets * 0.05);
      const netFixedAssets = calculations.totalFixedAssets - accumulatedDepreciation;
      
      // Actif circulant
      const cash = year === 0 ? (legacyOperatingCapital.workingCapital || 25000) : 
                   50000 + (year * 30000); // Croissance de trésorerie
      
      const accountsReceivable = year === 0 ? 0 : 
        data.products?.reduce((total, product) => {
          const growthFactor = Math.pow(1.1, year - 1);
          const monthlyRevenue = product.unitsPerMonth * product.pricePerUnit * growthFactor;
          return total + (monthlyRevenue * 2); // 2 mois de CA en créances
        }, 0) || 0;
      
      const inventory = year === 0 ? (legacyOperatingCapital.inventory || 15000) :
        data.products?.reduce((total, product) => {
          const growthFactor = Math.pow(1.1, year - 1);
          return total + (product.unitsPerMonth * product.cogsPerUnit * growthFactor * 1.5);
        }, 0) || 15000;
      
      const totalCurrentAssets = cash + accountsReceivable + inventory;
      const totalAssets = netFixedAssets + totalCurrentAssets;
      
      // PASSIF
      // Dettes à court terme
      const accountsPayable = year === 0 ? 0 : 
        (data.operatingExpenses || []).reduce((total, expense) => {
          const growthFactor = Math.pow(1 + (expense.growthRate / 100), year - 1);
          return total + (expense.monthlyAmount * growthFactor * 1); // 1 mois de charges
        }, 0);
      
      const accruals = accountsPayable * 0.5; // Charges à payer
      const shortTermDebt = 15000; // Emprunts court terme
      const totalCurrentLiabilities = accountsPayable + accruals + shortTermDebt;
      
      // Dettes à long terme
      const initialLongTermDebt = calculations.totalFundingSources - legacyFundingSources.ownersEquityAmount;
      const longTermDebt = Math.max(0, initialLongTermDebt - (year * 12000)); // Remboursement annuel
      
      // Capitaux propres
      const initialEquity = legacyFundingSources.ownersEquityAmount || 100000;
      
      // Calcul du résultat cumulé
      let cumulativeEarnings = 0;
      for (let y = 1; y <= year; y++) {
        const yearlyRevenue = data.products?.reduce((total, product) => {
          const growthFactor = Math.pow(1.1, y - 1);
          return total + (product.unitsPerMonth * product.pricePerUnit * 12 * growthFactor);
        }, 0) || 0;
        
        const yearlyCosts = yearlyRevenue * 0.7; // Estimation 70% de charges
        const yearlyResult = (yearlyRevenue - yearlyCosts) * 0.72; // Après impôts
        cumulativeEarnings += yearlyResult;
      }
      
      const retainedEarnings = cumulativeEarnings;
      const totalEquity = initialEquity + retainedEarnings;
      
      const totalLiabilitiesAndEquity = totalCurrentLiabilities + longTermDebt + totalEquity;
      
      // Vérification équilibre
      const balanceCheck = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1000;
      
      results.push({
        year: year === 0 ? 'Ouverture' : `Année ${year}`,
        // Actif
        netFixedAssets,
        cash,
        accountsReceivable,
        inventory,
        totalCurrentAssets,
        totalAssets,
        // Passif
        accountsPayable,
        accruals,
        shortTermDebt,
        totalCurrentLiabilities,
        longTermDebt,
        initialEquity,
        retainedEarnings,
        totalEquity,
        totalLiabilitiesAndEquity,
        balanceCheck,
        // Ratios
        currentRatio: totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0,
        debtToEquity: totalEquity > 0 ? (totalCurrentLiabilities + longTermDebt) / totalEquity : 0,
        assetTurnover: year > 0 && totalAssets > 0 ? 
          (data.products?.reduce((total, product) => {
            const growthFactor = Math.pow(1.1, year - 1);
            return total + (product.unitsPerMonth * product.pricePerUnit * 12 * growthFactor);
          }, 0) || 0) / totalAssets : 0
      });
    }
    
    return results;
  };

  const balanceData = calculateBalanceSheet();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bilan Prévisionnel</h2>
        <p className="text-gray-600">Situation patrimoniale et équilibre financier sur 3 ans</p>
      </div>

      <div className="space-y-6">
        {balanceData.map((periodData, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Bilan - {periodData.year}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  periodData.balanceCheck ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {periodData.balanceCheck ? '✓ Équilibré' : '⚠ Déséquilibré'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ACTIF */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2">
                    ACTIF
                  </h3>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Immobilisations Nettes</h4>
                    <div className="flex justify-between pl-4">
                      <span>Immobilisations Corporelles</span>
                      <span className="font-medium">{formatCurrency(periodData.netFixedAssets)}</span>
                    </div>
                    
                    <h4 className="font-medium text-gray-700 pt-3">Actif Circulant</h4>
                    <div className="flex justify-between pl-4">
                      <span>Trésorerie</span>
                      <span className="font-medium">{formatCurrency(periodData.cash)}</span>
                    </div>
                    <div className="flex justify-between pl-4">
                      <span>Créances Clients</span>
                      <span className="font-medium">{formatCurrency(periodData.accountsReceivable)}</span>
                    </div>
                    <div className="flex justify-between pl-4">
                      <span>Stocks</span>
                      <span className="font-medium">{formatCurrency(periodData.inventory)}</span>
                    </div>
                    <div className="flex justify-between pl-4 font-semibold bg-blue-50 p-2 rounded">
                      <span>Total Actif Circulant</span>
                      <span>{formatCurrency(periodData.totalCurrentAssets)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg bg-blue-100 p-3 rounded border-t-2 border-blue-300">
                    <span>TOTAL ACTIF</span>
                    <span>{formatCurrency(periodData.totalAssets)}</span>
                  </div>
                </div>

                {/* PASSIF */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-900 border-b border-green-200 pb-2">
                    PASSIF
                  </h3>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Capitaux Propres</h4>
                    <div className="flex justify-between pl-4">
                      <span>Capital Social</span>
                      <span className="font-medium">{formatCurrency(periodData.initialEquity)}</span>
                    </div>
                    <div className="flex justify-between pl-4">
                      <span>Résultats Reportés</span>
                      <span className={`font-medium ${periodData.retainedEarnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(periodData.retainedEarnings)}
                      </span>
                    </div>
                    <div className="flex justify-between pl-4 font-semibold bg-green-50 p-2 rounded">
                      <span>Total Capitaux Propres</span>
                      <span>{formatCurrency(periodData.totalEquity)}</span>
                    </div>
                    
                    <h4 className="font-medium text-gray-700 pt-3">Dettes</h4>
                    <div className="flex justify-between pl-4">
                      <span>Emprunts Long Terme</span>
                      <span className="font-medium">{formatCurrency(periodData.longTermDebt)}</span>
                    </div>
                    <div className="flex justify-between pl-4">
                      <span>Dettes Fournisseurs</span>
                      <span className="font-medium">{formatCurrency(periodData.accountsPayable)}</span>
                    </div>
                    <div className="flex justify-between pl-4">
                      <span>Charges à Payer</span>
                      <span className="font-medium">{formatCurrency(periodData.accruals)}</span>
                    </div>
                    <div className="flex justify-between pl-4">
                      <span>Emprunts Court Terme</span>
                      <span className="font-medium">{formatCurrency(periodData.shortTermDebt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg bg-green-100 p-3 rounded border-t-2 border-green-300">
                    <span>TOTAL PASSIF</span>
                    <span>{formatCurrency(periodData.totalLiabilitiesAndEquity)}</span>
                  </div>
                </div>
              </div>

              {/* Ratios financiers */}
              {periodData.year !== 'Ouverture' && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Ratios Financiers</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="text-sm text-gray-600">Ratio de Liquidité</div>
                      <div className="font-bold text-blue-600">
                        {periodData.currentRatio.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded">
                      <div className="text-sm text-gray-600">Endettement / Fonds Propres</div>
                      <div className="font-bold text-orange-600">
                        {periodData.debtToEquity.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="text-sm text-gray-600">Rotation des Actifs</div>
                      <div className="font-bold text-purple-600">
                        {periodData.assetTurnover.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution des Indicateurs Clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <h4 className="font-semibold text-blue-900">Actif Total Année 3</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(balanceData[3]?.totalAssets || 0)}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <h4 className="font-semibold text-green-900">Capitaux Propres Année 3</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(balanceData[3]?.totalEquity || 0)}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <h4 className="font-semibold text-purple-900">Trésorerie Année 3</h4>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(balanceData[3]?.cash || 0)}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <h4 className="font-semibold text-orange-900">Endettement Net Année 3</h4>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency((balanceData[3]?.longTermDebt + balanceData[3]?.totalCurrentLiabilities - balanceData[3]?.cash) || 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BilanSection;
