
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useParcelles } from '@/contexts/ParcellesContext';
import { formatCurrency } from '@/utils/formatting';
import { Plus, X, Leaf, Wheat, Info, AlertCircle } from 'lucide-react';
import { IVORY_COAST_CROPS, AGRICULTURAL_SEASONS, CropType } from '@/config/ivoryCoastAgriculture';

const PrevisionsVentesSection = () => {
  const { data, updateProduct, addProduct, removeProduct } = useFinancialData();
  const { parcelles } = useParcelles();
  const [selectedCropType, setSelectedCropType] = useState<CropType | null>(null);
  const [processingCropAdd, setProcessingCropAdd] = useState<string | null>(null);

  const addPredefinedCrop = async (crop: CropType) => {
    if (processingCropAdd === crop.id) return;
    
    setProcessingCropAdd(crop.id);
    
    try {
      // Vérifier si cette culture existe déjà
      const existingProduct = data.products.find(p => p.cropId === crop.id);
      if (existingProduct) {
        setProcessingCropAdd(null);
        return;
      }

      // Ajouter un nouveau produit
      addProduct();
      
      // Attendre que le produit soit ajouté au state
      setTimeout(() => {
        const lastProduct = data.products[data.products.length - 1];
        if (lastProduct) {
          updateProduct(lastProduct.id, {
            name: crop.name,
            cropId: crop.id,
            unitsPerMonth: Math.floor(crop.averageYieldPerHectare / crop.cycleMonths),
            pricePerUnit: crop.averagePricePerUnit,
            cogsPerUnit: crop.averageCostPerUnit,
            cropType: crop.category,
            unit: crop.unitType,
            cycleMonths: crop.cycleMonths,
            periodeRepos: Math.floor(crop.cycleMonths * 0.2),
            rendementEstime: crop.averageYieldPerHectare
          });
        }
        setProcessingCropAdd(null);
      }, 100);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la culture:', error);
      setProcessingCropAdd(null);
    }
  };

  const handleRemoveProduct = (id: string) => {
    if (data.products.length > 1) {
      removeProduct(id);
    }
  };

  // Obtenir les produits non assignés à des parcelles
  const unassignedProducts = data.products.filter(p => !p.parcelleId);
  const assignedProducts = data.products.filter(p => p.parcelleId);

  const FicheProduit = ({ product }: { product: any }) => {
    const parcelle = product.parcelleId ? parcelles.find(p => p.id === product.parcelleId) : null;
    const crop = product.cropId ? IVORY_COAST_CROPS.find(c => c.id === product.cropId) : null;
    
    const marge = (product.pricePerUnit || 0) - (product.cogsPerUnit || 0);
    const rendement = product.rendementReel || product.rendementEstime || 0;
    const surface = parcelle?.surface || 1;
    const cyclesParAn = product.cycleMonths ? Math.floor(12 / (product.cycleMonths + (product.periodeRepos || 0))) : 1;
    
    const revenueAnnuel = rendement * (product.pricePerUnit || 0) * cyclesParAn;
    const coutAnnuel = rendement * (product.cogsPerUnit || 0) * cyclesParAn;
    const margeAnnuelle = revenueAnnuel - coutAnnuel;
    
    const tauxMarge = (product.pricePerUnit || 0) > 0 ? ((marge / (product.pricePerUnit || 1)) * 100) : 0;

    return (
      <Card className={`shadow-lg border-0 ${parcelle ? 'bg-gradient-to-br from-green-50 to-white' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            {product.cropType === 'maraichage' ? 
              <Leaf className="h-5 w-5 text-green-600" /> : 
              <Wheat className="h-5 w-5 text-amber-600" />
            }
            <CardTitle className="text-lg text-green-900">{product.name || 'Nouvelle culture'}</CardTitle>
            {parcelle && <Info className="h-4 w-4 text-blue-500" title={`Assigné à ${parcelle.nom}`} />}
          </div>
          {data.products.length > 1 && !parcelle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveProduct(product.id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!parcelle && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Non assigné à une parcelle</span>
              </div>
              <p className="text-xs text-amber-600 mt-1">
                Assignez cette culture à une parcelle dans la section "Gestion Parcelles & Cultures" pour des calculs automatiques
              </p>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-gray-700">Nom de la Culture</Label>
            <Input
              value={product.name || ''}
              onChange={(e) => updateProduct(product.id, { name: e.target.value })}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-500"
              placeholder="Nom de la culture"
              disabled={!!parcelle} // Désactivé si assigné à une parcelle
            />
          </div>

          {parcelle ? (
            // Vue pour les produits assignés à des parcelles
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Assigné à la parcelle : {parcelle.nom}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <Label className="text-gray-600">Surface</Label>
                    <p className="font-medium">{parcelle.surface} ha</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Cycles/an</Label>
                    <p className="font-medium text-green-600">{cyclesParAn}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Rendement estimé</Label>
                    <p className="font-medium text-blue-600">{product.rendementEstime?.toFixed(1) || 0} t</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Prix/tonne</Label>
                    <Input
                      type="number"
                      value={product.pricePerUnit || ''}
                      onChange={(e) => updateProduct(product.id, { pricePerUnit: parseFloat(e.target.value) || 0 })}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-green-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue annuel :</span>
                  <span className="font-medium text-green-600">{formatCurrency(revenueAnnuel)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coût annuel :</span>
                  <span className="font-medium text-orange-600">{formatCurrency(coutAnnuel)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Marge annuelle :</span>
                  <span className={`font-bold ${margeAnnuelle >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(margeAnnuelle)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Vue pour les produits non assignés (ancien système)
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Quantité/Mois ({product.unit || 'unités'})
                  </Label>
                  <Input
                    type="number"
                    value={product.unitsPerMonth || ''}
                    onChange={(e) => updateProduct(product.id, { unitsPerMonth: parseFloat(e.target.value) || 0 })}
                    className="mt-1 bg-green-50 border-green-200 focus:border-green-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Prix Unitaire (FCFA)</Label>
                  <Input
                    type="number"
                    step="100"
                    value={product.pricePerUnit || ''}
                    onChange={(e) => updateProduct(product.id, { pricePerUnit: parseFloat(e.target.value) || 0 })}
                    className="mt-1 bg-green-50 border-green-200 focus:border-green-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Coût de Production Unitaire (FCFA)</Label>
                <Input
                  type="number"
                  step="100"
                  value={product.cogsPerUnit || ''}
                  onChange={(e) => updateProduct(product.id, { cogsPerUnit: parseFloat(e.target.value) || 0 })}
                  className="mt-1 bg-green-50 border-green-200 focus:border-green-500"
                  placeholder="0"
                />
              </div>

              <div className="pt-4 border-t border-green-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Marge par Unité :</span>
                  <span className={`font-medium ${marge >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(marge)} ({tauxMarge.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CA Mensuel :</span>
                  <span className="font-medium text-blue-600">{formatCurrency((product.unitsPerMonth || 0) * (product.pricePerUnit || 0))}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Calculs pour les produits assignés et non assignés
  const totalCAMensuelAssigned = assignedProducts.reduce((sum, product) => {
    const rendement = product.rendementReel || product.rendementEstime || 0;
    const cyclesParAn = product.cycleMonths ? Math.floor(12 / (product.cycleMonths + (product.periodeRepos || 0))) : 1;
    return sum + (rendement * (product.pricePerUnit || 0) * cyclesParAn / 12);
  }, 0);

  const totalCAMensuelUnassigned = unassignedProducts.reduce((sum, product) => 
    sum + ((product.unitsPerMonth || 0) * (product.pricePerUnit || 0)), 0);

  const totalCAMensuel = totalCAMensuelAssigned + totalCAMensuelUnassigned;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Prévisions de Production Agricole - Année 1</h2>
        <p className="text-gray-600">Gérez vos cultures avec assignation aux parcelles ou en mode libre</p>
      </div>

      {/* Cultures pré-configurées */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            Cultures Recommandées pour la Côte d'Ivoire
          </CardTitle>
          <p className="text-sm text-gray-600">Cliquez sur une culture pour l'ajouter avec des données pré-configurées</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Cultures Maraîchères (cycles courts - 2-4 mois)
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {IVORY_COAST_CROPS.filter(crop => crop.category === 'maraichage').map((crop) => {
                  const isAdded = data.products.some(p => p.cropId === crop.id);
                  return (
                    <Button
                      key={crop.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addPredefinedCrop(crop)}
                      className={`text-left h-auto p-3 ${isAdded ? 'bg-green-100 border-green-400' : 'hover:bg-green-50'}`}
                      disabled={data.products.length >= 8 || processingCropAdd === crop.id || isAdded}
                    >
                      <div>
                        <div className="font-medium text-green-700">
                          {crop.name} {isAdded && '✓'}
                        </div>
                        <div className="text-xs text-gray-600">{crop.description}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          ~{formatCurrency(crop.averagePricePerUnit)}/{crop.unitType}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                <Wheat className="h-4 w-4" />
                Cultures Vivrières (cycles longs - 4-12 mois)
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {IVORY_COAST_CROPS.filter(crop => crop.category === 'vivrier').map((crop) => {
                  const isAdded = data.products.some(p => p.cropId === crop.id);
                  return (
                    <Button
                      key={crop.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addPredefinedCrop(crop)}
                      className={`text-left h-auto p-3 ${isAdded ? 'bg-amber-100 border-amber-400' : 'hover:bg-amber-50'}`}
                      disabled={data.products.length >= 8 || processingCropAdd === crop.id || isAdded}
                    >
                      <div>
                        <div className="font-medium text-amber-700">
                          {crop.name} {isAdded && '✓'}
                        </div>
                        <div className="text-xs text-gray-600">{crop.description}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          ~{formatCurrency(crop.averagePricePerUnit)}/{crop.unitType}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Mes Productions Agricoles</h3>
          <p className="text-sm text-gray-600">
            Cultures assignées aux parcelles ({assignedProducts.length}) • Cultures libres ({unassignedProducts.length})
          </p>
        </div>
        {data.products.length < 8 && (
          <Button 
            onClick={addProduct}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Culture Libre
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <FicheProduit key={product.id} product={product} />
        ))}
      </div>

      {/* Calendrier Agricole */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-amber-50 to-green-50">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Calendrier Agricole Ivoirien</CardTitle>
          <p className="text-sm text-gray-600">Planifiez vos cultures selon les saisons</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {AGRICULTURAL_SEASONS.map((season, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-1">{season.name}</h4>
                <p className="text-sm text-blue-600 mb-2">{season.period}</p>
                <p className="text-xs text-gray-600">{season.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Résumé */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-green-900 to-blue-900 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Résumé Production Mensuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-green-200 text-sm">CA Mensuel (Cultures Assignées)</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCAMensuelAssigned)}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">CA Mensuel (Cultures Libres)</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCAMensuelUnassigned)}</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-green-200 text-sm">Chiffre d'Affaires Total Mensuel</p>
            <p className="text-4xl font-bold text-green-300">
              {formatCurrency(totalCAMensuel)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrevisionsVentesSection;
