
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataValidation } from '@/hooks/useDataValidation';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useParcelles } from '@/contexts/ParcellesContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/formatting';
import { TrendingUp, Calculator } from 'lucide-react';

const FluxTresorerieSection = () => {
  const { canGenerateReports, hasCompanyInfo } = useDataValidation();
  const { data } = useFinancialData();
  const { parcelles, getTotalMetrics } = useParcelles();

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
          onAction={() => console.log('Navigate to configuration')}
          icon={<Calculator className="h-12 w-12" />}
        />
      </div>
    );
  }

  if (!canGenerateReports || parcelles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Flux de Trésorerie Classique</h2>
          <p className="text-gray-600">Analyse des flux de trésorerie mensuels et prévisionnels</p>
        </div>

        <EmptyState
          title="Données de parcelles requises"
          description="Pour générer les flux de trésorerie, vous devez d'abord créer des parcelles et leur assigner des cultures."
          actionText="Gérer les Parcelles"
          onAction={() => console.log('Navigate to parcelles')}
          icon={<TrendingUp className="h-12 w-12" />}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-orange-800 mb-2">Étapes manquantes :</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Créer des parcelles dans "Gestion Parcelles"</li>
                <li>• Assigner des cultures aux parcelles</li>
                <li>• Configurer les coûts de production</li>
                <li>• Estimer les rendements attendus</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-blue-800 mb-2">Ce que vous obtiendrez :</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Flux de trésorerie basé sur vos parcelles</li>
                <li>• Analyse saisonnière des cultures</li>
                <li>• Identification des périodes de financement</li>
                <li>• Projections de trésorerie cumulée</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculer la trésorerie basée sur les données réelles
  const totalMetrics = getTotalMetrics();
  const capitalInitial = data.fundingSources.reduce((sum, source) => sum + source.amount, 0);
  const tresorerieActuelle = capitalInitial + totalMetrics.margeTotale;

  // Si on arrive ici, on peut générer les rapports basés sur les parcelles
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Flux de Trésorerie Classique</h2>
        <p className="text-gray-600">Analyse des flux de trésorerie mensuels et prévisionnels</p>
      </div>

      {/* Résumé de trésorerie basé sur les données réelles */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="text-center">Position de Trésorerie Actuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-600">Capital Initial</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(capitalInitial)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Résultat Prévisionnel</p>
              <p className={`text-2xl font-bold ${totalMetrics.margeTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalMetrics.margeTotale)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trésorerie Prévisionnelle</p>
              <p className={`text-2xl font-bold ${tresorerieActuelle >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(tresorerieActuelle)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détail par parcelles */}
      <Card>
        <CardHeader>
          <CardTitle>Contribution par Parcelle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parcelles.map((parcelle) => {
              const product = data.products.find(p => p.id === parcelle.cultureId);
              const revenusAnnuels = product ? parcelle.rendementAttendu * product.pricePerUnit : 0;
              const coutsTotaux = parcelle.coutsPrepration + parcelle.coutsIntrants + 
                                 parcelle.coutsMainOeuvre + parcelle.autresCouts;
              const contribution = revenusAnnuels - coutsTotaux;
              
              return (
                <div key={parcelle.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{parcelle.nom}</h4>
                    <p className="text-sm text-gray-600">
                      {product ? product.name : 'Aucune culture assignée'} - {parcelle.surface} ha
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${contribution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(contribution)}
                    </p>
                    <p className="text-sm text-gray-500">Contribution annuelle</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations de Trésorerie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tresorerieActuelle < 0 && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                <p className="text-red-700 font-medium">⚠️ Trésorerie négative prévue</p>
                <p className="text-red-600 text-sm">
                  Considérez augmenter vos financements ou optimiser vos coûts de production.
                </p>
              </div>
            )}
            
            {tresorerieActuelle >= 0 && tresorerieActuelle < capitalInitial * 0.2 && (
              <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                <p className="text-orange-700 font-medium">⚡ Trésorerie faible</p>
                <p className="text-orange-600 text-sm">
                  Maintenez une réserve de sécurité pour faire face aux imprévus.
                </p>
              </div>
            )}
            
            {tresorerieActuelle >= capitalInitial * 0.5 && (
              <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="text-green-700 font-medium">✅ Situation financière saine</p>
                <p className="text-green-600 text-sm">
                  Vous pouvez envisager d'investir dans l'expansion ou l'amélioration des parcelles.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FluxTresorerieSection;
