
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { Plus, X, Leaf, Wheat } from 'lucide-react';
import { IVORY_COAST_CROPS, AGRICULTURAL_SEASONS, CropType } from '@/config/ivoryCoastAgriculture';

const PrevisionsVentesSection = () => {
  const { data, updateProduct, addProduct, removeProduct } = useFinancialData();
  const [selectedCropType, setSelectedCropType] = useState<CropType | null>(null);
  const [processingCropAdd, setProcessingCropAdd] = useState<string | null>(null);

  const addPredefinedCrop = async (crop: CropType) => {
    if (processingCropAdd === crop.id) return;
    
    setProcessingCropAdd(crop.id);
    
    try {
      // Ajouter un nouveau produit
      addProduct();
      
      // Attendre que le produit soit ajouté au state
      setTimeout(() => {
        const lastProduct = data.products[data.products.length - 1];
        if (lastProduct) {
          updateProduct(lastProduct.id, {
            name: crop.name,
            unitsPerMonth: Math.floor(crop.averageYieldPerHectare / crop.cycleMonths),
            pricePerUnit: crop.averagePricePerUnit,
            cogsPerUnit: crop.averageCostPerUnit,
            cropType: crop.category,
            unit: crop.unitType,
            cycleMonths: crop.cycleMonths
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

  const FicheProduit = ({ product }: { product: any }) => {
    const marge = (product.pricePerUnit || 0) - (product.cogsPerUnit || 0);
    const chiffreAffaireMensuel = (product.unitsPerMonth || 0) * (product.pricePerUnit || 0);
    const coutAchatMensuel = (product.unitsPerMonth || 0) * (product.cogsPerUnit || 0);
    const margeMensuelle = chiffreAffaireMensuel - coutAchatMensuel;
    const tauxMarge = (product.pricePerUnit || 0) > 0 ? ((marge / (product.pricePerUnit || 1)) * 100) : 0;

    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            {product.cropType === 'maraichage' ? 
              <Leaf className="h-5 w-5 text-green-600" /> : 
              <Wheat className="h-5 w-5 text-amber-600" />
            }
            <CardTitle className="text-lg text-green-900">{product.name || 'Nouvelle culture'}</CardTitle>
          </div>
          {data.products.length > 1 && (
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
          <div>
            <Label className="text-sm font-medium text-gray-700">Nom de la Culture</Label>
            <Input
              value={product.name || ''}
              onChange={(e) => updateProduct(product.id, { name: e.target.value })}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-500"
              placeholder="Nom de la culture"
            />
          </div>

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
              <span className="font-medium text-blue-600">{formatCurrency(chiffreAffaireMensuel)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coût Production Mensuel :</span>
              <span className="font-medium text-orange-600">{formatCurrency(coutAchatMensuel)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Marge Brute Mensuelle :</span>
              <span className={`font-bold ${margeMensuelle >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(margeMensuelle)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const totalCAMensuel = data.products.reduce((sum, product) => 
    sum + ((product.unitsPerMonth || 0) * (product.pricePerUnit || 0)), 0);
  const totalCoutMensuel = data.products.reduce((sum, product) => 
    sum + ((product.unitsPerMonth || 0) * (product.cogsPerUnit || 0)), 0);
  const totalMargeMensuelle = totalCAMensuel - totalCoutMensuel;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Prévisions de Production Agricole - Année 1</h2>
        <p className="text-gray-600">Définissez vos cultures et projections de production mensuelles</p>
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
                {IVORY_COAST_CROPS.filter(crop => crop.category === 'maraichage').map((crop) => (
                  <Button
                    key={crop.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addPredefinedCrop(crop)}
                    className="text-left h-auto p-3 hover:bg-green-50"
                    disabled={data.products.length >= 8 || processingCropAdd === crop.id}
                  >
                    <div>
                      <div className="font-medium text-green-700">{crop.name}</div>
                      <div className="text-xs text-gray-600">{crop.description}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        ~{formatCurrency(crop.averagePricePerUnit)}/{crop.unitType}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                <Wheat className="h-4 w-4" />
                Cultures Vivrières (cycles longs - 4-12 mois)
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {IVORY_COAST_CROPS.filter(crop => crop.category === 'vivrier').map((crop) => (
                  <Button
                    key={crop.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addPredefinedCrop(crop)}
                    className="text-left h-auto p-3 hover:bg-amber-50"
                    disabled={data.products.length >= 8 || processingCropAdd === crop.id}
                  >
                    <div>
                      <div className="font-medium text-amber-700">{crop.name}</div>
                      <div className="text-xs text-gray-600">{crop.description}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        ~{formatCurrency(crop.averagePricePerUnit)}/{crop.unitType}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Mes Productions Agricoles</h3>
          <p className="text-sm text-gray-600">Gérez jusqu'à 8 cultures différentes</p>
        </div>
        {data.products.length < 8 && (
          <Button 
            onClick={addProduct}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Culture
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
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-green-200 text-sm">Chiffre d'Affaires Mensuel</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCAMensuel)}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Coûts de Production Mensuels</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCoutMensuel)}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Marge Brute Mensuelle</p>
              <p className={`text-3xl font-bold ${totalMargeMensuelle >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {formatCurrency(totalMargeMensuelle)}
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-green-200 text-sm">Marge Brute Annuelle Estimée</p>
            <p className="text-4xl font-bold text-green-300">
              {formatCurrency(totalMargeMensuelle * 12)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrevisionsVentesSection;
