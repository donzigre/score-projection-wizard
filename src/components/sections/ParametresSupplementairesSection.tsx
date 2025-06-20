
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard } from '@/components/ui/InfoCard';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency, formatPercentage } from '@/utils/formatting';

const ParametresSupplementairesSection = () => {
  const { data, updateAdditionalParameters } = useFinancialData();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Paramètres Supplémentaires</h2>
        <p className="text-gray-600">Configurez les conditions de paiement et hypothèses fiscales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conditions de Paiement Clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cash">Ventes au comptant (%)</Label>
              <Input
                id="cash"
                type="number"
                value={data.additionalParameters?.paymentTerms.cash || ''}
                onChange={(e) => updateAdditionalParameters({
                  paymentTerms: {
                    ...data.additionalParameters?.paymentTerms,
                    cash: Number(e.target.value)
                  }
                })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="net30">Paiement à 30 jours (%)</Label>
              <Input
                id="net30"
                type="number"
                value={data.additionalParameters?.paymentTerms.net30 || ''}
                onChange={(e) => updateAdditionalParameters({
                  paymentTerms: {
                    ...data.additionalParameters?.paymentTerms,
                    net30: Number(e.target.value)
                  }
                })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="net60">Paiement à 60 jours (%)</Label>
              <Input
                id="net60"
                type="number"
                value={data.additionalParameters?.paymentTerms.net60 || ''}
                onChange={(e) => updateAdditionalParameters({
                  paymentTerms: {
                    ...data.additionalParameters?.paymentTerms,
                    net60: Number(e.target.value)
                  }
                })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="over60">Paiement à +60 jours (%)</Label>
              <Input
                id="over60"
                type="number"
                value={data.additionalParameters?.paymentTerms.over60 || ''}
                onChange={(e) => updateAdditionalParameters({
                  paymentTerms: {
                    ...data.additionalParameters?.paymentTerms,
                    over60: Number(e.target.value)
                  }
                })}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ligne de Crédit et Fiscalité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="creditAmount">Montant ligne de crédit</Label>
              <Input
                id="creditAmount"
                type="number"
                value={data.additionalParameters?.creditLine.amount || ''}
                onChange={(e) => updateAdditionalParameters({
                  creditLine: {
                    ...data.additionalParameters?.creditLine,
                    amount: Number(e.target.value)
                  }
                })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="creditRate">Taux d'intérêt (%)</Label>
              <Input
                id="creditRate"
                type="number"
                step="0.1"
                value={data.additionalParameters?.creditLine.interestRate || ''}
                onChange={(e) => updateAdditionalParameters({
                  creditLine: {
                    ...data.additionalParameters?.creditLine,
                    interestRate: Number(e.target.value)
                  }
                })}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Taux d'imposition (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.1"
                value={data.additionalParameters?.taxAssumptions.corporateTaxRate || ''}
                onChange={(e) => updateAdditionalParameters({
                  taxAssumptions: {
                    ...data.additionalParameters?.taxAssumptions,
                    corporateTaxRate: Number(e.target.value)
                  }
                })}
                placeholder="0.0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <InfoCard 
        title="Résumé des Paramètres"
        content={
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Conditions de paiement :</strong>
              <ul className="mt-2 space-y-1">
                <li>Comptant : {data.additionalParameters?.paymentTerms.cash || 0}%</li>
                <li>30 jours : {data.additionalParameters?.paymentTerms.net30 || 0}%</li>
                <li>60 jours : {data.additionalParameters?.paymentTerms.net60 || 0}%</li>
                <li>+60 jours : {data.additionalParameters?.paymentTerms.over60 || 0}%</li>
              </ul>
            </div>
            <div>
              <strong>Financement et Fiscalité :</strong>
              <ul className="mt-2 space-y-1">
                <li>Ligne de crédit : {formatCurrency((data.additionalParameters?.creditLine.amount || 0))}</li>
                <li>Taux d'intérêt : {formatPercentage((data.additionalParameters?.creditLine.interestRate || 0))}</li>
                <li>Taux d'imposition : {formatPercentage((data.additionalParameters?.taxAssumptions.corporateTaxRate || 0))}</li>
              </ul>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ParametresSupplementairesSection;
