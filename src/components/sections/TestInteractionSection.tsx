
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { Plus, Check, X, AlertCircle } from 'lucide-react';

const TestInteractionSection = () => {
  const { 
    data, 
    updateCompanyInfo, 
    addProduct, 
    updateProduct, 
    removeProduct,
    updatePayrollData,
    updateOperatingExpenses 
  } = useFinancialData();
  
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});
  const [testValue, setTestValue] = useState('');

  const runTest = (testName: string, callback: () => void) => {
    try {
      callback();
      setTestResults(prev => ({ ...prev, [testName]: true }));
    } catch (error) {
      console.error(`Test ${testName} failed:`, error);
      setTestResults(prev => ({ ...prev, [testName]: false }));
    }
  };

  const TestResult = ({ testName }: { testName: string }) => {
    const result = testResults[testName];
    if (result === undefined) return null;
    
    return (
      <div className={`flex items-center space-x-2 ${result ? 'text-green-600' : 'text-red-600'}`}>
        {result ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        <span className="text-sm">{result ? 'Réussi' : 'Échec'}</span>
      </div>
    );
  };

  const EmptyStateIndicator = ({ isEmpty, label }: { isEmpty: boolean, label: string }) => (
    <div className={`flex items-center space-x-2 ${isEmpty ? 'text-orange-600' : 'text-green-600'}`}>
      {isEmpty ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
      <span className="text-sm">{isEmpty ? `${label} - État vide (normal)` : `${label} - Contient des données`}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Test d'Interaction des Composants</h2>
        <p className="text-gray-600">Vérification du fonctionnement de tous les champs et état initial vide</p>
      </div>

      {/* État Initial */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">État Initial des Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <EmptyStateIndicator isEmpty={data.products.length === 0} label="Produits" />
              <EmptyStateIndicator isEmpty={data.payrollData.employees.length === 0} label="Employés" />
              <EmptyStateIndicator isEmpty={data.operatingExpenses.length === 0} label="Charges d'exploitation" />
              <EmptyStateIndicator isEmpty={data.fixedAssets.length === 0} label="Immobilisations" />
            </div>
            <div className="space-y-2">
              <EmptyStateIndicator isEmpty={data.fundingSources.length === 0} label="Sources de financement" />
              <EmptyStateIndicator isEmpty={data.workingCapitalItems.length === 0} label="Capital de travail" />
              <EmptyStateIndicator isEmpty={!data.companyInfo.companyName} label="Nom d'entreprise" />
              <EmptyStateIndicator isEmpty={data.operatingCapital.workingCapital === 0} label="Capital opérationnel" />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-orange-100 rounded-lg">
            <p className="text-orange-800 font-medium">✅ Bon : L'application démarre avec des données vides</p>
            <p className="text-orange-700 text-sm mt-1">Ceci est l'état normal - commencez par saisir les informations de votre entreprise dans l'onglet "Configuration"</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Test Informations Entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Test Informations Entreprise
              <TestResult testName="companyInfo" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nom de l'entreprise actuel:</Label>
              <p className="text-sm text-gray-600">{data.companyInfo.companyName || 'Vide (normal au démarrage)'}</p>
            </div>
            <div>
              <Label htmlFor="test-company">Nouveau nom d'entreprise:</Label>
              <Input
                id="test-company"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="Ex: Ma Ferme SARL"
              />
            </div>
            <Button 
              onClick={() => runTest('companyInfo', () => {
                updateCompanyInfo({ companyName: testValue });
                setTestValue('');
              })}
              disabled={!testValue}
            >
              Tester Modification
            </Button>
          </CardContent>
        </Card>

        {/* Test Produits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Test Gestion Produits
              <TestResult testName="products" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre de produits actuels:</Label>
              <p className="text-sm text-gray-600">{data.products.length} (vide au démarrage)</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => runTest('products', () => {
                  addProduct();
                })}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Premier Produit
              </Button>
              {data.products.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={() => runTest('products', () => {
                    removeProduct(data.products[data.products.length - 1].id);
                  })}
                  size="sm"
                >
                  Supprimer Dernier
                </Button>
              )}
            </div>
            {data.products.length > 0 && (
              <div>
                <Label htmlFor="test-product-name">Modifier nom du premier produit:</Label>
                <Input
                  id="test-product-name"
                  value={testValue}
                  onChange={(e) => setTestValue(e.target.value)}
                  placeholder="Ex: Tomates"
                />
                <Button 
                  className="mt-2"
                  onClick={() => runTest('products', () => {
                    updateProduct(data.products[0].id, { name: testValue });
                    setTestValue('');
                  })}
                  disabled={!testValue}
                  size="sm"
                >
                  Modifier
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Masse Salariale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Test Masse Salariale
              <TestResult testName="payroll" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre d'employés actuels:</Label>
              <p className="text-sm text-gray-600">{data.payrollData.employees.length} (vide au démarrage)</p>
            </div>
            <div>
              <Label>Total salaires mensuels:</Label>
              <p className="text-sm text-gray-600">{formatCurrency(data.payrollData.totalMonthlySalaries)} (0 au démarrage)</p>
            </div>
            <Button 
              onClick={() => runTest('payroll', () => {
                const newEmployee = {
                  id: Date.now().toString(),
                  nom: 'Kouadio',
                  prenom: 'Jean',
                  poste: 'Ouvrier Agricole',
                  typeContrat: 'CDI' as const,
                  salaireBrut: 150000, // 150,000 FCFA
                  heuresParMois: 160,
                  tauxHoraire: 937.5,
                  cnpsEmploye: 12000,
                  cnpsEmployeur: 24000,
                  autresCharges: 5000
                };
                updatePayrollData({ 
                  employees: [...data.payrollData.employees, newEmployee] 
                });
              })}
              size="sm"
            >
              Ajouter Employé Test
            </Button>
          </CardContent>
        </Card>

        {/* Test Charges d'Exploitation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Test Charges d'Exploitation
              <TestResult testName="expenses" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre de charges actuelles:</Label>
              <p className="text-sm text-gray-600">{data.operatingExpenses.length} (vide au démarrage)</p>
            </div>
            <Button 
              onClick={() => runTest('expenses', () => {
                const newExpense = {
                  id: Date.now().toString(),
                  category: 'Carburant',
                  description: 'Essence pour tracteur et véhicules',
                  monthlyAmount: 50000, // 50,000 FCFA
                  growthRate: 5,
                  isAutoCalculated: false
                };
                updateOperatingExpenses([...data.operatingExpenses, newExpense]);
              })}
              size="sm"
            >
              Ajouter Charge Test
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Résumé des Tests */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle>Guide d'Utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-blue-800 font-medium">📋 Ordre recommandé de saisie :</p>
              <ol className="text-blue-700 text-sm mt-2 space-y-1 list-decimal list-inside">
                <li>Configuration : Nom d'entreprise, dates de démarrage</li>
                <li>Point de Départ : Immobilisations et sources de financement</li>
                <li>Gestion Parcelles : Définir vos parcelles et cultures</li>
                <li>Masse Salariale : Ajouter vos employés</li>
                <li>Prévisions de Ventes : Créer vos produits et prix</li>
                <li>Charges d'Exploitation : Définir vos coûts mensuels</li>
                <li>Vérifier les rapports financiers générés automatiquement</li>
              </ol>
            </div>
            
            {Object.keys(testResults).length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Tests Réussis:</h4>
                  <div className="space-y-1">
                    {Object.entries(testResults)
                      .filter(([_, result]) => result)
                      .map(([test, _]) => (
                        <div key={test} className="flex items-center space-x-2 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-sm capitalize">{test}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Tests Échoués:</h4>
                  <div className="space-y-1">
                    {Object.entries(testResults)
                      .filter(([_, result]) => !result)
                      .map(([test, _]) => (
                        <div key={test} className="flex items-center space-x-2 text-red-600">
                          <X className="h-4 w-4" />
                          <span className="text-sm capitalize">{test}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestInteractionSection;
