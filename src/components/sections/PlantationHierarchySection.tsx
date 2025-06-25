
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calculator, TrendingUp, Leaf, Building2, Edit, Trash2 } from "lucide-react";
import { usePlantations } from '@/contexts/PlantationsContext';
import { PlantationForm } from '@/components/forms/PlantationForm';
import { ParcelleForm } from '@/components/forms/ParcelleForm';
import { CultureSelector } from '@/components/selectors/CultureSelector';
import { TutorialGuide } from '@/components/tutorial/TutorialGuide';
import { ContextualMessage } from '@/components/tutorial/ContextualMessage';
import { formatCurrency } from '@/utils/formatting';
import { IVORY_COAST_CROPS } from '@/config/ivoryCoastAgriculture';
import { useTutorial } from '@/hooks/useTutorial';

export const PlantationHierarchySection = () => {
  const { 
    plantations, 
    parcelles,
    addPlantation, 
    updatePlantation, 
    removePlantation,
    addParcelle,
    updateParcelle,
    removeParcelle,
    assignCultureToParcelle,
    getParcellesByPlantation,
    calculatePlantationMetrics,
    getTotalMetrics 
  } = usePlantations();
  
  const { markStepCompleted, isStepCompleted, tutorialState } = useTutorial();
  
  const [activeTab, setActiveTab] = useState('plantations');
  const [showPlantationForm, setShowPlantationForm] = useState(false);
  const [showParcelleForm, setShowParcelleForm] = useState(false);
  const [selectedPlantation, setSelectedPlantation] = useState<string | null>(null);
  const [editingPlantation, setEditingPlantation] = useState<string | null>(null);

  const totalMetrics = getTotalMetrics();

  // Tutorial step completion tracking
  useEffect(() => {
    if (plantations.length > 0 && !isStepCompleted('create-plantation')) {
      markStepCompleted('create-plantation');
    }
  }, [plantations.length, isStepCompleted, markStepCompleted]);

  useEffect(() => {
    if (parcelles.length > 0 && !isStepCompleted('add-parcelle')) {
      markStepCompleted('add-parcelle');
    }
  }, [parcelles.length, isStepCompleted, markStepCompleted]);

  useEffect(() => {
    const parcellesWithCultures = parcelles.filter(p => p.cultureActuelle);
    if (parcellesWithCultures.length > 0 && !isStepCompleted('assign-culture')) {
      markStepCompleted('assign-culture');
    }
  }, [parcelles, isStepCompleted, markStepCompleted]);

  const handleAddPlantation = (plantationData: any) => {
    addPlantation(plantationData);
    setShowPlantationForm(false);
  };

  const handleAddParcelle = (parcelleData: any) => {
    if (!selectedPlantation) return;
    addParcelle({
      ...parcelleData,
      plantationId: selectedPlantation
    });
    setShowParcelleForm(false);
  };

  const handleSelectPlantation = (plantationId: string) => {
    setSelectedPlantation(plantationId);
    setActiveTab('hierarchy');
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'familiale': 'bg-green-100 text-green-800',
      'commerciale': 'bg-blue-100 text-blue-800',
      'cooperative': 'bg-purple-100 text-purple-800',
      'industrielle': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'familiale': 'Familiale',
      'commerciale': 'Commerciale',
      'cooperative': 'Coopérative',
      'industrielle': 'Industrielle'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Messages contextuels selon l'état
  const getContextualMessages = () => {
    const messages = [];

    if (plantations.length === 0) {
      messages.push({
        type: 'tip' as const,
        title: 'Bienvenue !',
        message: 'Commencez par créer votre première plantation pour organiser vos parcelles agricoles.',
        badge: 'Étape 1'
      });
    } else if (parcelles.length === 0) {
      messages.push({
        type: 'info' as const,
        title: 'Ajoutez des parcelles',
        message: 'Divisez vos plantations en parcelles pour une gestion détaillée de chaque zone de culture.',
        badge: 'Étape 2'
      });
    } else if (parcelles.filter(p => p.cultureActuelle).length === 0) {
      messages.push({
        type: 'warning' as const,
        title: 'Assignez des cultures',
        message: 'Choisissez les cultures adaptées à chaque parcelle selon les données CNRA/ANADER.',
        badge: 'Étape 3'
      });
    } else {
      messages.push({
        type: 'success' as const,
        title: 'Configuration terminée !',
        message: 'Consultez l\'onglet Analyses pour voir les performances de vos cultures.',
        badge: 'Complété'
      });
    }

    return messages;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion Hiérarchique des Exploitations Agricoles
          </h1>
          <p className="text-gray-600">
            Plantation → Parcelles → Cultures : Organisation complète de vos sites agricoles
          </p>
        </div>

        {/* Messages contextuels */}
        <div className="space-y-3">
          {getContextualMessages().map((msg, index) => (
            <ContextualMessage
              key={index}
              type={msg.type}
              title={msg.title}
              message={msg.message}
              badge={msg.badge}
            />
          ))}
        </div>

        {/* Tableau de bord global */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              Vue d'Ensemble Globale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{plantations.length}</div>
                <div className="text-green-100">Plantations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalMetrics.nombreParcelles}</div>
                <div className="text-green-100">Parcelles totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {totalMetrics.surfaceTotale.toFixed(1)} ha
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

        {/* Interface à onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plantations" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Gestion des Plantations
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Vue Hiérarchique
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2" id="analytics-tab">
              <TrendingUp className="h-4 w-4" />
              Analyses & Comparaisons
            </TabsTrigger>
          </TabsList>

          {/* Onglet Gestion des Plantations */}
          <TabsContent value="plantations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Vos Plantations ({plantations.length})</h2>
              <Button 
                id="create-plantation-btn"
                onClick={() => setShowPlantationForm(true)} 
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nouvelle Plantation
              </Button>
            </div>

            {showPlantationForm && (
              <PlantationForm
                onSubmit={handleAddPlantation}
                onCancel={() => setShowPlantationForm(false)}
              />
            )}

            {plantations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune plantation créée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par créer votre première plantation pour organiser vos parcelles
                  </p>
                  <Button onClick={() => setShowPlantationForm(true)}>
                    Créer ma première plantation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {plantations.map((plantation) => {
                  const metrics = calculatePlantationMetrics(plantation.id);
                  const plantationParcelles = getParcellesByPlantation(plantation.id);

                  return (
                    <Card key={plantation.id} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Building2 className="h-5 w-5 text-blue-600" />
                              {plantation.nom}
                            </CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge className={getTypeColor(plantation.typeExploitation)}>
                                {getTypeLabel(plantation.typeExploitation)}
                              </Badge>
                              <Badge variant="outline">
                                {plantation.surfaceTotale} ha
                              </Badge>
                              <Badge variant="outline">
                                {plantationParcelles.length} parcelles
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              {plantation.localisation.ville}, {plantation.localisation.region}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPlantation(plantation.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removePlantation(plantation.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {plantation.description && (
                          <p className="text-sm text-gray-600">{plantation.description}</p>
                        )}

                        {/* Métriques financières */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-3">Performances Financières</h4>
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

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleSelectPlantation(plantation.id)}
                          >
                            Voir les parcelles ({plantationParcelles.length})
                          </Button>
                          <Button
                            id="add-parcelle-btn"
                            onClick={() => {
                              setSelectedPlantation(plantation.id);
                              setShowParcelleForm(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Onglet Vue Hiérarchique */}
          <TabsContent value="hierarchy" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Navigation Hiérarchique</h2>
              {selectedPlantation && (
                <Button 
                  onClick={() => setShowParcelleForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle Parcelle
                </Button>
              )}
            </div>

            {showParcelleForm && selectedPlantation && (
              <ParcelleForm
                onSubmit={handleAddParcelle}
                onCancel={() => setShowParcelleForm(false)}
                title="Nouvelle Parcelle"
              />
            )}

            {!selectedPlantation ? (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Sélectionnez une plantation pour voir ses parcelles
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {plantations.map(plantation => (
                      <Button
                        key={plantation.id}
                        variant="outline"
                        onClick={() => handleSelectPlantation(plantation.id)}
                        className="p-4 h-auto flex-col"
                      >
                        <Building2 className="h-8 w-8 mb-2" />
                        <div className="font-medium">{plantation.nom}</div>
                        <div className="text-sm text-gray-600">
                          {getParcellesByPlantation(plantation.id).length} parcelles
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto"
                    onClick={() => setSelectedPlantation(null)}
                  >
                    Plantations
                  </Button>
                  <span>→</span>
                  <span className="font-medium">
                    {plantations.find(p => p.id === selectedPlantation)?.nom}
                  </span>
                </div>

                {/* Parcelles de la plantation sélectionnée */}
                <div className="grid lg:grid-cols-2 gap-4">
                  {getParcellesByPlantation(selectedPlantation).map((parcelle) => {
                    const assignedCrop = parcelle.cultureActuelle ? 
                      IVORY_COAST_CROPS.find(c => c.id === parcelle.cultureActuelle) : null;

                    return (
                      <Card key={parcelle.id} className="border-l-4 border-l-green-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-green-600" />
                            {parcelle.nom}
                            <Badge variant="outline">{parcelle.surface} ha</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Culture actuelle
                            </label>
                            <CultureSelector
                              selectedCultureId={parcelle.cultureActuelle || null}
                              onCultureChange={(cultureId) => assignCultureToParcelle(parcelle.id, cultureId)}
                            />
                          </div>

                          {assignedCrop && (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Leaf className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{assignedCrop.name}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Cycle: {assignedCrop.cycleMonths} mois • 
                                Rendement: {assignedCrop.averageYieldPerHectare} {assignedCrop.unitType}/ha
                              </div>
                            </div>
                          )}

                          {parcelle.culturesHistorique.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2">Historique des cultures</h5>
                              <div className="space-y-1">
                                {parcelle.culturesHistorique.slice(-3).map((culture, index) => {
                                  const crop = IVORY_COAST_CROPS.find(c => c.id === culture.cultureId);
                                  return (
                                    <div key={culture.id} className="text-sm text-gray-600 flex items-center gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {crop?.name || 'Culture inconnue'}
                                      </Badge>
                                      <span>{new Date(culture.datePlantation).toLocaleDateString()}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Onglet Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Analyses et Comparaisons</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plantations.map(plantation => {
                const metrics = calculatePlantationMetrics(plantation.id);
                const parcelles = getParcellesByPlantation(plantation.id);
                
                return (
                  <Card key={plantation.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{plantation.nom}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Parcelles:</span>
                          <div className="font-medium">{metrics.nombreParcelles}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Surface:</span>
                          <div className="font-medium">{metrics.surfaceTotale.toFixed(1)} ha</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Actives:</span>
                          <div className="font-medium">{metrics.parcellesActives}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Cultures:</span>
                          <div className="font-medium">{metrics.culturesDistinctes}</div>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-sm">
                          <span>Rentabilité:</span>
                          <span className={`font-medium ${metrics.rentabilite >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.rentabilite.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Marge:</span>
                          <span className={`font-medium ${metrics.margeTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(metrics.margeTotale)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Tutoriel Guide */}
        <TutorialGuide />
      </div>
    </div>
  );
};
