
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MapPin, Sprout, Calendar, Calculator, Settings, ChevronRight, ChevronLeft, Plus, Trash2, Info, Edit3, DollarSign, Tractor, Building } from "lucide-react";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useParcelles } from '@/contexts/ParcellesContext';
import { IVORY_COAST_CROPS, IVORY_COAST_REGIONS, AGRICULTURAL_SEASONS, CropType } from '@/config/ivoryCoastAgriculture';
import { formatCurrency } from '@/utils/formatting';
import { InfoCard } from '@/components/ui/InfoCard';

interface PlantationConfig {
  name: string;
  region: string;
  totalSurface: number;
  description: string;
}

interface CropAdjustments {
  [parcelleId: string]: {
    customYield?: number;
    customPrice?: number;
    customCosts?: {
      semences?: number;
      engrais?: number;
      pesticides?: number;
      mainOeuvre?: number;
      preparation?: number;
      autres?: number;
    };
  };
}

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const PointDepartAgricoleSection = () => {
  const { data, updateCompanyInfo, updateFixedAssets, updateFundingSources } = useFinancialData();
  const { parcelles, addParcelle, updateParcelle, removeParcelle, assignCultureToParcelle, getTotalMetrics } = useParcelles();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [plantationConfig, setPlantationConfig] = useState<PlantationConfig>({
    name: data.companyInfo.companyName || '',
    region: '',
    totalSurface: 0,
    description: ''
  });

  const [cropAdjustments, setCropAdjustments] = useState<CropAdjustments>({});
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [fundingNeeds, setFundingNeeds] = useState({
    totalCosts: 0,
    ownContribution: 0,
    loanAmount: 0,
    loanRate: 8,
    loanTerm: 5
  });

  const steps = [
    { id: 1, title: "Configuration Plantation", icon: Settings, color: "blue" },
    { id: 2, title: "Parcelles", icon: MapPin, color: "green" },
    { id: 3, title: "Cultures & Calendrier", icon: Sprout, color: "purple" },
    { id: 4, title: "Coûts de Démarrage", icon: Calculator, color: "orange" },
    { id: 5, title: "Équipements & Financement", icon: Settings, color: "red" }
  ];

  const progress = (currentStep / steps.length) * 100;

  const totalMetrics = getTotalMetrics();
  const totalParcellesSurface = parcelles.reduce((sum, p) => sum + p.surface, 0);

  const getAvailableCrops = () => {
    return IVORY_COAST_CROPS.filter(crop => 
      !plantationConfig.region || crop.bestRegions.includes(plantationConfig.region) || crop.bestRegions.includes('Toutes régions')
    );
  };

  const getCropsByCategory = (category: string) => {
    return getAvailableCrops().filter(crop => crop.category === category);
  };

  const calculateCropProfitability = (crop: CropType, surface: number, parcelleId: string) => {
    const adjustments = cropAdjustments[parcelleId] || {};
    
    const customYield = adjustments.customYield ?? crop.averageYieldPerHectare;
    const customPrice = adjustments.customPrice ?? crop.regionalPrices.average;
    
    const totalProduction = customYield * surface;
    const revenue = totalProduction * customPrice;
    
    const baseCosts = crop.productionCosts;
    const customCosts = adjustments.customCosts || {};
    
    const totalCosts = (
      (customCosts.semences ?? baseCosts.semences) +
      (customCosts.engrais ?? baseCosts.engrais) +
      (customCosts.pesticides ?? baseCosts.pesticides) +
      (customCosts.mainOeuvre ?? baseCosts.mainOeuvre) +
      (customCosts.preparation ?? 0) +
      (customCosts.autres ?? 0)
    ) * surface;
    
    const profit = revenue - totalCosts;
    const profitability = totalCosts > 0 ? (profit / totalCosts) * 100 : 0;
    
    return { revenue, totalCosts, profit, profitability, totalProduction, customYield, customPrice };
  };

  const updateCropAdjustment = (parcelleId: string, field: string, value: number) => {
    setCropAdjustments(prev => ({
      ...prev,
      [parcelleId]: {
        ...prev[parcelleId],
        [field]: value
      }
    }));
  };

  const updateCropCostAdjustment = (parcelleId: string, costType: string, value: number) => {
    setCropAdjustments(prev => ({
      ...prev,
      [parcelleId]: {
        ...prev[parcelleId],
        customCosts: {
          ...prev[parcelleId]?.customCosts,
          [costType]: value
        }
      }
    }));
  };

  const addEquipmentItem = () => {
    const newItem: EquipmentItem = {
      id: Date.now().toString(),
      name: 'Nouvel équipement',
      category: 'Équipement agricole',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    };
    setEquipment(prev => [...prev, newItem]);
  };

  const updateEquipmentItem = (id: string, field: keyof EquipmentItem, value: any) => {
    setEquipment(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const removeEquipmentItem = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, 5));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  const StepNavigation = () => (
    <div className="flex justify-between items-center mb-6">
      <Button 
        variant="outline" 
        onClick={prevStep} 
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Précédent
      </Button>
      
      <div className="flex space-x-2">
        {steps.map((step) => (
          <Button
            key={step.id}
            variant={currentStep === step.id ? "default" : currentStep > step.id ? "secondary" : "outline"}
            size="sm"
            onClick={() => setCurrentStep(step.id)}
            className="flex items-center gap-2"
          >
            <step.icon className="h-4 w-4" />
            {step.id}
          </Button>
        ))}
      </div>

      <Button 
        onClick={nextStep} 
        disabled={currentStep === 5}
        className="flex items-center gap-2"
      >
        Suivant
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Point de Départ - Agriculture Ivoirienne</h2>
        <p className="text-gray-600">Configuration complète de votre exploitation agricole en 5 étapes</p>
        <div className="mt-4">
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Étape {currentStep} sur {steps.length}</p>
        </div>
      </div>

      <StepNavigation />

      {/* Étape 1: Configuration de la Plantation */}
      {currentStep === 1 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Configuration de la Plantation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plantation-name">Nom de la Plantation *</Label>
                <Input
                  id="plantation-name"
                  value={plantationConfig.name}
                  onChange={(e) => setPlantationConfig({...plantationConfig, name: e.target.value})}
                  placeholder="Ex: Plantation KOUADIO"
                />
              </div>

              <div>
                <Label htmlFor="region">Région *</Label>
                <Select
                  value={plantationConfig.region}
                  onValueChange={(value) => setPlantationConfig({...plantationConfig, region: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {IVORY_COAST_REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="total-surface">Superficie Totale (ha) *</Label>
                <Input
                  id="total-surface"
                  type="number"
                  step="0.1"
                  value={plantationConfig.totalSurface}
                  onChange={(e) => setPlantationConfig({...plantationConfig, totalSurface: Number(e.target.value)})}
                  placeholder="0.0"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={plantationConfig.description}
                  onChange={(e) => setPlantationConfig({...plantationConfig, description: e.target.value})}
                  placeholder="Description de votre plantation"
                />
              </div>

              <Button 
                onClick={() => {
                  updateCompanyInfo({ companyName: plantationConfig.name });
                  nextStep();
                }}
                disabled={!plantationConfig.name || !plantationConfig.region || !plantationConfig.totalSurface}
                className="w-full"
              >
                Configurer les Parcelles
              </Button>
            </CardContent>
          </Card>

          <InfoCard 
            title="Guide de Configuration"
            content={
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>🏗️ Nom :</strong> Choisissez un nom pour identifier votre exploitation</p>
                <p><strong>📍 Région :</strong> Détermine les cultures adaptées et les prix du marché</p>
                <p><strong>📏 Superficie :</strong> Surface totale disponible pour les cultures</p>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="font-medium text-blue-900">💡 Conseil :</p>
                  <p className="text-blue-800">Commencez par une superficie réaliste. Vous pourrez toujours l'étendre plus tard.</p>
                </div>
              </div>
            }
          />
        </div>
      )}

      {/* Étape 2: Gestion des Parcelles */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Mes Parcelles ({parcelles.length})
                </CardTitle>
                <Button 
                  onClick={() => addParcelle({
                    nom: `Parcelle ${parcelles.length + 1}`,
                    surface: 1,
                    cultureId: null,
                    coutsPrepration: 0,
                    coutsIntrants: 0,
                    coutsMainOeuvre: 0,
                    autresCouts: 0,
                    rendementAttendu: 0,
                    statut: 'preparee'
                  })}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parcelles.map((parcelle) => (
                    <div key={parcelle.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <Input
                          value={parcelle.nom}
                          onChange={(e) => updateParcelle(parcelle.id, { nom: e.target.value })}
                          className="font-medium mr-2"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeParcelle(parcelle.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Surface (ha)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={parcelle.surface}
                            onChange={(e) => updateParcelle(parcelle.id, { surface: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Statut</Label>
                          <Select
                            value={parcelle.statut}
                            onValueChange={(value) => updateParcelle(parcelle.id, { statut: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="preparee">Préparée</SelectItem>
                              <SelectItem value="plantee">Plantée</SelectItem>
                              <SelectItem value="en_croissance">En croissance</SelectItem>
                              <SelectItem value="recoltee">Récoltée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Culture assignée</Label>
                        <Select
                          value={parcelle.cultureId || ""}
                          onValueChange={(value) => assignCultureToParcelle(parcelle.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une culture" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Aucune culture</SelectItem>
                            {getAvailableCrops().map((crop) => (
                              <SelectItem key={crop.id} value={crop.id}>
                                {crop.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}

                  {parcelles.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune parcelle créée</p>
                      <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-green-900">Résumé des Parcelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre de parcelles :</span>
                    <span className="font-bold">{parcelles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surface utilisée :</span>
                    <span className="font-bold">{totalParcellesSurface.toFixed(1)} ha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surface disponible :</span>
                    <span className="font-bold">{(plantationConfig.totalSurface - totalParcellesSurface).toFixed(1)} ha</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-medium">Taux d'utilisation :</span>
                    <span className="font-bold text-green-600">
                      {plantationConfig.totalSurface > 0 ? ((totalParcellesSurface / plantationConfig.totalSurface) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Étape 3: Cultures et Calendrier */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-purple-600" />
                Sélection des Cultures par Parcelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="maraichage" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="maraichage">Maraîchage</TabsTrigger>
                  <TabsTrigger value="vivrier">Vivrier</TabsTrigger>
                  <TabsTrigger value="tubercule">Tubercules</TabsTrigger>
                  <TabsTrigger value="legumineuse">Légumineuses</TabsTrigger>
                </TabsList>

                {(['maraichage', 'vivrier', 'tubercule', 'legumineuse'] as const).map((category) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getCropsByCategory(category).map((crop) => (
                        <Card key={crop.id} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{crop.name}</h4>
                              <Badge variant="outline">{crop.cycleMonths} mois</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{crop.description}</p>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Rendement:</span>
                                <span>{crop.averageYieldPerHectare.toLocaleString()} {crop.unitType}/ha</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Prix moyen:</span>
                                <span>{formatCurrency(crop.regionalPrices.average)}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <Label className="text-xs">Assigner à une parcelle</Label>
                              <Select
                                onValueChange={(parcelleId) => assignCultureToParcelle(parcelleId, crop.id)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Choisir parcelle" />
                                </SelectTrigger>
                                <SelectContent>
                                  {parcelles.map((parcelle) => (
                                    <SelectItem key={parcelle.id} value={parcelle.id}>
                                      {parcelle.nom} ({parcelle.surface} ha)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Section d'ajustement des rendements et prix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-600" />
                Ajustements Personnalisés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parcelles.filter(p => p.cultureId).map((parcelle) => {
                  const assignedCrop = IVORY_COAST_CROPS.find(c => c.id === parcelle.cultureId);
                  if (!assignedCrop) return null;

                  const adjustments = cropAdjustments[parcelle.id] || {};

                  return (
                    <div key={parcelle.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">{parcelle.nom} - {assignedCrop.name}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Rendement personnalisé ({assignedCrop.unitType}/ha)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder={assignedCrop.averageYieldPerHectare.toString()}
                            value={adjustments.customYield || ''}
                            onChange={(e) => updateCropAdjustment(parcelle.id, 'customYield', Number(e.target.value))}
                          />
                          <p className="text-xs text-gray-500 mt-1">Défaut: {assignedCrop.averageYieldPerHectare} {assignedCrop.unitType}/ha</p>
                        </div>
                        <div>
                          <Label className="text-sm">Prix personnalisé (FCFA/{assignedCrop.unitType})</Label>
                          <Input
                            type="number"
                            placeholder={assignedCrop.regionalPrices.average.toString()}
                            value={adjustments.customPrice || ''}
                            onChange={(e) => updateCropAdjustment(parcelle.id, 'customPrice', Number(e.target.value))}
                          />
                          <p className="text-xs text-gray-500 mt-1">Défaut: {formatCurrency(assignedCrop.regionalPrices.average)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Étape 4: Coûts de Démarrage */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-600" />
                Calcul Automatique des Coûts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {parcelles.map((parcelle) => {
                  const assignedCrop = IVORY_COAST_CROPS.find(c => c.id === parcelle.cultureId);
                  if (!assignedCrop) return null;

                  const profitability = calculateCropProfitability(assignedCrop, parcelle.surface, parcelle.id);
                  const adjustments = cropAdjustments[parcelle.id] || {};
                  const customCosts = adjustments.customCosts || {};

                  return (
                    <div key={parcelle.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">{parcelle.nom} - {assignedCrop.name}</h4>
                        <Badge variant="secondary">{parcelle.surface} ha</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Coûts de Production (Ajustables)
                          </h5>
                          <div className="space-y-3">
                            {Object.entries(assignedCrop.productionCosts).map(([costType, defaultValue]) => (
                              <div key={costType} className="grid grid-cols-2 gap-2 items-center">
                                <Label className="text-sm capitalize">{costType}:</Label>
                                <Input
                                  type="number"
                                  placeholder={(defaultValue * parcelle.surface).toString()}
                                  value={customCosts[costType as keyof typeof customCosts] ? (customCosts[costType as keyof typeof customCosts]! * parcelle.surface) : ''}
                                  onChange={(e) => updateCropCostAdjustment(parcelle.id, costType, Number(e.target.value) / parcelle.surface)}
                                  className="h-8"
                                />
                              </div>
                            ))}
                            
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <Label className="text-sm">Préparation:</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={customCosts.preparation ? (customCosts.preparation * parcelle.surface) : ''}
                                onChange={(e) => updateCropCostAdjustment(parcelle.id, 'preparation', Number(e.target.value) / parcelle.surface)}
                                className="h-8"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 items-center">
                              <Label className="text-sm">Autres:</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={customCosts.autres ? (customCosts.autres * parcelle.surface) : ''}
                                onChange={(e) => updateCropCostAdjustment(parcelle.id, 'autres', Number(e.target.value) / parcelle.surface)}
                                className="h-8"
                              />
                            </div>
                            
                            <div className="flex justify-between border-t pt-2 font-medium">
                              <span>Total:</span>
                              <span>{formatCurrency(profitability.totalCosts)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-3">Revenus Attendus</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Production estimée:</span>
                              <span>{profitability.totalProduction.toLocaleString()} {assignedCrop.unitType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rendement utilisé:</span>
                              <span>{profitability.customYield} {assignedCrop.unitType}/ha</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Prix utilisé:</span>
                              <span>{formatCurrency(profitability.customPrice)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 font-medium">
                              <span>Revenus totaux:</span>
                              <span className="text-green-600">{formatCurrency(profitability.revenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Marge nette:</span>
                              <span className={profitability.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatCurrency(profitability.profit)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rentabilité:</span>
                              <span className={profitability.profitability >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {profitability.profitability.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {parcelles.filter(p => p.cultureId).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Info className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Assignez des cultures à vos parcelles pour voir les calculs</p>
                    <Button variant="outline" onClick={() => setCurrentStep(3)} className="mt-2">
                      Retour aux Cultures
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="text-orange-900">Résumé Financier Global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-orange-600 text-sm">Coûts Totaux</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalMetrics.coutsTotaux)}</p>
                </div>
                <div className="text-center">
                  <p className="text-green-600 text-sm">Revenus Attendus</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalMetrics.revenus)}</p>
                </div>
                <div className="text-center">
                  <p className="text-purple-600 text-sm">Marge Nette</p>
                  <p className={`text-2xl font-bold ${totalMetrics.margeTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalMetrics.margeTotale)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Étape 5: Équipements et Financement */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Tractor className="h-5 w-5 text-red-600" />
                Équipements Nécessaires
              </CardTitle>
              <Button onClick={addEquipmentItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-600 border-b pb-2">
                  <div className="col-span-4">Équipement</div>
                  <div className="col-span-3">Catégorie</div>
                  <div className="col-span-1">Qté</div>
                  <div className="col-span-2">Prix unitaire</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1">Actions</div>
                </div>
                
                {equipment.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <Input
                        value={item.name}
                        onChange={(e) => updateEquipmentItem(item.id, 'name', e.target.value)}
                        placeholder="Nom de l'équipement"
                      />
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={item.category}
                        onValueChange={(value) => updateEquipmentItem(item.id, 'category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Équipement agricole">Équipement agricole</SelectItem>
                          <SelectItem value="Outils manuels">Outils manuels</SelectItem>
                          <SelectItem value="Irrigation">Irrigation</SelectItem>
                          <SelectItem value="Transport">Transport</SelectItem>
                          <SelectItem value="Stockage">Stockage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateEquipmentItem(item.id, 'quantity', Number(e.target.value))}
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateEquipmentItem(item.id, 'unitPrice', Number(e.target.value))}
                        placeholder="Prix FCFA"
                      />
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm font-medium">{formatCurrency(item.totalPrice)}</span>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEquipmentItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {equipment.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Tractor className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun équipement ajouté</p>
                    <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Plan de Financement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-4">Besoins de Financement</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Coûts de production:</span>
                      <span className="font-medium">{formatCurrency(totalMetrics.coutsTotaux)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Équipements:</span>
                      <span className="font-medium">{formatCurrency(equipment.reduce((sum, item) => sum + item.totalPrice, 0))}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total besoins:</span>
                      <span className="text-red-600">{formatCurrency(totalMetrics.coutsTotaux + equipment.reduce((sum, item) => sum + item.totalPrice, 0))}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-4">Sources de Financement</h5>
                  <div className="space-y-3">
                    <div>
                      <Label>Apport personnel (FCFA)</Label>
                      <Input
                        type="number"
                        value={fundingNeeds.ownContribution}
                        onChange={(e) => setFundingNeeds({...fundingNeeds, ownContribution: Number(e.target.value)})}
                        placeholder="Votre contribution"
                      />
                    </div>
                    <div>
                      <Label>Montant du prêt nécessaire</Label>
                      <Input
                        type="number"
                        value={fundingNeeds.loanAmount}
                        onChange={(e) => setFundingNeeds({...fundingNeeds, loanAmount: Number(e.target.value)})}
                        placeholder="Prêt bancaire"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Taux (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={fundingNeeds.loanRate}
                          onChange={(e) => setFundingNeeds({...fundingNeeds, loanRate: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label>Durée (ans)</Label>
                        <Input
                          type="number"
                          value={fundingNeeds.loanTerm}
                          onChange={(e) => setFundingNeeds({...fundingNeeds, loanTerm: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  className="w-full"
                  onClick={() => {
                    // Ici on peut intégrer avec le système existant
                    console.log('Configuration terminée', {
                      plantation: plantationConfig,
                      parcelles,
                      equipment,
                      funding: fundingNeeds
                    });
                  }}
                >
                  Finaliser la Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <StepNavigation />
    </div>
  );
};

export default PointDepartAgricoleSection;
