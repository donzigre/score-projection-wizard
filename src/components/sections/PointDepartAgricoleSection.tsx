import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Calculator, Edit, CheckCircle, Banana, Leaf, Carrot, Brain, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useParcelles } from '@/contexts/ParcellesContext';
import { Parcelle } from '@/types/parcelle';
import { IVORY_COAST_CROPS, CropType } from '@/config/ivoryCoastAgriculture';

const PointDepartAgricoleSection = () => {
  const { data } = useFinancialData();
  const { parcelles, addParcelle, updateParcelle, removeParcelle, assignCultureToParcelle, getAllCrops, getTotalMetrics } = useParcelles();
  const { toast } = useToast();

  const [newParcelleName, setNewParcelleName] = useState('');
  const [newParcelleSurface, setNewParcelleSurface] = useState<number | ''>('');
  const [selectedParcelleId, setSelectedParcelleId] = useState<string | null>(null);
  const [isAutoCalculated, setIsAutoCalculated] = useState(true);

  const availableCrops = getAllCrops();

  const handleAddParcelle = () => {
    if (!newParcelleName.trim() || !newParcelleSurface) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs pour ajouter une parcelle.",
        variant: "destructive",
      });
      return;
    }

    const surface = Number(newParcelleSurface);
    if (isNaN(surface) || surface <= 0) {
      toast({
        title: "Erreur",
        description: "La surface de la parcelle doit être un nombre positif.",
        variant: "destructive",
      });
      return;
    }

    addParcelle({
      nom: newParcelleName,
      surface: surface,
      cultureId: null,
      coutsPrepration: 0,
      coutsIntrants: 0,
      coutsMainOeuvre: 0,
      autresCouts: 0,
      rendementAttendu: 0,
      statut: 'preparee',
      notes: '',
    });

    setNewParcelleName('');
    setNewParcelleSurface('');

    toast({
      title: "Succès",
      description: "Parcelle ajoutée avec succès.",
    });
  };

  const handleUpdateParcelle = (id: string, updates: Partial<Parcelle>) => {
    updateParcelle(id, updates);
    toast({
      title: "Succès",
      description: "Parcelle mise à jour avec succès.",
    });
  };

  const handleRemoveParcelle = (id: string) => {
    removeParcelle(id);
    setSelectedParcelleId(null);
    toast({
      title: "Succès",
      description: "Parcelle supprimée avec succès.",
    });
  };

  const handleCultureAssignment = (parcelleId: string, cultureId: string | null) => {
    assignCultureToParcelle(parcelleId, cultureId);
    toast({
      title: "Succès",
      description: "Culture assignée à la parcelle avec succès.",
    });
  };

  const getAvailableCrops = useCallback(() => {
    return getAllCrops();
  }, [getAllCrops]);

  // Utiliser les métriques du contexte au lieu de calculer ici
  const totalMetrics = getTotalMetrics();

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(number));
  };

  const formatCurrency = (amount: number) => {
    return `${formatNumber(amount)} FCFA`;
  };

  const getAssignedCrop = (parcelle: Parcelle) => {
    return parcelle.cultureId ? getAvailableCrops().find(c => c.id === parcelle.cultureId) : null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Point de Départ Agricole</h2>
        <p className="text-gray-600">Configuration détaillée de vos parcelles et cultures avec données CNRA/ANADER</p>
      </div>

      {/* Section: Ajout de Parcelles */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Gestion des Parcelles</CardTitle>
          <CardDescription>Ajouter, modifier et supprimer vos parcelles agricoles.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parcelle-name">Nom de la Parcelle</Label>
              <Input
                type="text"
                id="parcelle-name"
                placeholder="ex: Champ principal"
                value={newParcelleName}
                onChange={(e) => setNewParcelleName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="parcelle-surface">Surface (hectares)</Label>
              <Input
                type="number"
                id="parcelle-surface"
                placeholder="ex: 2.5"
                value={newParcelleSurface}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setNewParcelleSurface(value === '' ? '' : Number(value));
                  }
                }}
              />
            </div>
          </div>
          <Button onClick={handleAddParcelle} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une Parcelle
          </Button>
        </CardContent>
      </Card>

      {/* Section: Configuration des Parcelles Existantes */}
      {parcelles.length > 0 && (
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Configuration des Parcelles Existantes</CardTitle>
            <CardDescription>Modifier les détails de vos parcelles et assigner des cultures.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {parcelles.map((parcelle) => (
                <Card key={parcelle.id} className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-gray-800">{parcelle.nom}</h3>
                      <p className="text-sm text-gray-600">Surface: {parcelle.surface} ha</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedParcelleId(parcelle.id)}
                        className="hover:bg-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveParcelle(parcelle.id)}
                        className="hover:bg-red-200 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedParcelleId === parcelle.id && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`parcelle-name-${parcelle.id}`}>Nouveau Nom</Label>
                          <Input
                            type="text"
                            id={`parcelle-name-${parcelle.id}`}
                            defaultValue={parcelle.nom}
                            onChange={(e) => handleUpdateParcelle(parcelle.id, { nom: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`parcelle-surface-${parcelle.id}`}>Nouvelle Surface (ha)</Label>
                          <Input
                            type="number"
                            id={`parcelle-surface-${parcelle.id}`}
                            defaultValue={parcelle.surface}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                handleUpdateParcelle(parcelle.id, { surface: Number(value) });
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`parcelle-notes-${parcelle.id}`}>Notes</Label>
                        <Textarea
                          id={`parcelle-notes-${parcelle.id}`}
                          placeholder="Informations supplémentaires sur la parcelle"
                          defaultValue={parcelle.notes}
                          onChange={(e) => handleUpdateParcelle(parcelle.id, { notes: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`parcelle-culture-${parcelle.id}`}>Culture Assignée</Label>
                        <Select onValueChange={(value) => handleCultureAssignment(parcelle.id, value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner une culture" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>Aucune culture</SelectItem>
                            {getAvailableCrops().map((crop) => (
                              <SelectItem key={crop.id} value={crop.id}>{crop.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`parcelle-couts-preparation-${parcelle.id}`}>Coûts de Préparation (FCFA)</Label>
                          <Input
                            type="number"
                            id={`parcelle-couts-preparation-${parcelle.id}`}
                            defaultValue={parcelle.coutsPrepration}
                            onChange={(e) => handleUpdateParcelle(parcelle.id, { coutsPrepration: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`parcelle-couts-intrants-${parcelle.id}`}>Coûts des Intrants (FCFA)</Label>
                          <Input
                            type="number"
                            id={`parcelle-couts-intrants-${parcelle.id}`}
                            defaultValue={parcelle.coutsIntrants}
                            onChange={(e) => handleUpdateParcelle(parcelle.id, { coutsIntrants: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`parcelle-couts-main-oeuvre-${parcelle.id}`}>Coûts de Main d'Oeuvre (FCFA)</Label>
                          <Input
                            type="number"
                            id={`parcelle-couts-main-oeuvre-${parcelle.id}`}
                            defaultValue={parcelle.coutsMainOeuvre}
                            onChange={(e) => handleUpdateParcelle(parcelle.id, { coutsMainOeuvre: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`parcelle-autres-couts-${parcelle.id}`}>Autres Coûts (FCFA)</Label>
                          <Input
                            type="number"
                            id={`parcelle-autres-couts-${parcelle.id}`}
                            defaultValue={parcelle.autresCouts}
                            onChange={(e) => handleUpdateParcelle(parcelle.id, { autresCouts: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`parcelle-rendement-attendu-${parcelle.id}`}>Rendement Attendu (unité/ha)</Label>
                        <Input
                          type="number"
                          id={`parcelle-rendement-attendu-${parcelle.id}`}
                          defaultValue={parcelle.rendementAttendu}
                          onChange={(e) => handleUpdateParcelle(parcelle.id, { rendementAttendu: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résumé Financier Global - Enhanced */}
      {parcelles.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-800 flex items-center justify-center gap-2">
              <Calculator className="h-6 w-6" />
              Résumé Financier Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-6 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">Coûts Totaux</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalMetrics.coutsTotaux)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Production + Exploitation</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">Revenus Attendus</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalMetrics.revenus)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Annuels (tous cycles)</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">Revenu Mensuel Moyen</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalMetrics.revenuMensuelMoyen)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Flux de trésorerie mensuel</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">Revenu par Cycle Moyen</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(totalMetrics.revenuParCycleMoyen)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalMetrics.nombreCyclesParAn.toFixed(1)} cycles/an moyenne
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">Marge Nette</p>
                <p className={`text-2xl font-bold ${totalMetrics.margeTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalMetrics.margeTotale)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Rentabilité: {totalMetrics.rentabilite.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-100 p-4 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-blue-800">Surface Totale</p>
                  <p className="text-lg font-bold text-blue-600">
                    {parcelles.reduce((sum, p) => sum + p.surface, 0).toFixed(1)} ha
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-800">Parcelles Configurées</p>
                  <p className="text-lg font-bold text-blue-600">
                    {parcelles.length} parcelle{parcelles.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-800">Cultures Assignées</p>
                  <p className="text-lg font-bold text-blue-600">
                    {parcelles.filter(p => p.cultureId).length} / {parcelles.length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PointDepartAgricoleSection;
