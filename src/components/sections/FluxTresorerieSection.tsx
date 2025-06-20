
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataValidation } from '@/hooks/useDataValidation';
import { EmptyState } from '@/components/ui/EmptyState';
import { TrendingUp, Calculator } from 'lucide-react';

const FluxTresorerieSection = () => {
  const { canGenerateReports, hasCompanyInfo } = useDataValidation();

  if (!hasCompanyInfo) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Flux de Trésorerie Classique</h2>
          <p className="text-gray-600">Analyse des flux de trésorerie mensuels et prévisionnels</p>
        </div>

        <EmptyState
          title="Configuration requise"
          description="Veuillez d'abord configurer les informations de votre entreprise dans l'onglet Configuration pour voir les flux de trésorerie."
          actionText="Aller à la Configuration"
          onAction={() => {
            // This would be handled by the parent component to switch tabs
            console.log('Navigate to configuration');
          }}
          icon={<Calculator className="h-12 w-12" />}
        />
      </div>
    );
  }

  if (!canGenerateReports) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Flux de Trésorerie Classique</h2>
          <p className="text-gray-600">Analyse des flux de trésorerie mensuels et prévisionnels</p>
        </div>

        <EmptyState
          title="Données insuffisantes"
          description="Pour générer les flux de trésorerie, vous devez d'abord saisir vos prévisions de ventes ou vos charges d'exploitation."
          actionText="Ajouter des Produits"
          onAction={() => {
            console.log('Navigate to sales forecast');
          }}
          icon={<TrendingUp className="h-12 w-12" />}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-orange-800 mb-2">Étapes manquantes :</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Saisir au moins un produit dans "Prévisions de Ventes"</li>
                <li>• OU ajouter des charges dans "Charges d'Exploitation"</li>
                <li>• Configurer la masse salariale (optionnel)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-blue-800 mb-2">Ce que vous obtiendrez :</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Flux de trésorerie mensuel sur 3 ans</li>
                <li>• Analyse de la liquidité</li>
                <li>• Identification des périodes critiques</li>
                <li>• Projections de trésorerie cumulée</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Si on arrive ici, on peut générer les rapports
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Flux de Trésorerie Classique</h2>
        <p className="text-gray-600">Analyse des flux de trésorerie mensuels et prévisionnels</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Flux de Trésorerie (en FCFA)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">
            Les calculs de flux de trésorerie seront affichés ici une fois que vous aurez complété la saisie de vos données dans les autres sections.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FluxTresorerieSection;
