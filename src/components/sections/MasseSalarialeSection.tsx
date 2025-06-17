
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinancialData, Employee } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { Plus, Trash2, Users, Calculator } from 'lucide-react';
import { InfoCard } from '@/components/ui/InfoCard';

const MasseSalarialeSection = () => {
  const { data, updatePayrollData } = useFinancialData();

  const addEmployee = () => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      nom: 'NOUVEAU',
      prenom: 'Employé',
      poste: 'Ouvrier agricole',
      typeContrat: 'CDI',
      salaireBrut: 200000,
      heuresParMois: 173,
      tauxHoraire: 0,
      cnpsEmploye: 0,
      cnpsEmployeur: 0,
      autresCharges: 0
    };

    const updatedEmployees = [...data.payrollData.employees, newEmployee];
    updatePayrollData({ employees: updatedEmployees });
  };

  const removeEmployee = (id: string) => {
    const updatedEmployees = data.payrollData.employees.filter(emp => emp.id !== id);
    updatePayrollData({ employees: updatedEmployees });
  };

  const updateEmployee = (id: string, field: keyof Employee, value: any) => {
    const updatedEmployees = data.payrollData.employees.map(emp => {
      if (emp.id === id) {
        const updatedEmp = { ...emp, [field]: value };
        
        // Recalculer automatiquement les charges CNPS
        if (field === 'salaireBrut' || field === 'typeContrat') {
          const salaire = parseFloat(updatedEmp.salaireBrut.toString()) || 0;
          if (updatedEmp.typeContrat !== 'Saisonnier') {
            updatedEmp.cnpsEmploye = Math.round(salaire * 0.032); // 3.2%
            updatedEmp.cnpsEmployeur = Math.round(salaire * 0.163); // 16.3%
            updatedEmp.autresCharges = Math.round(salaire * 0.05); // 5% autres charges
            updatedEmp.tauxHoraire = 0;
          } else {
            updatedEmp.cnpsEmploye = 0;
            updatedEmp.cnpsEmployeur = 0;
            updatedEmp.autresCharges = 0;
          }
        }
        
        if (field === 'tauxHoraire' && updatedEmp.typeContrat === 'Saisonnier') {
          const tauxHoraire = parseFloat(updatedEmp.tauxHoraire.toString()) || 0;
          updatedEmp.salaireBrut = tauxHoraire * updatedEmp.heuresParMois;
        }
        
        return updatedEmp;
      }
      return emp;
    });
    
    updatePayrollData({ employees: updatedEmployees });
  };

  const totalSalaireBrut = data.payrollData.employees.reduce((total, emp) => {
    return total + (parseFloat(emp.salaireBrut.toString()) || 0);
  }, 0);

  const totalChargesEmployeur = data.payrollData.employees.reduce((total, emp) => {
    return total + (parseFloat(emp.cnpsEmployeur.toString()) || 0) + (parseFloat(emp.autresCharges.toString()) || 0);
  }, 0);

  const totalCoutSalarial = totalSalaireBrut + totalChargesEmployeur;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Masse Salariale Agricole</h2>
        <p className="text-gray-600">Gérez vos employés et calculez automatiquement les charges sociales ivoiriennes</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InfoCard 
          title="Charges Sociales en Côte d'Ivoire"
          content={
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>📊 CNPS Employé :</strong> 3,2% du salaire brut</p>
              <p><strong>🏢 CNPS Employeur :</strong> 16,3% du salaire brut</p>
              <p><strong>💰 Autres charges :</strong> ~5% (formation, médecine du travail, etc.)</p>
              <p><strong>⏰ Temps de travail :</strong> 40h/semaine = 173h/mois</p>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="font-medium text-blue-900">💡 Conseil :</p>
                <p className="text-blue-800">Les travailleurs saisonniers ont des régimes spéciaux</p>
              </div>
            </div>
          }
        />

        <Card className="bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Résumé Masse Salariale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Salaires bruts totaux :</span>
                <span className="font-bold text-blue-600">{formatCurrency(totalSalaireBrut)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Charges employeur :</span>
                <span className="font-bold text-orange-600">{formatCurrency(totalChargesEmployeur)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-800 font-medium">Coût total mensuel :</span>
                <span className="font-bold text-purple-600">{formatCurrency(totalCoutSalarial)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800 font-medium">Coût annuel estimé :</span>
                <span className="font-bold text-green-600">{formatCurrency(totalCoutSalarial * 12)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Employés ({data.payrollData.employees.length})
          </CardTitle>
          <Button onClick={addEmployee} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Employé
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.payrollData.employees.map((employee, index) => (
              <Card key={employee.id} className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <h4 className="font-medium">Employé #{index + 1}</h4>
                  {data.payrollData.employees.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEmployee(employee.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Nom</Label>
                      <Input
                        value={employee.nom}
                        onChange={(e) => updateEmployee(employee.id, 'nom', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Prénom</Label>
                      <Input
                        value={employee.prenom}
                        onChange={(e) => updateEmployee(employee.id, 'prenom', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Poste</Label>
                      <Select
                        value={employee.poste}
                        onValueChange={(value) => updateEmployee(employee.id, 'poste', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Directeur d'exploitation">Directeur d'exploitation</SelectItem>
                          <SelectItem value="Chef de culture">Chef de culture</SelectItem>
                          <SelectItem value="Ouvrier agricole">Ouvrier agricole</SelectItem>
                          <SelectItem value="Tractoriste">Tractoriste</SelectItem>
                          <SelectItem value="Gardien">Gardien</SelectItem>
                          <SelectItem value="Magasinier">Magasinier</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Type de contrat</Label>
                      <Select
                        value={employee.typeContrat}
                        onValueChange={(value) => updateEmployee(employee.id, 'typeContrat', value as Employee['typeContrat'])}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CDI">CDI</SelectItem>
                          <SelectItem value="CDD">CDD</SelectItem>
                          <SelectItem value="Saisonnier">Saisonnier</SelectItem>
                          <SelectItem value="Consultant">Consultant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    {employee.typeContrat === 'Saisonnier' ? (
                      <>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Taux horaire (FCFA)</Label>
                          <Input
                            type="number"
                            value={parseFloat(employee.tauxHoraire.toString()) || ''}
                            onChange={(e) => updateEmployee(employee.id, 'tauxHoraire', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Heures/mois</Label>
                          <Input
                            type="number"
                            value={parseFloat(employee.heuresParMois.toString()) || ''}
                            onChange={(e) => updateEmployee(employee.id, 'heuresParMois', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Salaire calculé</Label>
                          <Input
                            type="number"
                            value={parseFloat(employee.salaireBrut.toString()) || ''}
                            disabled
                            className="mt-1 bg-gray-100"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Salaire brut mensuel (FCFA)</Label>
                        <Input
                          type="number"
                          step="1000"
                          value={parseFloat(employee.salaireBrut.toString()) || ''}
                          onChange={(e) => updateEmployee(employee.id, 'salaireBrut', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>

                  {employee.typeContrat !== 'Saisonnier' && (
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">CNPS Employé (3,2%)</Label>
                        <Input
                          type="number"
                          value={parseFloat(employee.cnpsEmploye.toString()) || ''}
                          disabled
                          className="mt-1 bg-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">CNPS Employeur (16,3%)</Label>
                        <Input
                          type="number"
                          value={parseFloat(employee.cnpsEmployeur.toString()) || ''}
                          disabled
                          className="mt-1 bg-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Autres charges (5%)</Label>
                        <Input
                          type="number"
                          value={parseFloat(employee.autresCharges.toString()) || ''}
                          onChange={(e) => updateEmployee(employee.id, 'autresCharges', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-900">Coût total mensuel employeur :</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(
                          (parseFloat(employee.salaireBrut.toString()) || 0) + 
                          (parseFloat(employee.cnpsEmployeur.toString()) || 0) + 
                          (parseFloat(employee.autresCharges.toString()) || 0)
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasseSalarialeSection;
