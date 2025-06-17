
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users, Calculator } from "lucide-react";
import { useFinancialData, Employee, PayrollData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';

const MasseSalarialeSection = () => {
  const { data, updatePayrollData } = useFinancialData();
  const [employees, setEmployees] = useState<Employee[]>(data.payrollData.employees);
  const [chargesSociales, setChargesSociales] = useState(data.payrollData.chargesSociales);
  const [inflationAnnuelle, setInflationAnnuelle] = useState(data.payrollData.inflationAnnuelle);

  useEffect(() => {
    setEmployees(data.payrollData.employees);
    setChargesSociales(data.payrollData.chargesSociales);
    setInflationAnnuelle(data.payrollData.inflationAnnuelle);
  }, [data.payrollData]);

  const calculateCharges = (salaireBrut: number, typeContrat: string) => {
    if (typeContrat === 'Consultant') return { cnpsEmploye: 0, cnpsEmployeur: 0, autresCharges: 0 };
    
    const cnpsEmploye = salaireBrut * (chargesSociales.cnpsEmploye / 100);
    const cnpsEmployeur = salaireBrut * (chargesSociales.cnpsEmployeur / 100);
    const autresCharges = salaireBrut * (chargesSociales.autresTaxes / 100);
    
    return { cnpsEmploye, cnpsEmployeur, autresCharges };
  };

  const addEmployee = () => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      nom: '',
      prenom: '',
      poste: '',
      typeContrat: 'CDI',
      salaireBrut: 0,
      heuresParMois: 173,
      tauxHoraire: 0,
      cnpsEmploye: 0,
      cnpsEmployeur: 0,
      autresCharges: 0
    };
    const updated = [...employees, newEmployee];
    setEmployees(updated);
    updatePayrollData({ employees: updated });
  };

  const removeEmployee = (id: string) => {
    const updated = employees.filter(emp => emp.id !== id);
    setEmployees(updated);
    updatePayrollData({ employees: updated });
  };

  const updateEmployee = (id: string, field: keyof Employee, value: any) => {
    const updated = employees.map(emp => {
      if (emp.id === id) {
        const updatedEmp = { ...emp, [field]: value };
        
        // Recalculer les charges si le salaire ou le type de contrat change
        if (field === 'salaireBrut' || field === 'typeContrat') {
          const charges = calculateCharges(
            field === 'salaireBrut' ? value : updatedEmp.salaireBrut,
            field === 'typeContrat' ? value : updatedEmp.typeContrat
          );
          Object.assign(updatedEmp, charges);
        }
        
        // Pour les saisonniers, calculer le salaire en fonction du taux horaire
        if (field === 'tauxHoraire' && updatedEmp.typeContrat === 'Saisonnier') {
          updatedEmp.salaireBrut = value * updatedEmp.heuresParMois;
          const charges = calculateCharges(updatedEmp.salaireBrut, updatedEmp.typeContrat);
          Object.assign(updatedEmp, charges);
        }
        
        return updatedEmp;
      }
      return emp;
    });
    setEmployees(updated);
    updatePayrollData({ employees: updated });
  };

  const updateChargesSociales = (field: keyof typeof chargesSociales, value: number) => {
    const updated = { ...chargesSociales, [field]: value };
    setChargesSociales(updated);
    
    // Recalculer toutes les charges pour tous les employés
    const updatedEmployees = employees.map(emp => {
      const charges = calculateCharges(emp.salaireBrut, emp.typeContrat);
      return { ...emp, ...charges };
    });
    
    setEmployees(updatedEmployees);
    updatePayrollData({ 
      chargesSociales: updated, 
      employees: updatedEmployees 
    });
  };

  const getTotalMonthlySalary = () => {
    return employees.reduce((total, emp) => {
      return total + (emp.typeContrat === 'Saisonnier' ? emp.tauxHoraire * emp.heuresParMois : emp.salaireBrut);
    }, 0);
  };

  const getTotalMonthlyCharges = () => {
    return employees.reduce((total, emp) => {
      return total + emp.cnpsEmployeur + emp.autresCharges;
    }, 0);
  };

  const getTotalMonthlyCost = () => getTotalMonthlySalary() + getTotalMonthlyCharges();

  const getProjectionYear = (year: number) => {
    const inflation = Math.pow(1 + inflationAnnuelle / 100, year);
    return getTotalMonthlyCost() * 12 * inflation;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Masse Salariale - Agriculture Ivoirienne</h2>
        <p className="text-gray-600">Gérez vos employés et calculez les charges sociales selon la législation ivoirienne</p>
      </div>

      {/* Paramètres des charges sociales */}
      <Card className="bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Paramètres des Charges Sociales (CNPS Côte d'Ivoire)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label>CNPS Employeur (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={chargesSociales.cnpsEmployeur}
                onChange={(e) => updateChargesSociales('cnpsEmployeur', Number(e.target.value))}
                placeholder="16.3"
              />
            </div>
            <div>
              <Label>CNPS Employé (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={chargesSociales.cnpsEmploye}
                onChange={(e) => updateChargesSociales('cnpsEmploye', Number(e.target.value))}
                placeholder="3.2"
              />
            </div>
            <div>
              <Label>Autres Taxes (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={chargesSociales.autresTaxes}
                onChange={(e) => updateChargesSociales('autresTaxes', Number(e.target.value))}
                placeholder="5.0"
              />
            </div>
            <div>
              <Label>Inflation Annuelle (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={inflationAnnuelle}
                onChange={(e) => {
                  setInflationAnnuelle(Number(e.target.value));
                  updatePayrollData({ inflationAnnuelle: Number(e.target.value) });
                }}
                placeholder="3.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestion des employés */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Employés
          </CardTitle>
          <Button onClick={addEmployee} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un employé
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 font-semibold text-sm text-gray-600 border-b pb-2">
              <div className="col-span-1">Nom</div>
              <div className="col-span-1">Prénom</div>
              <div className="col-span-1">Poste</div>
              <div className="col-span-1">Contrat</div>
              <div className="col-span-1">Salaire/Taux</div>
              <div className="col-span-1">Heures</div>
              <div className="col-span-1">CNPS Emp.</div>
              <div className="col-span-1">CNPS Empl.</div>
              <div className="col-span-1">Autres</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-2">Actions</div>
            </div>
            
            {employees.map((employee) => (
              <div key={employee.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-1">
                  <Input
                    value={employee.nom}
                    onChange={(e) => updateEmployee(employee.id, 'nom', e.target.value)}
                    placeholder="Nom"
                    size="sm"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    value={employee.prenom}
                    onChange={(e) => updateEmployee(employee.id, 'prenom', e.target.value)}
                    placeholder="Prénom"
                    size="sm"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    value={employee.poste}
                    onChange={(e) => updateEmployee(employee.id, 'poste', e.target.value)}
                    placeholder="Poste"
                    size="sm"
                  />
                </div>
                <div className="col-span-1">
                  <Select
                    value={employee.typeContrat}
                    onValueChange={(value) => updateEmployee(employee.id, 'typeContrat', value)}
                  >
                    <SelectTrigger>
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
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={employee.typeContrat === 'Saisonnier' ? employee.tauxHoraire : employee.salaireBrut}
                    onChange={(e) => updateEmployee(
                      employee.id, 
                      employee.typeContrat === 'Saisonnier' ? 'tauxHoraire' : 'salaireBrut', 
                      Number(e.target.value)
                    )}
                    placeholder={employee.typeContrat === 'Saisonnier' ? "Taux/h" : "Salaire"}
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={employee.heuresParMois}
                    onChange={(e) => updateEmployee(employee.id, 'heuresParMois', Number(e.target.value))}
                    placeholder="173"
                    disabled={employee.typeContrat !== 'Saisonnier'}
                  />
                </div>
                <div className="col-span-1">
                  <div className="text-sm text-gray-600">
                    {formatCurrency(employee.cnpsEmploye)}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="text-sm text-gray-600">
                    {formatCurrency(employee.cnpsEmployeur)}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="text-sm text-gray-600">
                    {formatCurrency(employee.autresCharges)}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="text-sm font-bold text-blue-600">
                    {formatCurrency(
                      (employee.typeContrat === 'Saisonnier' ? 
                        employee.tauxHoraire * employee.heuresParMois : 
                        employee.salaireBrut) + 
                      employee.cnpsEmployeur + 
                      employee.autresCharges
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEmployee(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Résumé et projections */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="text-green-900">Résumé Mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total salaires bruts :</span>
                <span className="font-bold text-green-600">{formatCurrency(getTotalMonthlySalary())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total charges sociales :</span>
                <span className="font-bold text-orange-600">{formatCurrency(getTotalMonthlyCharges())}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-800 font-medium">Coût total mensuel :</span>
                <span className="font-bold text-purple-600">{formatCurrency(getTotalMonthlyCost())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800 font-medium">Coût total annuel :</span>
                <span className="font-bold text-blue-600">{formatCurrency(getTotalMonthlyCost() * 12)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="text-purple-900">Projections sur 3 ans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Année 1 :</span>
                <span className="font-bold text-blue-600">{formatCurrency(getProjectionYear(0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Année 2 :</span>
                <span className="font-bold text-green-600">{formatCurrency(getProjectionYear(1))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Année 3 :</span>
                <span className="font-bold text-purple-600">{formatCurrency(getProjectionYear(2))}</span>
              </div>
              <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note :</strong> Projections basées sur un taux d'inflation de {inflationAnnuelle}% par an
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MasseSalarialeSection;
