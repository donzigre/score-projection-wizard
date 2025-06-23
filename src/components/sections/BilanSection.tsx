
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDataValidation } from '@/hooks/useDataValidation';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { Scale, Building, PieChart, TrendingUp } from 'lucide-react';
import { generateCompteResultat, generateBilan } from '@/utils/financialCalculations';
import { formatCurrency } from '@/utils/formatting';

const BilanSection = () => {
  const { canGenerateReports, hasCompanyInfo, hasFixedAssets, hasFundingSources } = useDataValidation();
  const { data } = useFinancialData();

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

  const compteResultat = generateCompteResultat(data);
  const bilan = generateBilan(data, compteResultat);

  const calculateRatio = (numerator: number, denominator: number) => {
    if (denominator === 0) return 0;
    return (numerator / denominator * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bilan</h2>
        <p className="text-gray-600">Bilan prévisionnel sur 3 ans</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ACTIF */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Building className="h-5 w-5" />
              ACTIF (en FCFA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Éléments</TableHead>
                  <TableHead className="text-right">Année 1</TableHead>
                  <TableHead className="text-right">Année 2</TableHead>
                  <TableHead className="text-right">Année 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-blue-50">
                  <TableCell className="font-semibold">ACTIF IMMOBILISÉ</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Immobilisations nettes</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.immobilisations.year1)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.immobilisations.year2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.immobilisations.year3)}</TableCell>
                </TableRow>
                
                <TableRow className="bg-green-50">
                  <TableCell className="font-semibold">ACTIF CIRCULANT</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Stocks</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.stocks.year1)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.stocks.year2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.stocks.year3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Créances clients</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.creances.year1)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.creances.year2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.creances.year3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Trésorerie</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.tresorerie.year1)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.tresorerie.year2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.actif.tresorerie.year3)}</TableCell>
                </TableRow>
                
                <TableRow className="bg-purple-50 border-t-2">
                  <TableCell className="font-bold">TOTAL ACTIF</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(bilan.actif.totalActif.year1)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(bilan.actif.totalActif.year2)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(bilan.actif.totalActif.year3)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* PASSIF */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Scale className="h-5 w-5" />
              PASSIF (en FCFA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Éléments</TableHead>
                  <TableHead className="text-right">Année 1</TableHead>
                  <TableHead className="text-right">Année 2</TableHead>
                  <TableHead className="text-right">Année 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-orange-50">
                  <TableCell className="font-semibold">CAPITAUX PROPRES</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Capital social</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.capital.year1)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.capital.year2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.capital.year3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Résultat reporté</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.resultatAccumule.year1)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.resultatAccumule.year2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.resultatAccumule.year3)}</TableCell>
                </TableRow>
                
                <TableRow className="bg-red-50">
                  <TableCell className="font-semibold">DETTES</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Emprunts bancaires</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.emprunts.year1)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.emprunts.year2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.emprunts.year3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Dettes fournisseurs</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.dettes.year1)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.dettes.year2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(bilan.passif.dettes.year3)}</TableCell>
                </TableRow>
                
                <TableRow className="bg-purple-50 border-t-2">
                  <TableCell className="font-bold">TOTAL PASSIF</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(bilan.passif.totalPassif.year1)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(bilan.passif.totalPassif.year2)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(bilan.passif.totalPassif.year3)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Indicateurs financiers */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <PieChart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800 mb-1">Autonomie Financière</h3>
            <p className="text-2xl font-bold text-blue-600">
              {calculateRatio(
                bilan.passif.capital.year1 + bilan.passif.resultatAccumule.year1,
                bilan.passif.totalPassif.year1
              )}%
            </p>
            <p className="text-sm text-blue-700">Année 1</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-800 mb-1">Liquidité Générale</h3>
            <p className="text-2xl font-bold text-green-600">
              {calculateRatio(
                bilan.actif.stocks.year1 + bilan.actif.creances.year1 + bilan.actif.tresorerie.year1,
                bilan.passif.dettes.year1
              )}%
            </p>
            <p className="text-sm text-green-700">Année 1</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Scale className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-purple-800 mb-1">Endettement</h3>
            <p className="text-2xl font-bold text-purple-600">
              {calculateRatio(
                bilan.passif.emprunts.year1 + bilan.passif.dettes.year1,
                bilan.passif.totalPassif.year1
              )}%
            </p>
            <p className="text-sm text-purple-700">Année 1</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Building className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-orange-800 mb-1">Croissance Actif</h3>
            <p className="text-2xl font-bold text-orange-600">
              +{calculateRatio(
                bilan.actif.totalActif.year3 - bilan.actif.totalActif.year1,
                bilan.actif.totalActif.year1
              )}%
            </p>
            <p className="text-sm text-orange-700">Sur 3 ans</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BilanSection;
