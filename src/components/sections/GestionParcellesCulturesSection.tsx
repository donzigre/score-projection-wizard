import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, MapPin, Calculator, Sprout, Leaf, Wheat, Info } from "lucide-react";
import { useParcelles } from '@/contexts/ParcellesContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { IVORY_COAST_CROPS, CropType } from '@/config/ivoryCoastAgriculture';

const GestionParcellesCulturesSection = () => {
  const { parcelles, addParcelle, updateParcelle, removeParcelle, calculateParcelleMetrics, getTotalMetrics, getAllCrops } = useParcelles();
  const { data, updateProduct, addProduct, removeProduct, assignProductToParcelle, calculateProductRevenue } = useFinancialData();
  
  const [selectedCropType, setSelectedCropType] = useState<'all' | 'maraichage' | 'vivrier' | 'tubercule' | 'legumineuse'>('all');
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

  // Calcul automatique du coût de production par unité
  const calculateAutomaticCOGS = (parcelle: any, crop: CropType) => {
    const totalCosts = parcelle.coutsPrepration + parcelle.coutsIntrants + 
                      parcelle.coutsMainOeuvre + parcelle.autresCouts;
    const estimatedProduction = crop.averageYieldPerHectare * parcelle.surface;
    const cyclesPerYear = Math.floor(12 / (crop.cycleMonths + (crop.cycleMonths * 0.2))); // Période de repos 20%
    const totalAnnualProduction = estimatedProduction * cyclesPerYear;
    
    return totalAnnualProduction > 0 ? totalCosts / totalAnnualProduction : crop.averageCostPerUnit;
  };

  // Calcul automatique du rendement estimé
  const calculateEstimatedYield = (crop: CropType, surface: number) => {
    return crop.averageYieldPerHectare * surface;
  };

  const handleAssignCulture = (parcelleId: string, cropId: string) => {
    const allCrops = getAllCrops();
    const selectedCrop = allCrops.find(c => c.id === cropId);
    const parcelle = parcelles.find(p => p.id === parcelleId);
    
    if (selectedCrop && parcelle) {
      // Trouver ou créer un produit pour cette culture
      let product = data.products.find(p => p.cropId === cropId && !p.parcelleId);
      
      if (!product) {
        // Créer un nouveau produit
        addProduct();
        // Attendre que le produit soit créé
        setTimeout(() => {
          const newProduct = data.products[data.products.length - 1];
          if (newProduct) {
            const estimatedYield = calculateEstimatedYield(selectedCrop, parcelle.surface);
            const automaticCOGS = calculateAutomaticCOGS(parcelle, selectedCrop);
            
            updateProduct(newProduct.id, {
              name: selectedCrop.name,
              cropId: selectedCrop.id,
              parcelleId: parcelleId,
              pricePerUnit: selectedCrop.averagePricePerUnit,
              cogsPerUnit: automaticCOGS,
              cropType: selectedCrop.category as 'maraichage' | 'vivrier',
              unit: selectedCrop.unitType,
              cycleMonths: selectedCrop.cycleMonths,
              periodeRepos: Math.floor(selectedCrop.cycleMonths * 0.2),
              rendementEstime: estimatedYield,
              rendementReel: 0,
              unitsPerMonth: Math.floor(estimatedYield / selectedCrop.cycleMonths)
            });
          }
        }, 100);
      } else {
        // Assigner la parcelle au produit existant
        const estimatedYield = calculateEstimatedYield(selectedCrop, parcelle.surface);
        const automaticCOGS = calculateAutomaticCOGS(parcelle, selectedCrop);
        
        updateProduct(product.id, {
          parcelleId: parcelleId,
          rendementEstime: estimatedYield,
          cogsPerUnit: automaticCOGS,
          unitsPerMonth: Math.floor(estimatedYield / selectedCrop.cycleMonths)
        });
      }
      
      // Mettre à jour la parcelle
      updateParcelle(parcelleId, { 
        cultureId: cropId,
        rendementAttendu: calculateEstimatedYield(selectedCrop, parcelle.surface)
      });
    }
  };

  const handleParcelleUpdate = (parcelleId: string, field: string, value: number) => {
    updateParcelle(parcelleId, { [field]: value });
    
    // Recalculer automatiquement le COGS si une culture est assignée
    const parcelle = parcelles.find(p => p.id === parcelleId);
    const assignedProduct = data.products.find(p => p.parcelleId === parcelleId);
    
    if (parcelle && assignedProduct && assignedProduct.cropId) {
      const allCrops = getAllCrops();
      const crop = allCrops.find(c => c.id === assignedProduct.cropId);
      if (crop) {
        const newCOGS = calculateAutomaticCOGS({...parcelle, [field]: value}, crop);
        updateProduct(assignedProduct.id, { cogsPerUnit: newCOGS });
      }
    }
  };

  const calculateCyclesParAn = (product: any) => {
    if (!product.cycleMonths) return 1;
    const cycleMonths = product.cycleMonths;
    const periodeRepos = product.periodeRepos || Math.floor(cycleMonths * 0.2);
    return Math.floor(12 / (cycleMonths + periodeRepos));
  };

  // Filtrer les cultures selon le type sélectionné
  const allCrops = getAllCrops();
  const filteredCrops = selectedCropType === 'all' 
    ? allCrops 
    : allCrops.filter(crop => crop.category === selectedCropType);

  const totalMetrics = getTotalMetrics();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion Intégrée Parcelles & Cultures</h2>
        <p className="text-gray-600">Gérez vos parcelles avec des cycles agricoles réalistes et calculs automatiques</p>
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
              <Label>Coûts préparation (FCFA)</Label>
              <Input
                type="number"
                value={newParcelleData.coutsPrepration || ''}
                onChange={(e) => setNewParcelleData(prev => ({ ...prev, coutsPrepration: parseFloat(e.target.value) || 0 }))}
                placeholder="100000"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddParcelle} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label>Coûts intrants (FCFA)</Label>
              <Input
                type="number"
                value={newParcelleData.coutsIntrants || ''}
                onChange={(e) => setNewParcelleData(prev => ({ ...prev, coutsIntrants: parseFloat(e.target.value) || 0 }))}
                placeholder="50000"
              />
            </div>
            <div>
              <Label>Coûts main-d'œuvre (FCFA)</Label>
              <Input
                type="number"
                value={newParcelleData.coutsMainOeuvre || ''}
                onChange={(e) => setNewParcelleData(prev => ({ ...prev, coutsMainOeuvre: parseFloat(e.target.value) || 0 }))}
                placeholder="80000"
              />
            </div>
            <div>
              <Label>Autres coûts (FCFA)</Label>
              <Input
                type="number"
                value={newParcelleData.autresCouts || ''}
                onChange={(e) => setNewParcelleData(prev => ({ ...prev, autresCouts: parseFloat(e.target.value) || 0 }))}
                placeholder="20000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélecteur de type de culture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5" />
            Cultures Disponibles par Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Filtrer par type de culture</Label>
            <Select value={selectedCropType} onValueChange={(value: any) => setSelectedCropType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-4 w-4" />
                    Toutes les cultures
                  </div>
                </SelectItem>
                <SelectItem value="maraichage">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Maraîchage (cycles courts)
                  </div>
                </SelectItem>
                <SelectItem value="vivrier">
                  <div className="flex items-center gap-2">
                    <Wheat className="h-4 w-4 text-amber-600" />
                    Vivrier (cycles longs)
                  </div>
                </SelectItem>
                <SelectItem value="tubercule">
                  <div className="flex items-center gap-2">
                    <Wheat className="h-4 w-4 text-orange-600" />
                    Tubercules
                  </div>
                </SelectItem>
                <SelectItem value="legumineuse">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-purple-600" />
                    Légumineuses
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Données basées sur CNRA/ANADER</span>
            </div>
            <p>Les rendements et coûts sont automatiquement calculés selon les données officielles ivoiriennes. Vous pouvez les modifier selon votre expérience locale.</p>
          </div>
        </CardContent>
      </Card>

      {/* Liste des parcelles avec cultures */}
      <div className="grid lg:grid-cols-2 gap-6">
        {parcelles.map((parcelle) => {
          const assignedProduct = data.products.find(p => p.parcelleId === parcelle.id);
          const assignedCrop = assignedProduct?.cropId ? IVORY_COAST_CROPS.find(c => c.id === assignedProduct.cropId) : null;
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

                {/* Coûts de la parcelle */}
                <div className="bg-orange-50 p-3 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Coûts de Production</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <Label className="text-gray-600">Préparation</Label>
                      <Input
                        type="number"
                        value={parcelle.coutsPrepration || ''}
                        onChange={(e) => handleParcelleUpdate(parcelle.id, 'coutsPrepration', parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Intrants</Label>
                      <Input
                        type="number"
                        value={parcelle.coutsIntrants || ''}
                        onChange={(e) => handleParcelleUpdate(parcelle.id, 'coutsIntrants', parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Main-d'œuvre</Label>
                      <Input
                        type="number"
                        value={parcelle.coutsMainOeuvre || ''}
                        onChange={(e) => handleParcelleUpdate(parcelle.id, 'coutsMainOeuvre', parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-600">Autres</Label>
                      <Input
                        type="number"
                        value={parcelle.autresCouts || ''}
                        onChange={(e) => handleParcelleUpdate(parcelle.id, 'autresCouts', parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-orange-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total coûts :</span>
                      <span className="font-medium text-orange-600">
                        {formatCurrency(parcelle.coutsPrepration + parcelle.coutsIntrants + parcelle.coutsMainOeuvre + parcelle.autresCouts)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-600">Culture assignée</Label>
                  <Select
                    value={assignedProduct?.cropId || ''}
                    onValueChange={(value) => handleAssignCulture(parcelle.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une culture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune culture</SelectItem>
                      {filteredCrops.map((crop) => (
                        <SelectItem key={crop.id} value={crop.id}>
                          <div className="flex items-center gap-2">
                            {crop.category === 'maraichage' ? 
                              <Leaf className="h-3 w-3 text-green-600" /> : 
                              <Wheat className="h-3 w-3 text-amber-600" />
                            }
                            {crop.name} ({crop.cycleMonths} mois)
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {assignedProduct && assignedCrop && (
                  <div className="bg-green-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium text-green-900 flex items-center gap-2">
                      {assignedCrop.category === 'maraichage' ? 
                        <Leaf className="h-4 w-4" /> : 
                        <Wheat className="h-4 w-4" />
                      }
                      {assignedProduct.name}
                    </h4>
                    
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
                        <Label className="text-gray-600">
                          Rendement estimé (auto)
                          <Info className="h-3 w-3 inline ml-1 text-blue-500" />
                        </Label>
                        <p className="font-medium text-blue-600">
                          {assignedProduct.rendementEstime?.toFixed(1) || 0} tonnes
                        </p>
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
                          placeholder={assignedCrop.averagePricePerUnit.toString()}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-600">
                          Coût/tonne (auto)
                          <Info className="h-3 w-3 inline ml-1 text-blue-500" />
                        </Label>
                        <p className="font-medium text-orange-600">
                          {formatCurrency(assignedProduct.cogsPerUnit || 0)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-green-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Revenus annuels :</span>
                        <span className="font-medium text-green-600">{formatCurrency(revenueAnnuel)}</span>
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
