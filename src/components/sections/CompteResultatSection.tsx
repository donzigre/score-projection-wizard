
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDataValidation } from '@/hooks/useDataValidation';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileText, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { generateCompteResultat } from '@/utils/financialCalculations';
import { formatCurrency } from '@/utils/formatting';

const CompteResultatSection = () => {
  const { canGenerateReports, hasCompanyInfo } = useDataValidation();
  const { data } = useFinancialData();

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

  // Générer le compte de résultat même si canGenerateReports est false
  // car nous avons des données pré-remplies
  const compteResultat = generateCompteResultat(data);

  const calculateGrowthRate = (year1: number, year2: number) => {
    if (year1 === 0) return 0;
    return ((year2 - year1) / Math.abs(year1)) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Compte de Résultat</h2>
        <p className="text-gray-600">État de résultat prévisionnel sur 3 ans</p>
        {!canGenerateReports && (
          <p className="text-sm text-amber-600 mt-2">
            Données de démonstration - Personnalisez vos paramètres pour des résultats précis
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Compte de Résultat Prévisionnel (en FCFA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Éléments</TableHead>
                <TableHead className="text-right">Année 1</TableHead>
                <TableHead className="text-right">Année 2</TableHead>
                <TableHead className="text-right">Année 3</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-green-50">
                <TableCell className="font-semibold text-green-800">Chiffre d'Affaires</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(compteResultat.chiffreAffaires.year1)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(compteResultat.chiffreAffaires.year2)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(compteResultat.chiffreAffaires.year3)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-6 text-gray-600">Charges d'Exploitation</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.chargesExploitation.year1)})</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.chargesExploitation.year2)})</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.chargesExploitation.year3)})</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-6 text-gray-600">Masse Salariale</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.masseSalariale.year1)})</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.masseSalariale.year2)})</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.masseSalariale.year3)})</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-6 text-gray-600">Amortissements</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.amortissements.year1)})</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.amortissements.year2)})</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.amortissements.year3)})</TableCell>
              </TableRow>
              
              <TableRow className="bg-blue-50 border-t-2">
                <TableCell className="font-semibold text-blue-800">Résultat d'Exploitation</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(compteResultat.resultatExploitation.year1)}</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(compteResultat.resultatExploitation.year2)}</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(compteResultat.resultatExploitation.year3)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-6 text-gray-600">Charges Financières</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.chargesFinancieres.year1)})</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.chargesFinancieres.year2)})</TableCell>
                <TableCell className="text-right">({formatCurrency(compteResultat.chargesFinancieres.year3)})</TableCell>
              </TableRow>
              
              <TableRow className="bg-purple-50 border-t-2">
                <TableCell className="font-bold text-purple-800">RÉSULTAT NET</TableCell>
                <TableCell className={`text-right font-bold ${compteResultat.resultatNet.year1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(compteResultat.resultatNet.year1)}
                </TableCell>
                <TableCell className={`text-right font-bold ${compteResultat.resultatNet.year2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(compteResultat.resultatNet.year2)}
                </TableCell>
                <TableCell className={`text-right font-bold ${compteResultat.resultatNet.year3 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(compteResultat.resultatNet.year3)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-800 mb-1">Évolution du CA</h3>
            <p className="text-2xl font-bold text-green-600">
              +{calculateGrowthRate(compteResultat.chiffreAffaires.year1, compteResultat.chiffreAffaires.year2).toFixed(1)}%
            </p>
            <p className="text-sm text-green-700">Année 1 → Année 2</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800 mb-1">Marge d'Exploitation</h3>
            <p className="text-2xl font-bold text-blue-600">
              {compteResultat.chiffreAffaires.year1 > 0 ? 
                ((compteResultat.resultatExploitation.year1 / compteResultat.chiffreAffaires.year1) * 100).toFixed(1) : 
                '0.0'
              }%
            </p>
            <p className="text-sm text-blue-700">Année 1</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              {compteResultat.resultatNet.year3 >= compteResultat.resultatNet.year1 ? 
                <TrendingUp className="h-8 w-8 text-purple-600" /> :
                <TrendingDown className="h-8 w-8 text-purple-600" />
              }
            </div>
            <h3 className="font-semibold text-purple-800 mb-1">Croissance Résultat Net</h3>
            <p className="text-2xl font-bold text-purple-600">
              {calculateGrowthRate(compteResultat.resultatNet.year1, compteResultat.resultatNet.year3).toFixed(1)}%
            </p>
            <p className="text-sm text-purple-700">Sur 3 ans</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompteResultatSection;
