
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';

const StartingPointSection = () => {
  const { data, updateFixedAssets, updateOperatingCapital, updateFundingSources, calculations } = useFinancialData();

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
              value={data.fixedAssets.realEstateLand}
              onChange={(value) => updateFixedAssets({ realEstateLand: value })}
            />
            <InputField
              label="Real Estate - Buildings (20yr depreciation)"
              value={data.fixedAssets.realEstateBuildings}
              onChange={(value) => updateFixedAssets({ realEstateBuildings: value })}
            />
            <InputField
              label="Leasehold Improvements (7yr depreciation)"
              value={data.fixedAssets.leaseholdImprovements}
              onChange={(value) => updateFixedAssets({ leaseholdImprovements: value })}
            />
            <InputField
              label="Equipment (7yr depreciation)"
              value={data.fixedAssets.equipment}
              onChange={(value) => updateFixedAssets({ equipment: value })}
            />
            <InputField
              label="Furniture and Fixtures (5yr depreciation)"
              value={data.fixedAssets.furnitureFixtures}
              onChange={(value) => updateFixedAssets({ furnitureFixtures: value })}
            />
            <InputField
              label="Vehicles (5yr depreciation)"
              value={data.fixedAssets.vehicles}
              onChange={(value) => updateFixedAssets({ vehicles: value })}
            />
            <InputField
              label="Other Fixed Assets (5yr depreciation)"
              value={data.fixedAssets.other}
              onChange={(value) => updateFixedAssets({ other: value })}
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
              value={data.operatingCapital.preOpeningSalaries}
              onChange={(value) => updateOperatingCapital({ preOpeningSalaries: value })}
            />
            <InputField
              label="Prepaid Insurance Premiums"
              value={data.operatingCapital.prepaidInsurance}
              onChange={(value) => updateOperatingCapital({ prepaidInsurance: value })}
            />
            <InputField
              label="Inventory"
              value={data.operatingCapital.inventory}
              onChange={(value) => updateOperatingCapital({ inventory: value })}
            />
            <InputField
              label="Legal and Accounting Fees"
              value={data.operatingCapital.legalAccounting}
              onChange={(value) => updateOperatingCapital({ legalAccounting: value })}
            />
            <InputField
              label="Rent Deposits"
              value={data.operatingCapital.rentDeposits}
              onChange={(value) => updateOperatingCapital({ rentDeposits: value })}
            />
            <InputField
              label="Utility Deposits"
              value={data.operatingCapital.utilityDeposits}
              onChange={(value) => updateOperatingCapital({ utilityDeposits: value })}
            />
            <InputField
              label="Supplies"
              value={data.operatingCapital.supplies}
              onChange={(value) => updateOperatingCapital({ supplies: value })}
            />
            <InputField
              label="Advertising and Promotions"
              value={data.operatingCapital.advertising}
              onChange={(value) => updateOperatingCapital({ advertising: value })}
            />
            <InputField
              label="Licenses"
              value={data.operatingCapital.licenses}
              onChange={(value) => updateOperatingCapital({ licenses: value })}
            />
            <InputField
              label="Other Initial Start-Up Costs"
              value={data.operatingCapital.otherStartupCosts}
              onChange={(value) => updateOperatingCapital({ otherStartupCosts: value })}
            />
            <InputField
              label="Working Capital (Cash On Hand)"
              value={data.operatingCapital.workingCapital}
              onChange={(value) => updateOperatingCapital({ workingCapital: value })}
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
                value={data.fundingSources.ownersEquityPercent}
                onChange={(value) => updateFundingSources({ ownersEquityPercent: value })}
              />
              <InputField
                label="Amount"
                value={data.fundingSources.ownersEquityAmount}
                onChange={(value) => updateFundingSources({ ownersEquityAmount: value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Outside Investors %"
                value={data.fundingSources.outsideInvestorsPercent}
                onChange={(value) => updateFundingSources({ outsideInvestorsPercent: value })}
              />
              <InputField
                label="Amount"
                value={data.fundingSources.outsideInvestorsAmount}
                onChange={(value) => updateFundingSources({outsideInvestorsAmount: value })}
              />
            </div>
            <InputField
              label="Commercial Loan (9%, 84 months)"
              value={data.fundingSources.commercialLoanAmount}
              onChange={(value) => updateFundingSources({ commercialLoanAmount: value })}
            />
            <InputField
              label="Commercial Mortgage (9%, 240 months)"
              value={data.fundingSources.commercialMortgageAmount}
              onChange={(value) => updateFundingSources({ commercialMortgageAmount: value })}
            />
            <InputField
              label="Credit Card Debt (7%, 60 months)"
              value={data.fundingSources.creditCardDebt}
              onChange={(value) => updateFundingSources({ creditCardDebt: value })}
            />
            <InputField
              label="Vehicle Loans (6%, 48 months)"
              value={data.fundingSources.vehicleLoans}
              onChange={(value) => updateFundingSources({ vehicleLoans: value })}
            />
            <InputField
              label="Other Bank Debt (5%, 36 months)"
              value={data.fundingSources.otherBankDebt}
              onChange={(value) => updateFundingSources({ otherBankDebt: value })}
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
