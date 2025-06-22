import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Tractor, Building, Car, Shovel } from "lucide-react";
import { useFinancialData, FixedAsset, FundingSource, WorkingCapitalItem } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { InfoCard } from '@/components/ui/InfoCard';

interface PointDepartSectionProps {
  onNavigateToAgricole?: () => void;
}

const PointDepartSection = ({ onNavigateToAgricole }: PointDepartSectionProps) => {
  const { data, updateFixedAssets, updateFundingSources, updateOperatingCapital } = useFinancialData();
  
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(data.fixedAssets);
  const [fundingSources, setFundingSources] = useState<FundingSource[]>(data.fundingSources);
  const [workingCapital, setWorkingCapital] = useState<WorkingCapitalItem[]>(data.workingCapitalItems);

  // Sync avec le contexte
  useEffect(() => {
    setFixedAssets(data.fixedAssets);
    setFundingSources(data.fundingSources);
    setWorkingCapital(data.workingCapitalItems);
  }, [data.fixedAssets, data.fundingSources, data.workingCapitalItems]);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'tractor': return <Tractor className="h-5 w-5" />;
      case 'building': return <Building className="h-5 w-5" />;
      case 'car': return <Car className="h-5 w-5" />;
      default: return <Shovel className="h-5 w-5" />;
    }
  };

  // Define valid categories to prevent empty string values - with validation
  const getValidAssetCategories = () => {
    const categories = ['Terrain', 'Équipement', 'Bâtiment', 'Véhicule'];
    console.log('Asset categories:', categories);
    return categories.filter(cat => cat && cat.trim() !== '');
  };

  const getValidFundingTypes = () => {
    const types = ['Apport personnel', 'Prêt bancaire agricole', 'Microfinance', 'Subvention', 'Prêt familial', 'Autre'];
    console.log('Funding types:', types);
    return types.filter(type => type && type.trim() !== '');
  };

  const getValidWorkingCapitalCategories = () => {
    const categories = ['Semences', 'Engrais et intrants', 'Main-d\'œuvre', 'Fonds de roulement', 'Réserve climatique', 'Autre'];
    console.log('Working capital categories:', categories);
    return categories.filter(cat => cat && cat.trim() !== '');
  };

  const addFixedAsset = () => {
    const newAsset: FixedAsset = {
      id: Date.now().toString(),
      category: 'Équipement',
      description: 'Nouvel équipement agricole',
      name: 'Nouvel équipement',
      quantity: 1,
      unitPrice: 0,
      totalValue: 0,
      depreciationRate: 20,
      depreciationYears: 5,
      icon: 'equipment'
    };
    const updated = [...fixedAssets, newAsset];
    setFixedAssets(updated);
    updateFixedAssets(updated);
  };

  const removeFixedAsset = (id: string) => {
    const updated = fixedAssets.filter(asset => asset.id !== id);
    setFixedAssets(updated);
    updateFixedAssets(updated);
  };

  const updateFixedAsset = (id: string, field: keyof FixedAsset, value: any) => {
    console.log('Updating fixed asset:', id, field, value);
    const updated = fixedAssets.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    );
    setFixedAssets(updated);
    updateFixedAssets(updated);
  };

  const addFundingSource = () => {
    const newSource: FundingSource = {
      id: Date.now().toString(),
      type: 'Autre financement',
      description: 'Source de financement personnalisée',
      amount: 0,
      interestRate: 0,
      termYears: 1
    };
    const updated = [...fundingSources, newSource];
    setFundingSources(updated);
    updateFundingSources(updated);
  };

  const removeFundingSource = (id: string) => {
    const updated = fundingSources.filter(source => source.id !== id);
    setFundingSources(updated);
    updateFundingSources(updated);
  };

  const updateFundingSource = (id: string, field: keyof FundingSource, value: any) => {
    console.log('Updating funding source:', id, field, value);
    const updated = fundingSources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    );
    setFundingSources(updated);
    updateFundingSources(updated);
  };

  const addWorkingCapitalItem = () => {
    const newItem: WorkingCapitalItem = {
      id: Date.now().toString(),
      category: 'Autre',
      description: 'Nouvelle charge',
      amount: 0
    };
    const updated = [...workingCapital, newItem];
    setWorkingCapital(updated);
    updateOperatingCapital(updated);
  };

  const removeWorkingCapitalItem = (id: string) => {
    const updated = workingCapital.filter(item => item.id !== id);
    setWorkingCapital(updated);
    updateOperatingCapital(updated);
  };

  const updateWorkingCapitalItem = (id: string, field: keyof WorkingCapitalItem, value: any) => {
    console.log('Updating working capital item:', id, field, value);
    const updated = workingCapital.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setWorkingCapital(updated);
    updateOperatingCapital(updated);
  };

  const getTotalFixedAssets = () => fixedAssets.reduce((total, asset) => total + (asset.quantity * asset.unitPrice), 0);
  const getTotalFunding = () => fundingSources.reduce((total, source) => total + source.amount, 0);
  const getTotalWorkingCapital = () => workingCapital.reduce((total, item) => total + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Point de Départ - Configuration Avancée</h2>
        <p className="text-gray-600">Configuration détaillée des immobilisations et sources de financement</p>
      </div>

      {/* Notice de redirection */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              🌱 Nouveau : Point de Départ Agricole Simplifié
            </h3>
            <p className="text-green-700 mb-4">
              Découvrez notre nouveau workflow agricole qui vous guide étape par étape depuis la configuration 
              de vos parcelles jusqu'au calcul automatique des coûts selon vos cultures.
            </p>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                // Utiliser le parent pour changer d'onglet ou navigation par défaut
                if (onNavigateToAgricole) {
                  onNavigateToAgricole();
                } else {
                  // Fallback: essayer de déclencher un changement d'onglet
                  const event = new CustomEvent('navigate-to-tab', { detail: 'point-depart-agricole' });
                  window.dispatchEvent(event);
                }
              }}
            >
              Essayer le Point de Départ Agricole
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <InfoCard 
          title="Guide des Investissements Agricoles"
          content={
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>🚜 Équipements :</strong> Tracteurs, outils, systèmes d'irrigation, véhicules</p>
              <p><strong>🏗️ Infrastructures :</strong> Hangars, serres, clôtures, puits</p>
              <p><strong>🌱 Fonds de Roulement :</strong> Semences, engrais, main-d'œuvre saisonnière</p>
              <p><strong>💰 Financement :</strong> Apports personnels, prêts agricoles, subventions</p>
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="font-medium text-green-900">💡 Conseil :</p>
                <p className="text-green-800">Prévoyez 20-30% de réserve pour les imprévus climatiques</p>
              </div>
            </div>
          }
        />

        <Card className="bg-gradient-to-br from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Résumé Financier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Investissements fixes :</span>
                <span className="font-bold text-blue-600">{formatCurrency(getTotalFixedAssets())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fonds de roulement :</span>
                <span className="font-bold text-green-600">{formatCurrency(getTotalWorkingCapital())}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-800 font-medium">Total besoins :</span>
                <span className="font-bold text-purple-600">{formatCurrency(getTotalFixedAssets() + getTotalWorkingCapital())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800 font-medium">Total financement :</span>
                <span className="font-bold text-orange-600">{formatCurrency(getTotalFunding())}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className={`font-bold ${getTotalFunding() >= (getTotalFixedAssets() + getTotalWorkingCapital()) ? 'text-green-600' : 'text-red-600'}`}>
                  Solde :
                </span>
                <span className={`font-bold ${getTotalFunding() >= (getTotalFixedAssets() + getTotalWorkingCapital()) ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(getTotalFunding() - (getTotalFixedAssets() + getTotalWorkingCapital()))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Immobilisations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tractor className="h-5 w-5" />
            Immobilisations et Équipements Agricoles
          </CardTitle>
          <Button onClick={addFixedAsset} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-600 border-b pb-2">
              <div className="col-span-1"></div>
              <div className="col-span-2">Catégorie</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-1">Qté</div>
              <div className="col-span-2">Prix unitaire</div>
              <div className="col-span-2">Amortissement</div>
              <div className="col-span-1">Actions</div>
            </div>
            
            {fixedAssets.map((asset) => (
              <div key={asset.id} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 flex justify-center">
                  {getIcon(asset.icon)}
                </div>
                <div className="col-span-2">
                  <Select
                    value={asset.category}
                    onValueChange={(value) => {
                      console.log('Asset category change:', value);
                      updateFixedAsset(asset.id, 'category', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getValidAssetCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Input
                    value={asset.name}
                    onChange={(e) => updateFixedAsset(asset.id, 'name', e.target.value)}
                    placeholder="Description de l'actif"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={asset.quantity}
                    onChange={(e) => updateFixedAsset(asset.id, 'quantity', Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={asset.unitPrice}
                    onChange={(e) => updateFixedAsset(asset.id, 'unitPrice', Number(e.target.value))}
                    placeholder="Prix en FCFA"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={asset.depreciationYears}
                    onChange={(e) => updateFixedAsset(asset.id, 'depreciationYears', Number(e.target.value))}
                    placeholder="Années"
                    min="0"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFixedAsset(asset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fonds de Roulement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fonds de Roulement et Capital d'Exploitation</CardTitle>
          <Button onClick={addWorkingCapitalItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workingCapital.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <Select
                    value={item.category}
                    onValueChange={(value) => {
                      console.log('Working capital category change:', value);
                      updateWorkingCapitalItem(item.id, 'category', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getValidWorkingCapitalCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-4">
                  <Input
                    value={item.description}
                    onChange={(e) => updateWorkingCapitalItem(item.id, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateWorkingCapitalItem(item.id, 'amount', Number(e.target.value))}
                    placeholder="Montant en FCFA"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeWorkingCapitalItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sources de Financement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sources de Financement</CardTitle>
          <Button onClick={addFundingSource} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-600 border-b pb-2">
              <div className="col-span-3">Type de financement</div>
              <div className="col-span-3">Montant</div>
              <div className="col-span-2">Taux (%)</div>
              <div className="col-span-2">Durée (ans)</div>
              <div className="col-span-2">Actions</div>
            </div>
            
            {fundingSources.map((source) => (
              <div key={source.id} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <Select
                    value={source.type}
                    onValueChange={(value) => {
                      console.log('Funding type change:', value);
                      updateFundingSource(source.id, 'type', value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getValidFundingTypes().map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={source.amount}
                    onChange={(e) => updateFundingSource(source.id, 'amount', Number(e.target.value))}
                    placeholder="Montant en FCFA"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={source.interestRate}
                    onChange={(e) => updateFundingSource(source.id, 'interestRate', Number(e.target.value))}
                    placeholder="Taux"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={source.termYears}
                    onChange={(e) => updateFundingSource(source.id, 'termYears', Number(e.target.value))}
                    placeholder="Années"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFundingSource(source.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PointDepartSection;
