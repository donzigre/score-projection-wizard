
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard } from '@/components/ui/InfoCard';

const MasseSalarialeSection = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Système de Masse Salariale - Année 1</h2>
        <p className="text-gray-600">Configurez les catégories d'employés et charges sociales</p>
      </div>

      <InfoCard 
        title="Configuration de la Masse Salariale - Prochainement"
        content={
          <div className="space-y-4">
            <p className="text-gray-700">
              Cette section incluera une gestion complète de la masse salariale avec :
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Rémunération du/des dirigeant(s) et suivi des heures</li>
              <li>Gestion des employés à temps plein et à temps partiel</li>
              <li>Taux des travailleurs indépendants</li>
              <li>Calculs automatiques des charges sociales françaises (Sécurité Sociale, Assurance Chômage, Retraite)</li>
              <li>Avantages sociaux et assurance responsabilité civile professionnelle</li>
              <li>Projections sur 3 ans avec taux de croissance configurables</li>
            </ul>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">💼 Aperçu des Fonctionnalités :</p>
              <p className="text-blue-700 text-sm">
                Calcul automatique de toutes les charges sociales, avantages sociaux, et projections pluriannuelles 
                avec des taux de croissance standards du marché français.
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default MasseSalarialeSection;
