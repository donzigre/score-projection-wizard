
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { Plus, X } from 'lucide-react';

const PrevisionsVentesSection = () => {
  const { data, updateProduct, addProduct, removeProduct } = useFinancialData();

  const FicheProduit = ({ product }: { product: any }) => {
    const marge = product.pricePerUnit - product.cogsPerUnit;
    const chiffreAffaireMensuel = product.unitsPerMonth * product.pricePerUnit;
    const coutAchatMensuel = product.unitsPerMonth * product.cogsPerUnit;
    const margeMensuelle = chiffreAffaireMensuel - coutAchatMensuel;

    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-blue-900">{product.name}</CardTitle>
          {data.products.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeProduct(product.id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Nom du Produit</Label>
            <Input
              value={product.name}
              onChange={(e) => updateProduct(product.id, { name: e.target.value })}
              className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Unités par Mois</Label>
              <Input
                type="number"
                value={product.unitsPerMonth || ''}
                onChange={(e) => updateProduct(product.id, { unitsPerMonth: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Prix Unitaire</Label>
              <Input
                type="number"
                step="0.01"
                value={product.pricePerUnit || ''}
                onChange={(e) => updateProduct(product.id, { pricePerUnit: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Coût d'Achat Unitaire</Label>
            <Input
              type="number"
              step="0.01"
              value={product.cogsPerUnit || ''}
              onChange={(e) => updateProduct(product.id, { cogsPerUnit: parseFloat(e.target.value) || 0 })}
              className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
              placeholder="0,00"
            />
          </div>

          <div className="pt-4 border-t border-blue-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Marge par Unité :</span>
              <span className={`font-medium ${marge >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(marge)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">CA Mensuel :</span>
              <span className="font-medium text-blue-600">{formatCurrency(chiffreAffaireMensuel)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coût d'Achat Mensuel :</span>
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
    sum + (product.unitsPerMonth * product.pricePerUnit), 0);
  const totalCoutMensuel = data.products.reduce((sum, product) => 
    sum + (product.unitsPerMonth * product.cogsPerUnit), 0);
  const totalMargeMensuelle = totalCAMensuel - totalCoutMensuel;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Prévisions de Ventes - Année 1</h2>
        <p className="text-gray-600">Définissez vos produits et projections de ventes mensuelles</p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Produits & Services</h3>
          <p className="text-sm text-gray-600">Configurez jusqu'à 6 produits ou services</p>
        </div>
        {data.products.length < 6 && (
          <Button 
            onClick={addProduct}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Produit
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <FicheProduit key={product.id} product={product} />
        ))}
      </div>

      {/* Informations de Croissance */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Hypothèses de Croissance</CardTitle>
          <p className="text-sm text-gray-600">Taux de croissance mensuels automatiques appliqués à vos projections de base</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-green-700">Croissance T1</h4>
              <p className="text-2xl font-bold text-green-800">10%</p>
              <p className="text-xs text-gray-600">par mois</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-blue-700">Croissance T2</h4>
              <p className="text-2xl font-bold text-blue-800">6%</p>
              <p className="text-xs text-gray-600">par mois</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-purple-700">Croissance T3</h4>
              <p className="text-2xl font-bold text-purple-800">4%</p>
              <p className="text-xs text-gray-600">par mois</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-orange-700">Croissance T4</h4>
              <p className="text-2xl font-bold text-orange-800">3%</p>
              <p className="text-xs text-gray-600">par mois</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Résumé des Ventes Mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-blue-200 text-sm">CA Mensuel Total</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCAMensuel)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Coût d'Achat Mensuel Total</p>
              <p className="text-3xl font-bold">{formatCurrency(totalCoutMensuel)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Marge Brute Mensuelle Totale</p>
              <p className={`text-3xl font-bold ${totalMargeMensuelle >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {formatCurrency(totalMargeMensuelle)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrevisionsVentesSection;
