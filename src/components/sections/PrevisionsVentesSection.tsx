import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Sprout, Building2, Leaf, TrendingUp, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { usePlantations } from '@/contexts/PlantationsContext';
import { IVORY_COAST_CROPS } from '@/config/ivoryCoastAgriculture';
import { formatCurrency } from '@/utils/formatting';

const PrevisionsVentesSection = () => {
  const { data, updateProduct, addProduct, removeProduct } = useFinancialData();
  const { plantations, parcelles, getAllCrops, calculatePlantationMetrics } = usePlantations();
  const [selectedPlantation, setSelectedPlantation] = useState<string>('all');

  const allCrops = getAllCrops();

  // Auto-populate product data when parcelle or crop is selected
  const autoPopulateProductData = (productId: string, parcelleId: string | null, cropId: string | null) => {
    if (!parcelleId || !cropId) return;

    const parcelle = parcelles.find(p => p.id === parcelleId);
    const crop = allCrops.find(c => c.id === cropId);
    
    if (parcelle && crop) {
      const updates: any = {
        parcelleId,
        cropId,
        unit: crop.unitType,
        cycleMonths: crop.cycleMonths,
        periodeRepos: 0, // Default rest period
        rendementEstime: crop.averageYieldPerHectare * parcelle.surface,
        pricePerUnit: crop.regionalPrices.average,
        cogsPerUnit: Object.values(crop.productionCosts).reduce((sum, cost) => sum + cost, 0) / crop.averageYieldPerHectare
      };

      // Auto-populate name if empty
      const currentProduct = data.products.find(p => p.id === productId);
      if (currentProduct && !currentProduct.name.trim()) {
        updates.name = `${crop.name} - ${parcelle.nom}`;
      }

      updateProduct(productId, updates);
    }
  };

  const calculateCyclesPerYear = (cycleMonths: number, reposPeriod: number) => {
    return Math.floor(12 / (cycleMonths + reposPeriod));
  };

  const calculateAnnualProduction = (product: any) => {
    return (product.rendementReel || product.rendementEstime || 0) * calculateCyclesPerYear(product.cycleMonths || 3, product.periodeRepos || 0);
  };

  const calculateAnnualRevenue = (product: any) => {
    return calculateAnnualProduction(product) * product.pricePerUnit;
  };

  const calculateGrossMargin = (product: any) => {
    return calculateAnnualRevenue(product) - (calculateAnnualProduction(product) * product.cogsPerUnit);
  };

  const calculateTotalRevenue = () => {
    return data.products.reduce((acc, product) => acc + calculateAnnualRevenue(product), 0);
  };

  const calculateTotalCosts = () => {
    return data.products.reduce((acc, product) => acc + (calculateAnnualProduction(product) * product.cogsPerUnit), 0);
  };

  const calculateTotalGrossMargin = () => {
    return data.products.reduce((acc, product) => acc + calculateGrossMargin(product), 0);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  // Filtrer les parcelles selon la plantation sélectionnée
  const filteredParcelles = selectedPlantation === 'all' 
    ? parcelles 
    : parcelles.filter(p => p.plantationId === selectedPlantation);

  // Calculs par plantation
  const getPlantationAnalytics = () => {
    return plantations.map(plantation => {
      const plantationParcelles = parcelles.filter(p => p.plantationId === plantation.id);
      const metrics = calculatePlantationMetrics(plantation.id);
      const plantationProducts = data.products.filter(p => 
        plantationParcelles.some(parcelle => parcelle.id === p.parcelleId)
      );
      
      const productionTotal = plantationProducts.reduce((acc, product) => 
        acc + calculateAnnualProduction(product), 0
      );
      
      const revenueTotal = plantationProducts.reduce((acc, product) => 
        acc + calculateAnnualRevenue(product), 0
      );

      return {
        plantation,
        parcelles: plantationParcelles,
        metrics,
        products: plantationProducts,
        productionTotal,
        revenueTotal
      };
    });
  };

  const plantationAnalytics = getPlantationAnalytics();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Prévisions de Ventes Basées sur les Plantations</h2>
        <p className="text-gray-600">Analysez et configurez vos prévisions de vente par plantation et parcelle</p>
      </div>

      {/* Vue d'ensemble par plantation */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Analyse par Plantation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {plantationAnalytics.map(({ plantation, parcelles: plantationParcelles, metrics, revenueTotal }) => (
              <Card key={plantation.id} className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">{plantation.nom}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parcelles:</span>
                      <span className="font-medium">{plantationParcelles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surface totale:</span>
                      <span className="font-medium">{metrics.surfaceTotale.toFixed(1)} ha</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CA prévisionnel:</span>
                      <span className="font-medium text-green-600">{formatCurrency(revenueTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rentabilité:</span>
                      <span className={`font-medium ${metrics.rentabilite >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.rentabilite.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filtre par plantation */}
          <div className="mb-4">
            <Label htmlFor="plantation-filter" className="text-sm font-medium text-gray-700 mb-2 block">
              Filtrer par plantation (optionnel)
            </Label>
            <Select value={selectedPlantation} onValueChange={setSelectedPlantation}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Toutes les plantations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les plantations</SelectItem>
                {plantations.map(plantation => (
                  <SelectItem key={plantation.id} value={plantation.id}>
                    {plantation.nom} ({parcelles.filter(p => p.plantationId === plantation.id).length} parcelles)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      <div className="grid gap-6">
        {data.products.map((product, index) => {
          const assignedParcelle = filteredParcelles.find(p => p.id === product.parcelleId);
          const assignedPlantation = assignedParcelle ? plantations.find(pl => pl.id === assignedParcelle.plantationId) : null;
          const selectedCrop = product.cropId ? allCrops.find(c => c.id === product.cropId) : null;
          
          // Ne pas afficher si filtré par plantation et que le produit n'appartient pas à cette plantation
          if (selectedPlantation !== 'all' && (!assignedParcelle || assignedParcelle.plantationId !== selectedPlantation)) {
            return null;
          }
          
          return (
            <Card key={product.id} className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-green-900 flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Produit {index + 1}: {product.name || 'Nouveau Produit'}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Informations sur la plantation et parcelle */}
                {assignedPlantation && assignedParcelle && (
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Plantation: {assignedPlantation.nom}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      <strong>Parcelle:</strong> {assignedParcelle.nom} ({assignedParcelle.surface} ha)
                    </p>
                    {selectedCrop && (
                      <div className="flex items-center gap-2 mt-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          <strong>Culture:</strong> {selectedCrop.name} ({selectedCrop.category})
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`product-name-${product.id}`} className="text-sm font-medium text-gray-700">
                      Nom du Produit
                    </Label>
                    <Input
                      id={`product-name-${product.id}`}
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                      className="mt-1 bg-green-50 border-green-200 focus:border-green-500"
                      placeholder="ex: Tomates cerises"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`parcelle-select-${product.id}`} className="text-sm font-medium text-gray-700">
                      Parcelle Assignée
                    </Label>
                    <Select
                      value={product.parcelleId || 'none'}
                      onValueChange={(value) => {
                        const parcelleId = value === 'none' ? null : value;
                        const parcelle = parcelleId ? filteredParcelles.find(p => p.id === parcelleId) : null;
                        const cropId = parcelle?.cultureActuelle || null;
                        
                        updateProduct(product.id, { parcelleId });
                        
                        // Auto-populate data when parcelle is selected
                        if (parcelleId && cropId) {
                          autoPopulateProductData(product.id, parcelleId, cropId);
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1 bg-blue-50 border-blue-200">
                        <SelectValue placeholder="Sélectionner une parcelle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune parcelle assignée</SelectItem>
                        {filteredParcelles.map(parcelle => {
                          const plantation = plantations.find(p => p.id === parcelle.plantationId);
                          const culture = parcelle.cultureActuelle ? allCrops.find(c => c.id === parcelle.cultureActuelle) : null;
                          return (
                            <SelectItem key={parcelle.id} value={parcelle.id}>
                              {plantation?.nom} → {parcelle.nom} ({parcelle.surface} ha)
                              {culture && ` - ${culture.name}`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`crop-select-${product.id}`} className="text-sm font-medium text-gray-700">
                      Culture (optionnel si parcelle assignée)
                    </Label>
                    <Select
                      value={product.cropId || 'none'}
                      onValueChange={(value) => {
                        const cropId = value === 'none' ? null : value;
                        updateProduct(product.id, { cropId });
                        
                        // Auto-populate data when crop is selected
                        if (product.parcelleId && cropId) {
                          autoPopulateProductData(product.id, product.parcelleId, cropId);
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1 bg-green-50 border-green-200">
                        <SelectValue placeholder="Sélectionner une culture" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune culture spécifique</SelectItem>
                        {allCrops.map(crop => (
                          <SelectItem key={crop.id} value={crop.id}>
                            {crop.name} ({crop.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`product-unit-${product.id}`} className="text-sm font-medium text-gray-700">
                      Unité de Mesure
                    </Label>
                    <Select
                      value={product.unit || 'kg'}
                      onValueChange={(value) => updateProduct(product.id, { unit: value })}
                    >
                      <SelectTrigger className="mt-1 bg-green-50 border-green-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogrammes (kg)</SelectItem>
                        <SelectItem value="tonne">Tonnes</SelectItem>
                        <SelectItem value="sac">Sacs</SelectItem>
                        <SelectItem value="caisse">Caisses</SelectItem>
                        <SelectItem value="botte">Bottes</SelectItem>
                        <SelectItem value="pièce">Pièces</SelectItem>
                        <SelectItem value="cuvette">Cuvettes</SelectItem>
                        <SelectItem value="panier">Paniers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`price-per-unit-${product.id}`} className="text-sm font-medium text-gray-700">
                      Prix par {product.unit || 'kg'} (FCFA)
                    </Label>
                    <Input
                      id={`price-per-unit-${product.id}`}
                      type="number"
                      value={product.pricePerUnit}
                      onChange={(e) => updateProduct(product.id, { pricePerUnit: Number(e.target.value) })}
                      className="mt-1 bg-green-50 border-green-200 focus:border-green-500"
                      placeholder="Prix de vente unitaire"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`cogs-per-unit-${product.id}`} className="text-sm font-medium text-gray-700">
                      Coût Production par {product.unit || 'kg'} (FCFA)
                    </Label>
                    <Input
                      id={`cogs-per-unit-${product.id}`}
                      type="number"
                      value={product.cogsPerUnit}
                      onChange={(e) => updateProduct(product.id, { cogsPerUnit: Number(e.target.value) })}
                      className="mt-1 bg-red-50 border-red-200 focus:border-red-500"
                      placeholder="Coût de revient unitaire"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`rendement-estime-${product.id}`} className="text-sm font-medium text-gray-700">
                      Rendement Estimé ({product.unit || 'kg'}/cycle)
                    </Label>
                    <Input
                      id={`rendement-estime-${product.id}`}
                      type="number"
                      value={product.rendementEstime || 0}
                      onChange={(e) => updateProduct(product.id, { rendementEstime: Number(e.target.value) })}
                      className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                      placeholder="Basé sur CNRA/ANADER"
                    />
                    {selectedCrop && assignedParcelle && (
                      <p className="text-xs text-blue-600 mt-1">
                        Auto-calculé: {selectedCrop.averageYieldPerHectare} {product.unit}/ha × {assignedParcelle.surface} ha
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`rendement-reel-${product.id}`} className="text-sm font-medium text-gray-700">
                      Rendement Réel ({product.unit || 'kg'}/cycle)
                    </Label>
                    <Input
                      id={`rendement-reel-${product.id}`}
                      type="number"
                      value={product.rendementReel || 0}
                      onChange={(e) => updateProduct(product.id, { rendementReel: Number(e.target.value) })}
                      className="mt-1 bg-green-50 border-green-200 focus:border-green-500"
                      placeholder="Rendement effectif"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`cycle-months-${product.id}`} className="text-sm font-medium text-gray-700">
                      Durée du Cycle (mois)
                    </Label>
                    <Input
                      id={`cycle-months-${product.id}`}
                      type="number"
                      value={product.cycleMonths || 3}
                      onChange={(e) => updateProduct(product.id, { cycleMonths: Number(e.target.value) })}
                      className="mt-1 bg-orange-50 border-orange-200 focus:border-orange-500"
                      min="1"
                      max="12"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`repos-period-${product.id}`} className="text-sm font-medium text-gray-700">
                      Période de Repos (mois)
                    </Label>
                    <Input
                      id={`repos-period-${product.id}`}
                      type="number"
                      value={product.periodeRepos || 0}
                      onChange={(e) => updateProduct(product.id, { periodeRepos: Number(e.target.value) })}
                      className="mt-1 bg-orange-50 border-orange-200 focus:border-orange-500"
                      min="0"
                      max="6"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Cycles/An:</span>
                      <p className="text-lg font-bold text-blue-600">
                        {calculateCyclesPerYear(product.cycleMonths || 3, product.periodeRepos || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Production Annuelle:</span>
                      <p className="text-lg font-bold text-green-600">
                        {formatNumber(calculateAnnualProduction(product))} {product.unit || 'kg'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">CA Annuel:</span>
                      <p className="text-lg font-bold text-purple-600">
                        {formatNumber(calculateAnnualRevenue(product))} FCFA
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Marge Brute:</span>
                      <p className="text-lg font-bold text-orange-600">
                        {formatNumber(calculateGrossMargin(product))} FCFA
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={addProduct}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un Nouveau Produit
        </Button>
      </div>

      {/* Résumé des prévisions */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Résumé des Prévisions {selectedPlantation !== 'all' ? `- ${plantations.find(p => p.id === selectedPlantation)?.nom}` : 'Globales'}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Chiffre d'Affaires Total Prévu</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(calculateTotalRevenue())} FCFA
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Coûts de Production Totaux</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatNumber(calculateTotalCosts())} FCFA
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Marge Brute Totale</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatNumber(calculateTotalGrossMargin())} FCFA
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default PrevisionsVentesSection;