
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataValidation } from '@/hooks/useDataValidation';
import { EmptyState } from '@/components/ui/EmptyState';
import { Scale, Building } from 'lucide-react';

const BilanSection = () => {
  const { canGenerateReports, hasCompanyInfo, hasFixedAssets, hasFundingSources } = useDataValidation();

  if (!hasCompanyInfo) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bilan</h2>
          <p className="text-gray-600">Bilan prévisionnel sur 3 ans</p>
        </div>

        <EmptyState
          title="Configuration requise"
          description="Veuillez d'abord configurer les informations de votre entreprise."
          actionText="Aller à la Configuration"
          onAction={() => {
            console.log('Navigate to configuration');
          }}
          icon={<Scale className="h-12 w-12" />}
        />
      </div>
    );
  }

  if (!canGenerateReports || (!hasFixedAssets && !hasFundingSources)) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bilan</h2>
          <p className="text-gray-600">Bilan prévisionnel sur 3 ans</p>
        </div>

        <EmptyState
          title="Données insuffisantes"
          description="Pour générer le bilan, vous devez configurer vos immobilisations et sources de financement dans 'Point de Départ'."
          actionText="Configurer le Point de Départ"
          onAction={() => {
            console.log('Navigate to starting point');
          }}
          icon={<Building className="h-12 w-12" />}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-dashed border-2 border-indigo-300 bg-indigo-50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-indigo-800 mb-2">Actif requis :</h3>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Immobilisations (terrains, bâtiments, matériel)</li>
                <li>• Stocks de départ</li>
                <li>• Trésorerie initiale</li>
                <li>• Créances (calculées automatiquement)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-teal-300 bg-teal-50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-teal-800 mb-2">Passif requis :</h3>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Capital initial</li>
                <li>• Emprunts et financements</li>
                <li>• Subventions reçues</li>
                <li>• Dettes (calculées automatiquement)</li>
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bilan</h2>
        <p className="text-gray-600">Bilan prévisionnel sur 3 ans</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bilan Prévisionnel (en FCFA)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">
            Le bilan sera généré automatiquement à partir de vos données saisies dans les autres sections.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BilanSection;
