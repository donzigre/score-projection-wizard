
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, MapPin, Calculator, Sprout } from "lucide-react";
import { useParcelles } from '@/contexts/ParcellesContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';

const GestionParcellesCulturesSection = () => {
  const { parcelles, addParcelle, updateParcelle, removeParcelle, calculateParcelleMetrics, getTotalMetrics } = useParcelles();
  const { data, updateProduct, addProduct, removeProduct, assignProductToParcelle, calculateProductRevenue } = useFinancialData();
  
  const [newParcelleData, setNewParcelleData] = useState({
    nom: '',
    surface: 0,
    coutsPrepration: 0,
    coutsIntrants: 0,
    coutsMainOeuvre: 0,
    autresCouts: 0,
    rendementAttendu: 0
  });

  const handleAddParcelle = () => {
    if (newParcelleData.nom && newParcelleData.surface > 0) {
      addParcelle({
        ...newParcelleData,
        cultureId: null,
        statut: 'preparee',
        notes: ''
      });
      setNewParcelleData({
        nom: '',
        surface: 0,
        coutsPrepration: 0,
        coutsIntrants: 0,
        coutsMainOeuvre: 0,
        autresCouts: 0,
        rendementAttendu: 0
      });
    }
  };

  const handleAssignCulture = (parcelleId: string, cultureId: string) => {
    const selectedProduct = data.products.find(p => p.id === cultureId);
    if (selectedProduct) {
      assignProductToParcelle(cultureId, parcelleId);
      updateParcelle(parcelleId, { cultureId });
    }
  };

  const calculateCyclesParAn = (product: any) => {
    if (!product.cycleMonths) return 1;
    const cycleMonths = product.cycleMonths;
    const periodeRepos = product.periodeRepos || 0;
    return Math.floor(12 / (cycleMonths + periodeRepos));
  };

  const totalMetrics = getTotalMetrics();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion Intégrée Parcelles & Cultures</h2>
        <p className="text-gray-600">Gérez vos parcelles avec des cycles agricoles réalistes</p>
      </div>

      {/* Résumé Global */}
      <Card className="bg-gradient-to-r from-green-900 to-blue-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Résumé Global de l'Exploitation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-green-200 text-sm">Superficie Totale</p>
              <p className="text-2xl font-bold">{parcelles.reduce((sum, p) => sum + p.surface, 0).toFixed(1)} ha</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Parcelles Actives</p>
              <p className="text-2xl font-bold">{parcelles.filter(p => p.cultureId).length}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Revenus Annuels Estimés</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  data.products
                    .filter(p => p.parcelleId)
                    .reduce((sum, p) => sum + calculateProductRevenue(p.id), 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Marge Totale</p>
              <p className={`text-2xl font-bold ${totalMetrics.margeTotale >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {formatCurrency(totalMetrics.margeTotale)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ajout de nouvelle parcelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouvelle Parcelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label>Nom de la parcelle</Label>
              <Input
                value={newParcelleData.nom}
                onChange={(e) => setNewParcelleData(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="ex: Parcelle Nord"
              />
            </div>
            <div>
              <Label>Surface (hectares)</Label>
              <Input
                type="number"
                step="0.1"
                value={newParcelleData.surface || ''}
                onChange={(e) => setNewParcelleData(prev => ({ ...prev, surface: parseFloat(e.target.value) || 0 }))}
                placeholder="2.5"
              />
            </div>
            <div>
              <Label>Rendement attendu (tonnes/ha)</Label>
              <Input
                type="number"
                step="0.1"
                value={newParcelleData.rendementAttendu || ''}
                onChange={(e) => setNewParcelleData(prev => ({ ...prev, rendementAttendu: parseFloat(e.target.value) || 0 }))}
                placeholder="10"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddParcelle} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des parcelles avec cultures */}
      <div className="grid lg:grid-cols-2 gap-6">
        {parcelles.map((parcelle) => {
          const assignedProduct = data.products.find(p => p.parcelleId === parcelle.id);
          const cyclesParAn = assignedProduct ? calculateCyclesParAn(assignedProduct) : 0;
          const revenueAnnuel = assignedProduct ? calculateProductRevenue(assignedProduct.id) : 0;
          
          return (
            <Card key={parcelle.id} className={`border-l-4 ${assignedProduct ? 'border-l-green-500' : 'border-l-gray-300'}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">{parcelle.nom}</CardTitle>
                  {assignedProduct && <Sprout className="h-4 w-4 text-green-500" />}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeParcelle(parcelle.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Surface</Label>
                    <p className="font-medium">{parcelle.surface} hectares</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Statut</Label>
                    <p className="font-medium capitalize">{parcelle.statut.replace('_', ' ')}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-600">Culture assignée</Label>
                  <Select
                    value={assignedProduct?.id || ''}
                    onValueChange={(value) => handleAssignCulture(parcelle.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une culture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune culture</SelectItem>
                      {data.products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} {product.cycleMonths && `(${product.cycleMonths} mois)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {assignedProduct && (
                  <div className="bg-green-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-green-900">Détails de la Culture - {assignedProduct.name}</h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <Label className="text-gray-600">Cycle (mois)</Label>
                        <p className="font-medium">{assignedProduct.cycleMonths || 3}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Cycles/an</Label>
                        <p className="font-medium text-green-600">{cyclesParAn}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Rendement estimé</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={assignedProduct.rendementEstime || ''}
                          onChange={(e) => updateProduct(assignedProduct.id, { 
                            rendementEstime: parseFloat(e.target.value) || 0 
                          })}
                          placeholder="10 t/ha"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600">Rendement réel</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={assignedProduct.rendementReel || ''}
                          onChange={(e) => updateProduct(assignedProduct.id, { 
                            rendementReel: parseFloat(e.target.value) || 0 
                          })}
                          placeholder="Saisir réel"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600">Prix/tonne</Label>
                        <Input
                          type="number"
                          value={assignedProduct.pricePerUnit || ''}
                          onChange={(e) => updateProduct(assignedProduct.id, { 
                            pricePerUnit: parseFloat(e.target.value) || 0 
                          })}
                          placeholder="500000"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600">Revenus/an</Label>
                        <p className="font-medium text-green-600">{formatCurrency(revenueAnnuel)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {parcelles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune parcelle</h3>
            <p className="text-gray-600">Ajoutez votre première parcelle pour commencer à gérer votre exploitation agricole</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GestionParcellesCulturesSection;
