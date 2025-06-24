
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calculator, TrendingUp, Leaf, AlertCircle } from "lucide-react";
import { useParcelles } from '@/contexts/ParcellesContext';
import { CultureSelector } from '@/components/selectors/CultureSelector';
import { ParcelleForm } from '@/components/forms/ParcelleForm';
import { formatCurrency } from '@/utils/formatting';
import { IVORY_COAST_CROPS } from '@/config/ivoryCoastAgriculture';

export const ParcelleManagementSection = () => {
  const { 
    parcelles, 
    addParcelle, 
    updateParcelle, 
    removeParcelle, 
    assignCultureToParcelle,
    calculateParcelleMetrics,
    getTotalMetrics 
  } = useParcelles();
  
  const [activeTab, setActiveTab] = useState('parcelles');
  const [showForm, setShowForm] = useState(false);
  const [editingParcelle, setEditingParcelle] = useState<string | null>(null);

  const totalMetrics = getTotalMetrics();

  const handleAddParcelle = (parcelleData: any) => {
    addParcelle({
      ...parcelleData,
      statut: 'preparee',
      notes: ''
    });
    setShowForm(false);
  };

  const handleCultureAssignment = (parcelleId: string, cultureId: string | null) => {
    assignCultureToParcelle(parcelleId, cultureId);
  };

  const getStatusColor = (statut: string) => {
    const colors = {
      'preparee': 'bg-orange-100 text-orange-800',
      'plantee': 'bg-blue-100 text-blue-800',
      'en_croissance': 'bg-green-100 text-green-800',
      'recoltee': 'bg-purple-100 text-purple-800'
    };
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (statut: string) => {
    const labels = {
      'preparee': 'Préparée',
      'plantee': 'Plantée',
      'en_croissance': 'En croissance',
      'recoltee': 'Récoltée'
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const unassignedParcelles = parcelles.filter(p => !p.cultureId);
  const assignedParcelles = parcelles.filter(p => p.cultureId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion Unifiée des Parcelles Agricoles
          </h1>
          <p className="text-gray-600">
            Interface complète pour gérer vos parcelles, cultures et calculs de rentabilité
          </p>
        </div>

        {/* Tableau de bord global */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Tableau de Bord Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{parcelles.length}</div>
                <div className="text-green-100">Parcelles totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{assignedParcelles.length}</div>
                <div className="text-green-100">Cultures assignées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {parcelles.reduce((sum, p) => sum + p.surface, 0).toFixed(1)} ha
                </div>
                <div className="text-green-100">Surface totale</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(totalMetrics.revenus)}</div>
                <div className="text-green-100">Revenus attendus</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${totalMetrics.margeTotale >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {formatCurrency(totalMetrics.margeTotale)}
                </div>
                <div className="text-green-100">Marge totale</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertes */}
        {unassignedParcelles.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="flex items-center gap-2 py-4">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="text-orange-800">
                {unassignedParcelles.length} parcelle(s) sans culture assignée. 
                Assignez des cultures pour optimiser vos calculs de rentabilité.
              </span>
            </CardContent>
          </Card>
        )}

        {/* Interface à onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="parcelles" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Gestion des Parcelles
            </TabsTrigger>
            <TabsTrigger value="cultures" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Catalogue des Cultures
            </TabsTrigger>
            <TabsTrigger value="assignations" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Assignations & Calculs
            </TabsTrigger>
          </TabsList>

          {/* Onglet Gestion des Parcelles */}
          <TabsContent value="parcelles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Vos Parcelles ({parcelles.length})</h2>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle Parcelle
              </Button>
            </div>

            {showForm && (
              <ParcelleForm
                onSubmit={handleAddParcelle}
                onCancel={() => setShowForm(false)}
              />
            )}

            {parcelles.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune parcelle créée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par ajouter votre première parcelle
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    Créer ma première parcelle
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {parcelles.map((parcelle) => {
                  const metrics = calculateParcelleMetrics(parcelle.id);
                  const assignedCrop = parcelle.cultureId ? 
                    IVORY_COAST_CROPS.find(c => c.id === parcelle.cultureId) : null;

                  return (
                    <Card key={parcelle.id} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-green-600" />
                              {parcelle.nom}
                            </CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge className={getStatusColor(parcelle.statut)}>
                                {getStatusLabel(parcelle.statut)}
                              </Badge>
                              <Badge variant="outline">
                                {parcelle.surface} ha
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeParcelle(parcelle.id)}
                            className="text-red-600"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Culture assignée */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Culture assignée
                          </label>
                          <CultureSelector
                            selectedCultureId={parcelle.cultureId}
                            onCultureChange={(cultureId) => handleCultureAssignment(parcelle.id, cultureId)}
                          />
                        </div>

                        {/* Métriques financières */}
                        {assignedCrop && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-3">
                              Calculs pour {assignedCrop.name}
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-600">Coûts totaux:</span>
                                <div className="font-medium">{formatCurrency(metrics.coutsTotaux)}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Revenus attendus:</span>
                                <div className="font-medium">{formatCurrency(metrics.revenus)}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Marge totale:</span>
                                <div className={`font-medium ${metrics.margeTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(metrics.margeTotale)}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Rentabilité:</span>
                                <div className={`font-medium ${metrics.rentabilite >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {metrics.rentabilite.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Onglet Catalogue des Cultures */}
          <TabsContent value="cultures" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Catalogue des Cultures Ivoiriennes</h2>
              <p className="text-gray-600">
                Cultures pré-remplies avec données officielles CNRA/ANADER
              </p>
            </div>

            <CultureSelector
              selectedCultureId={null}
              onCultureChange={() => {}}
              showDetails={true}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {IVORY_COAST_CROPS.map((crop) => (
                <Card key={crop.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        {crop.name}
                      </CardTitle>
                      <Badge className="text-xs">
                        {crop.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {crop.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Cycle:</span>
                        <span className="font-medium">{crop.cycleMonths} mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rendement:</span>
                        <span className="font-medium">
                          {crop.averageYieldPerHectare.toLocaleString()} {crop.unitType}/ha
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prix moyen:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(crop.regionalPrices.average)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Régions: {crop.bestRegions.slice(0, 2).join(', ')}
                      {crop.bestRegions.length > 2 && '...'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Assignations & Calculs */}
          <TabsContent value="assignations" className="space-y-6">
            <h2 className="text-xl font-semibold">Vue d'Ensemble des Assignations</h2>

            {/* Statistiques par catégorie de culture */}
            <div className="grid md:grid-cols-4 gap-4">
              {['maraichage', 'vivrier', 'tubercule', 'legumineuse'].map((category) => {
                const parcellesOfCategory = assignedParcelles.filter(p => {
                  const crop = IVORY_COAST_CROPS.find(c => c.id === p.cultureId);
                  return crop?.category === category;
                });
                
                const categoryMetrics = parcellesOfCategory.reduce((acc, parcelle) => {
                  const metrics = calculateParcelleMetrics(parcelle.id);
                  return {
                    surface: acc.surface + parcelle.surface,
                    revenus: acc.revenus + metrics.revenus,
                    couts: acc.couts + metrics.coutsTotaux
                  };
                }, { surface: 0, revenus: 0, couts: 0 });

                return (
                  <Card key={category}>
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-bold">{parcellesOfCategory.length}</div>
                      <div className="text-sm text-gray-600 capitalize mb-2">{category}</div>
                      <div className="text-xs space-y-1">
                        <div>{categoryMetrics.surface.toFixed(1)} ha</div>
                        <div className="text-green-600">{formatCurrency(categoryMetrics.revenus)}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Liste détaillée des assignations */}
            <Card>
              <CardHeader>
                <CardTitle>Détail des Assignations</CardTitle>
              </CardHeader>
              <CardContent>
                {assignedParcelles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune parcelle n'a encore de culture assignée
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignedParcelles.map((parcelle) => {
                      const crop = IVORY_COAST_CROPS.find(c => c.id === parcelle.cultureId);
                      const metrics = calculateParcelleMetrics(parcelle.id);
                      
                      return (
                        <div key={parcelle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="font-medium">{parcelle.nom}</div>
                              <div className="text-sm text-gray-600">
                                {crop?.name} • {parcelle.surface} ha
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <div className="font-medium">{formatCurrency(metrics.revenus)}</div>
                              <div className="text-gray-600">Revenus</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{formatCurrency(metrics.coutsTotaux)}</div>
                              <div className="text-gray-600">Coûts</div>
                            </div>
                            <div className="text-center">
                              <div className={`font-medium ${metrics.margeTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(metrics.margeTotale)}
                              </div>
                              <div className="text-gray-600">Marge</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
