
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';

const PointDepartSection = () => {
  const { data, updateFixedAssets, updateOperatingCapital, updateFundingSources, calculations } = useFinancialData();

  const ChampSaisie = ({ 
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Point de Départ - Financement & Actifs</h2>
        <p className="text-gray-600">Définissez vos besoins en capital initial et sources de financement</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Immobilisations */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-blue-900">Immobilisations</CardTitle>
            <p className="text-sm text-blue-700">Actifs immobilisés de votre entreprise</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChampSaisie
              label="Immobilier - Terrain"
              value={data.fixedAssets.realEstateLand}
              onChange={(value) => updateFixedAssets({ realEstateLand: value })}
            />
            <ChampSaisie
              label="Immobilier - Bâtiments (amort. 20 ans)"
              value={data.fixedAssets.realEstateBuildings}
              onChange={(value) => updateFixedAssets({ realEstateBuildings: value })}
            />
            <ChampSaisie
              label="Aménagements (amort. 7 ans)"
              value={data.fixedAssets.leaseholdImprovements}
              onChange={(value) => updateFixedAssets({ leaseholdImprovements: value })}
            />
            <ChampSaisie
              label="Équipements (amort. 7 ans)"
              value={data.fixedAssets.equipment}
              onChange={(value) => updateFixedAssets({ equipment: value })}
            />
            <ChampSaisie
              label="Mobilier et Agencements (amort. 5 ans)"
              value={data.fixedAssets.furnitureFixtures}
              onChange={(value) => updateFixedAssets({ furnitureFixtures: value })}
            />
            <ChampSaisie
              label="Véhicules (amort. 5 ans)"
              value={data.fixedAssets.vehicles}
              onChange={(value) => updateFixedAssets({ vehicles: value })}
            />
            <ChampSaisie
              label="Autres Immobilisations (amort. 5 ans)"
              value={data.fixedAssets.other}
              onChange={(value) => updateFixedAssets({ other: value })}
            />
            <div className="pt-4 border-t border-blue-200">
              <ChampSaisie
                label="Total Immobilisations"
                value={calculations.totalFixedAssets}
                isCalculated={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fonds de Roulement */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-green-900">Fonds de Roulement</CardTitle>
            <p className="text-sm text-green-700">Fonds de roulement et coûts de démarrage</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChampSaisie
              label="Salaires et Charges d'Ouverture"
              value={data.operatingCapital.preOpeningSalaries}
              onChange={(value) => updateOperatingCapital({ preOpeningSalaries: value })}
            />
            <ChampSaisie
              label="Primes d'Assurance Prépayées"
              value={data.operatingCapital.prepaidInsurance}
              onChange={(value) => updateOperatingCapital({ prepaidInsurance: value })}
            />
            <ChampSaisie
              label="Stock Initial"
              value={data.operatingCapital.inventory}
              onChange={(value) => updateOperatingCapital({ inventory: value })}
            />
            <ChampSaisie
              label="Frais Juridiques et Comptables"
              value={data.operatingCapital.legalAccounting}
              onChange={(value) => updateOperatingCapital({ legalAccounting: value })}
            />
            <ChampSaisie
              label="Dépôts de Garantie Loyers"
              value={data.operatingCapital.rentDeposits}
              onChange={(value) => updateOperatingCapital({ rentDeposits: value })}
            />
            <ChampSaisie
              label="Dépôts de Garantie Services"
              value={data.operatingCapital.utilityDeposits}
              onChange={(value) => updateOperatingCapital({ utilityDeposits: value })}
            />
            <ChampSaisie
              label="Fournitures"
              value={data.operatingCapital.supplies}
              onChange={(value) => updateOperatingCapital({ supplies: value })}
            />
            <ChampSaisie
              label="Publicité et Promotion"
              value={data.operatingCapital.advertising}
              onChange={(value) => updateOperatingCapital({ advertising: value })}
            />
            <ChampSaisie
              label="Licences et Autorisations"
              value={data.operatingCapital.licenses}
              onChange={(value) => updateOperatingCapital({ licenses: value })}
            />
            <ChampSaisie
              label="Autres Frais de Démarrage"
              value={data.operatingCapital.otherStartupCosts}
              onChange={(value) => updateOperatingCapital({ otherStartupCosts: value })}
            />
            <ChampSaisie
              label="Trésorerie de Départ"
              value={data.operatingCapital.workingCapital}
              onChange={(value) => updateOperatingCapital({ workingCapital: value })}
            />
            <div className="pt-4 border-t border-green-200">
              <ChampSaisie
                label="Total Fonds de Roulement"
                value={calculations.totalOperatingCapital}
                isCalculated={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sources de Financement */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-purple-900">Sources de Financement</CardTitle>
            <p className="text-sm text-purple-700">Comment financer votre entreprise</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <ChampSaisie
                label="Apport Personnel %"
                value={data.fundingSources.ownersEquityPercent}
                onChange={(value) => updateFundingSources({ ownersEquityPercent: value })}
              />
              <ChampSaisie
                label="Montant"
                value={data.fundingSources.ownersEquityAmount}
                onChange={(value) => updateFundingSources({ ownersEquityAmount: value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ChampSaisie
                label="Investisseurs %"
                value={data.fundingSources.outsideInvestorsPercent}
                onChange={(value) => updateFundingSources({ outsideInvestorsPercent: value })}
              />
              <ChampSaisie
                label="Montant"
                value={data.fundingSources.outsideInvestorsAmount}
                onChange={(value) => updateFundingSources({outsideInvestorsAmount: value })}
              />
            </div>
            <ChampSaisie
              label="Prêt Bancaire (9%, 84 mois)"
              value={data.fundingSources.commercialLoanAmount}
              onChange={(value) => updateFundingSources({ commercialLoanAmount: value })}
            />
            <ChampSaisie
              label="Crédit Immobilier (9%, 240 mois)"
              value={data.fundingSources.commercialMortgageAmount}
              onChange={(value) => updateFundingSources({ commercialMortgageAmount: value })}
            />
            <ChampSaisie
              label="Crédit Renouvelable (7%, 60 mois)"
              value={data.fundingSources.creditCardDebt}
              onChange={(value) => updateFundingSources({ creditCardDebt: value })}
            />
            <ChampSaisie
              label="Crédit Véhicule (6%, 48 mois)"
              value={data.fundingSources.vehicleLoans}
              onChange={(value) => updateFundingSources({ vehicleLoans: value })}
            />
            <ChampSaisie
              label="Autres Crédits (5%, 36 mois)"
              value={data.fundingSources.otherBankDebt}
              onChange={(value) => updateFundingSources({ otherBankDebt: value })}
            />
            
            <div className="pt-4 border-t border-purple-200 space-y-2">
              <ChampSaisie
                label="Total Sources de Financement"
                value={calculations.totalFundingSources}
                isCalculated={true}
              />
              <ChampSaisie
                label="Total Besoins de Financement"
                value={calculations.totalRequiredFunds}
                isCalculated={true}
              />
              <div className={`p-3 rounded-lg ${
                Math.abs(calculations.fundingBalance) < 0.01 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-medium">
                  Équilibre Financement : {formatCurrency(calculations.fundingBalance)}
                </p>
                <p className="text-sm">
                  {Math.abs(calculations.fundingBalance) < 0.01 
                    ? '✅ Sources et besoins équilibrés' 
                    : calculations.fundingBalance > 0 
                      ? '⚠️ Excédent de financement'
                      : '❌ Financement insuffisant'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résumé des Mensualités */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Résumé des Mensualités de Crédit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Prêt Bancaire</p>
              <p className="text-lg font-bold text-blue-900">
                {formatCurrency(calculations.monthlyLoanPayments.commercial)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Crédit Immobilier</p>
              <p className="text-lg font-bold text-green-900">
                {formatCurrency(calculations.monthlyLoanPayments.mortgage)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Crédit Renouvelable</p>
              <p className="text-lg font-bold text-purple-900">
                {formatCurrency(calculations.monthlyLoanPayments.creditCard)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Crédit Véhicule</p>
              <p className="text-lg font-bold text-indigo-900">
                {formatCurrency(calculations.monthlyLoanPayments.vehicle)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Autres Crédits</p>
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

export default PointDepartSection;
