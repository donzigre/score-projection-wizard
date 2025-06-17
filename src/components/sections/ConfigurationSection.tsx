
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { InfoCard } from '@/components/ui/InfoCard';

const ConfigurationSection = () => {
  const { data, updateCompanyInfo } = useFinancialData();

  const mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const anneeActuelle = new Date().getFullYear();
  const annees = Array.from({ length: 11 }, (_, i) => anneeActuelle - 5 + i);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Configuration & Informations Entreprise</h2>
        <p className="text-gray-600">Saisissez les informations de base de votre entreprise pour commencer vos projections financières</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-blue-900">Détails de l'Entreprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="preparer-name" className="text-sm font-medium text-gray-700">
                Nom du Préparateur
              </Label>
              <Input
                id="preparer-name"
                value={data.companyInfo.preparerName}
                onChange={(e) => updateCompanyInfo({ preparerName: e.target.value })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="Entrez votre nom"
              />
            </div>

            <div>
              <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                Nom de l'Entreprise
              </Label>
              <Input
                id="company-name"
                value={data.companyInfo.companyName}
                onChange={(e) => updateCompanyInfo({ companyName: e.target.value })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="Entrez le nom de votre entreprise"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Mois de Début</Label>
                <Select
                  value={data.companyInfo.startingMonth}
                  onValueChange={(value) => updateCompanyInfo({ startingMonth: value })}
                >
                  <SelectTrigger className="mt-1 bg-blue-50 border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mois.map((mois) => (
                      <SelectItem key={mois} value={mois}>{mois}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Année de Début</Label>
                <Select
                  value={data.companyInfo.startingYear.toString()}
                  onValueChange={(value) => updateCompanyInfo({ startingYear: parseInt(value) })}
                >
                  <SelectTrigger className="mt-1 bg-blue-50 border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {annees.map((annee) => (
                      <SelectItem key={annee} value={annee.toString()}>{annee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <InfoCard 
          title="Guide de Démarrage"
          content={
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Étape 1 :</strong> Complétez les informations de votre entreprise ci-contre</p>
              <p><strong>Étape 2 :</strong> Naviguez vers "Point de Départ" pour saisir votre financement initial et vos actifs</p>
              <p><strong>Étape 3 :</strong> Configurez vos informations de masse salariale pour les coûts employés</p>
              <p><strong>Étape 4 :</strong> Créez vos prévisions de ventes avec les détails produits</p>
              <p><strong>Étape 5 :</strong> Vérifiez tous les calculs et générez les rapports</p>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="font-medium text-blue-900">💡 Conseil :</p>
                <p className="text-blue-800">Le nom de votre entreprise apparaîtra automatiquement sur tous les états financiers et rapports.</p>
              </div>
            </div>
          }
        />
      </div>

      {data.companyInfo.companyName && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Bienvenue, {data.companyInfo.companyName} !
              </h3>
              <p className="text-green-700">
                Vos projections financières débuteront en {data.companyInfo.startingMonth} {data.companyInfo.startingYear}
              </p>
              <p className="text-sm text-green-600 mt-2">
                Préparé par : {data.companyInfo.preparerName || 'Non spécifié'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConfigurationSection;
