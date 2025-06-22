
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, MapPin, Calculator, Edit } from "lucide-react";
import { useParcelles } from '@/contexts/ParcellesContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { ParcelleForm } from '@/components/forms/ParcelleForm';

const GestionParcellesSection = () => {
  const { parcelles, addParcelle, updateParcelle, removeParcelle, assignCultureToParcelle, calculateParcelleMetrics, getTotalMetrics } = useParcelles();
  const { data } = useFinancialData();
  const [showForm, setShowForm] = useState(false);
  const [editingParcelle, setEditingParcelle] = useState<string | null>(null);

  const handleAddParcelle = (parcelleData: any) => {
    addParcelle({
      ...parcelleData,
      statut: 'preparee',
      notes: ''
    });
    setShowForm(false);
  };

  const handleEditParcelle = (id: string, updates: any) => {
    updateParcelle(id, updates);
    setEditingParcelle(null);
  };

  const handleCultureAssignment = (parcelleId: string, cultureId: string) => {
    // Convertir "no-culture" en null pour la logique métier
    const actualCultureId = cultureId === "no-culture" ? null : cultureId;
    assignCultureToParcelle(parcelleId, actualCultureId);
  };

  // Filter products to ensure valid data
  const validProducts = data.products.filter(product => 
    product && 
    product.id && 
    typeof product.id === 'string' && 
    product.id.trim() !== '' &&
    product.name &&
    typeof product.name === 'string' &&
    product.name.trim() !== ''
  );

  const totalMetrics = getTotalMetrics();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Parcelles Agricoles</h2>
        <p className="text-gray-600">Gérez vos parcelles et calculez la rentabilité par culture</p>
      </div>

      {/* Résumé Global de la Plantation */}
      <Card className="bg-gradient-to-r from-green-900 to-blue-900 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Résumé Global de la Plantation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-green-200 text-sm">Superficie Totale</p>
              <p className="text-2xl font-bold">{parcelles.reduce((sum, p) => sum + p.surface, 0).toFixed(1)} ha</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Coûts Totaux</p>
              <p className="text-2xl font-bold">{formatCurrency(totalMetrics.coutsTotaux)}</p>
            </div>
            <div>
              <p className="text-green-200 text-sm">Revenus Attendus</p>
              <p className="text-2xl font-bold">{formatCurrency(totalMetrics.revenus)}</p>
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

      {/* Actions rapides */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Vos Parcelles ({parcelles.length})</h3>
          <p className="text-gray-600">Cliquez sur "Nouvelle Parcelle" pour commencer</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvelle Parcelle
        </Button>
      </div>

      {/* Formulaire de nouvelle parcelle */}
      {showForm && (
        <ParcelleForm
          onSubmit={handleAddParcelle}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Liste des parcelles */}
      {parcelles.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune parcelle créée</h3>
            <p className="text-gray-600 mb-4">
              Commencez par ajouter votre première parcelle pour gérer votre exploitation agricole
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Créer ma première parcelle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {parcelles.map((parcelle) => {
            const metrics = calculateParcelleMetrics(parcelle.id);
            const assignedProduct = validProducts.find(p => p.id === parcelle.cultureId);
            const isEditing = editingParcelle === parcelle.id;
            
            if (isEditing) {
              return (
                <ParcelleForm
                  key={parcelle.id}
                  title={`Modifier ${parcelle.nom}`}
                  initialData={{
                    nom: parcelle.nom,
                    surface: parcelle.surface,
                    coutsPrepration: parcelle.coutsPrepration,
                    coutsIntrants: parcelle.coutsIntrants,
                    coutsMainOeuvre: parcelle.coutsMainOeuvre,
                    autresCouts: parcelle.autresCouts,
                    rendementAttendu: parcelle.rendementAttendu,
                    cultureId: parcelle.cultureId || 'no-culture'
                  }}
                  onSubmit={(data) => handleEditParcelle(parcelle.id, data)}
                  onCancel={() => setEditingParcelle(null)}
                />
              );
            }
            
            return (
              <Card key={parcelle.id} className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">{parcelle.nom}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingParcelle(parcelle.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeParcelle(parcelle.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Surface</p>
                      <p className="font-medium">{parcelle.surface} hectares</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Statut</p>
                      <p className="font-medium capitalize">{parcelle.statut.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm mb-1">Culture assignée</p>
                    <Select
                      value={parcelle.cultureId || 'no-culture'}
                      onValueChange={(value) => handleCultureAssignment(parcelle.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une culture" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-culture">Aucune culture</SelectItem>
                        {validProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Résumé des coûts */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Coûts de Production</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Préparation:</span>
                        <span>{formatCurrency(parcelle.coutsPrepration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Intrants:</span>
                        <span>{formatCurrency(parcelle.coutsIntrants)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Main d'œuvre:</span>
                        <span>{formatCurrency(parcelle.coutsMainOeuvre)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Autres:</span>
                        <span>{formatCurrency(parcelle.autresCouts)}</span>
                      </div>
                    </div>
                    <div className="border-t mt-2 pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>{formatCurrency(metrics.coutsTotaux)}</span>
                      </div>
                    </div>
                  </div>

                  {assignedProduct && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Calculs pour {assignedProduct.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenus attendus:</span>
                          <span className="font-medium">{formatCurrency(metrics.revenus)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Marge totale:</span>
                          <span className={`font-medium ${metrics.margeTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(metrics.margeTotale)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Marge/hectare:</span>
                          <span className="font-medium">{formatCurrency(metrics.margeParHectare)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rentabilité:</span>
                          <span className={`font-medium ${metrics.rentabilite >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.rentabilite.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {!assignedProduct && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-orange-800 text-sm">
                        💡 Assignez une culture à cette parcelle pour voir les calculs de rentabilité
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GestionParcellesSection;
