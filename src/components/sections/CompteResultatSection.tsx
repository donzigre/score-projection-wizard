
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataValidation } from '@/hooks/useDataValidation';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileText, BarChart3 } from 'lucide-react';

const CompteResultatSection = () => {
  const { canGenerateReports, hasCompanyInfo } = useDataValidation();

  if (!hasCompanyInfo) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Compte de Résultat</h2>
          <p className="text-gray-600">État de résultat prévisionnel sur 3 ans</p>
        </div>

        <EmptyState
          title="Configuration requise"
          description="Veuillez d'abord configurer les informations de votre entreprise dans l'onglet Configuration."
          actionText="Aller à la Configuration"
          onAction={() => {
            console.log('Navigate to configuration');
          }}
          icon={<FileText className="h-12 w-12" />}
        />
      </div>
    );
  }

  if (!canGenerateReports) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Compte de Résultat</h2>
          <p className="text-gray-600">État de résultat prévisionnel sur 3 ans</p>
        </div>

        <EmptyState
          title="Données insuffisantes"
          description="Pour générer le compte de résultat, vous devez saisir vos prévisions de chiffre d'affaires et vos charges."
          actionText="Configurer les Ventes"
          onAction={() => {
            console.log('Navigate to sales forecast');
          }}
          icon={<BarChart3 className="h-12 w-12" />}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-dashed border-2 border-purple-300 bg-purple-50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-purple-800 mb-2">Données requises :</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Prévisions de ventes (produits et prix)</li>
                <li>• Charges d'exploitation</li>
                <li>• Masse salariale (si applicable)</li>
                <li>• Amortissements (calculés automatiquement)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-green-300 bg-green-50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-green-800 mb-2">Résultats obtenus :</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Chiffre d'affaires prévisionnel</li>
                <li>• Résultat d'exploitation</li>
                <li>• Résultat net</li>
                <li>• Évolution sur 3 ans</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Compte de Résultat</h2>
        <p className="text-gray-600">État de résultat prévisionnel sur 3 ans</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compte de Résultat Prévisionnel (en FCFA)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">
            Le compte de résultat sera généré automatiquement une fois que vous aurez complété la saisie de vos données.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompteResultatSection;
