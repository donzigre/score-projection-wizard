import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Sprout } from "lucide-react";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useParcelles } from '@/contexts/ParcellesContext';
import { IVORY_COAST_CROPS } from '@/config/ivoryCoastAgriculture';

const PrevisionsVentesSection = () => {
  const { data, updateProduct, addProduct, removeProduct } = useFinancialData();
  const { parcelles } = useParcelles();

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Prévisions de Ventes Année 1</h2>
        <p className="text-gray-600">Configurez vos produits agricoles et leurs prévisions de vente</p>
      </div>

      <div className="grid gap-6">
        {data.products.map((product, index) => {
          const assignedParcelle = parcelles.find(p => p.id === product.parcelleId);
          const selectedCrop = product.cropId ? IVORY_COAST_CROPS.find(c => c.id === product.cropId) : null;
          
          return (
            <Card key={product.id} className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-green-900 flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Produit {index + 1}: {product.name || 'Nouveau Produit'}
                  </CardTitle>
                  {data.products.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {assignedParcelle && (
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Parcelle assignée:</strong> {assignedParcelle.nom} ({assignedParcelle.surface} ha)
                    </p>
                    {selectedCrop && (
                      <p className="text-sm text-blue-700 mt-1">
                        <strong>Culture:</strong> {selectedCrop.name} ({selectedCrop.category})
                      </p>
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
                      </SelectContent>
                    </Select>
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
                      readOnly={!!selectedCrop}
                    />
                    {selectedCrop && (
                      <p className="text-xs text-blue-600 mt-1">
                        Auto-calculé: {selectedCrop.averageYieldPerHectare} {product.unit}/ha × {assignedParcelle?.surface || 1} ha
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
                </div>

                <div className="grid md:grid-cols-3 gap-4">
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
                      readOnly={assignedParcelle && product.rendementReel > 0}
                    />
                    {assignedParcelle && product.rendementReel > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        Auto-calculé selon les charges de la parcelle
                      </p>
                    )}
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

      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Résumé des Prévisions de Ventes</h3>
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
      </Card>
    </div>
  );
};

export default PrevisionsVentesSection;
