
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { convertFixedAssetsToLegacy, convertOperatingCapitalToLegacy, convertFundingSourcesToLegacy } from '@/utils/dataAdapters';

const StartingPointSection = () => {
  const { data, updateFixedAssets, updateOperatingCapital, updateFundingSources, calculations } = useFinancialData();

  // Convertir les données pour la compatibilité
  const legacyFixedAssets = convertFixedAssetsToLegacy(data.fixedAssets);
  const legacyOperatingCapital = convertOperatingCapitalToLegacy(data.operatingCapital);
  const legacyFundingSources = convertFundingSourcesToLegacy(data.fundingSources);

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder = "0", 
    isCalculated = false 
  }: {
    label: string;
    value: number;
    onChange?: (value: number) => void;
    placeholder?: string;
    isCalculated?: boolean;
  }) => (
    <div>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Input
        type="number"
        value={value || ''}
        onChange={(e) => onChange?.(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        disabled={isCalculated}
        className={`mt-1 ${isCalculated 
          ? 'bg-gray-100 text-gray-700 font-medium' 
          : 'bg-blue-50 border-blue-200 focus:border-blue-500'
        }`}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Starting Point - Funding & Assets</h2>
        <p className="text-gray-600">Define your initial capital requirements and funding sources</p>
        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
          <p className="text-amber-800 font-medium">⚠️ Section en mode compatibilité</p>
          <p className="text-amber-700 text-sm">Utilisez "Point de Départ" pour une gestion agricole complète</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Fixed Assets */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-blue-900">Fixed Assets</CardTitle>
            <p className="text-sm text-blue-700">Long-term assets for your business</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              label="Real Estate - Land"
              value={legacyFixedAssets.realEstateLand}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Real Estate - Buildings (20yr depreciation)"
              value={legacyFixedAssets.realEstateBuildings}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Leasehold Improvements (7yr depreciation)"
              value={legacyFixedAssets.leaseholdImprovements}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Equipment (7yr depreciation)"
              value={legacyFixedAssets.equipment}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Furniture and Fixtures (5yr depreciation)"
              value={legacyFixedAssets.furnitureFixtures}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Vehicles (5yr depreciation)"
              value={legacyFixedAssets.vehicles}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Other Fixed Assets (5yr depreciation)"
              value={legacyFixedAssets.other}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <div className="pt-4 border-t border-blue-200">
              <InputField
                label="Total Fixed Assets"
                value={calculations.totalFixedAssets}
                isCalculated={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Operating Capital */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-green-900">Operating Capital</CardTitle>
            <p className="text-sm text-green-700">Working capital and startup costs</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              label="Pre-Opening Salaries and Wages"
              value={legacyOperatingCapital.preOpeningSalaries}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Prepaid Insurance Premiums"
              value={legacyOperatingCapital.prepaidInsurance}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Inventory"
              value={legacyOperatingCapital.inventory}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Legal and Accounting Fees"
              value={legacyOperatingCapital.legalAccounting}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Rent Deposits"
              value={legacyOperatingCapital.rentDeposits}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Utility Deposits"
              value={legacyOperatingCapital.utilityDeposits}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Supplies"
              value={legacyOperatingCapital.supplies}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Advertising and Promotions"
              value={legacyOperatingCapital.advertising}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Licenses"
              value={legacyOperatingCapital.licenses}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Other Initial Start-Up Costs"
              value={legacyOperatingCapital.otherStartupCosts}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Working Capital (Cash On Hand)"
              value={legacyOperatingCapital.workingCapital}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <div className="pt-4 border-t border-green-200">
              <InputField
                label="Total Operating Capital"
                value={calculations.totalOperatingCapital}
                isCalculated={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sources of Funding */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-purple-900">Sources of Funding</CardTitle>
            <p className="text-sm text-purple-700">How you'll finance your business</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Owner's Equity %"
                value={legacyFundingSources.ownersEquityPercent}
                onChange={(value) => console.log('Legacy update not implemented')}
              />
              <InputField
                label="Amount"
                value={legacyFundingSources.ownersEquityAmount}
                onChange={(value) => console.log('Legacy update not implemented')}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Outside Investors %"
                value={legacyFundingSources.outsideInvestorsPercent}
                onChange={(value) => console.log('Legacy update not implemented')}
              />
              <InputField
                label="Amount"
                value={legacyFundingSources.outsideInvestorsAmount}
                onChange={(value) => console.log('Legacy update not implemented')}
              />
            </div>
            <InputField
              label="Commercial Loan (9%, 84 months)"
              value={legacyFundingSources.commercialLoanAmount}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Commercial Mortgage (9%, 240 months)"
              value={legacyFundingSources.commercialMortgageAmount}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Credit Card Debt (7%, 60 months)"
              value={legacyFundingSources.creditCardDebt}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Vehicle Loans (6%, 48 months)"
              value={legacyFundingSources.vehicleLoans}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            <InputField
              label="Other Bank Debt (5%, 36 months)"
              value={legacyFundingSources.otherBankDebt}
              onChange={(value) => console.log('Legacy update not implemented')}
            />
            
            <div className="pt-4 border-t border-purple-200 space-y-2">
              <InputField
                label="Total Sources of Funding"
                value={calculations.totalFundingSources}
                isCalculated={true}
              />
              <InputField
                label="Total Required Funds"
                value={calculations.totalRequiredFunds}
                isCalculated={true}
              />
              <div className={`p-3 rounded-lg ${
                Math.abs(calculations.fundingBalance) < 0.01 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-medium">
                  Funding Balance: {formatCurrency(calculations.fundingBalance)}
                </p>
                <p className="text-sm">
                  {Math.abs(calculations.fundingBalance) < 0.01 
                    ? '✅ Funding sources match required funds' 
                    : calculations.fundingBalance > 0 
                      ? '⚠️ Excess funding available'
                      : '❌ Additional funding needed'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Loan Payments Summary */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Monthly Loan Payments Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Commercial Loan</p>
              <p className="text-lg font-bold text-blue-900">
                {formatCurrency(calculations.monthlyLoanPayments.commercial)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Commercial Mortgage</p>
              <p className="text-lg font-bold text-green-900">
                {formatCurrency(calculations.monthlyLoanPayments.mortgage)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Credit Card</p>
              <p className="text-lg font-bold text-purple-900">
                {formatCurrency(calculations.monthlyLoanPayments.creditCard)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Vehicle Loans</p>
              <p className="text-lg font-bold text-indigo-900">
                {formatCurrency(calculations.monthlyLoanPayments.vehicle)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Other Bank Debt</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(calculations.monthlyLoanPayments.other)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartingPointSection;
