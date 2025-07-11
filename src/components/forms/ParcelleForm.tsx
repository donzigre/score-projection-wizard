
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Info } from "lucide-react";
import { CultureSelector } from '@/components/selectors/CultureSelector';
import { IVORY_COAST_CROPS } from '@/config/ivoryCoastAgriculture';

interface ParcelleFormData {
  nom: string;
  surface: number;
  coutsPrepration: number;
  coutsIntrants: number;
  coutsMainOeuvre: number;
  autresCouts: number;
  rendementAttendu: number;
  cultureId: string | null;
  notes: string;
}

interface ParcelleFormProps {
  onSubmit: (data: ParcelleFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ParcelleFormData>;
  title?: string;
}

export const ParcelleForm: React.FC<ParcelleFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData = {},
  title = "Nouvelle Parcelle"
}) => {
  const [formData, setFormData] = useState<ParcelleFormData>({
    nom: initialData.nom || '',
    surface: initialData.surface || 0,
    coutsPrepration: initialData.coutsPrepration || 0,
    coutsIntrants: initialData.coutsIntrants || 0,
    coutsMainOeuvre: initialData.coutsMainOeuvre || 0,
    autresCouts: initialData.autresCouts || 0,
    rendementAttendu: initialData.rendementAttendu || 0,
    cultureId: initialData.cultureId || null,
    notes: initialData.notes || ''
  });

  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Auto-fill costs and yield when culture is selected
  useEffect(() => {
    if (formData.cultureId) {
      const selectedCrop = IVORY_COAST_CROPS.find(crop => crop.id === formData.cultureId);
      if (selectedCrop) {
        // Only auto-fill if values are empty (not overriding user input)
        const updates: Partial<ParcelleFormData> = {};
        let hasUpdates = false;

        if (formData.coutsPrepration === 0) {
          updates.coutsPrepration = selectedCrop.productionCosts.semences;
          hasUpdates = true;
        }
        if (formData.coutsIntrants === 0) {
          updates.coutsIntrants = selectedCrop.productionCosts.engrais;
          hasUpdates = true;
        }
        if (formData.coutsMainOeuvre === 0) {
          updates.coutsMainOeuvre = selectedCrop.productionCosts.mainOeuvre;
          hasUpdates = true;
        }
        if (formData.autresCouts === 0) {
          updates.autresCouts = selectedCrop.productionCosts.pesticides;
          hasUpdates = true;
        }
        if (formData.rendementAttendu === 0) {
          updates.rendementAttendu = selectedCrop.averageYieldPerHectare;
          hasUpdates = true;
        }

        if (hasUpdates) {
          setFormData(prev => ({ ...prev, ...updates }));
          setIsAutoFilled(true);
        }
      }
    } else {
      setIsAutoFilled(false);
    }
  }, [formData.cultureId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nom && formData.surface > 0) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof ParcelleFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetToCropDefaults = () => {
    if (formData.cultureId) {
      const selectedCrop = IVORY_COAST_CROPS.find(crop => crop.id === formData.cultureId);
      if (selectedCrop) {
        setFormData(prev => ({
          ...prev,
          coutsPrepration: selectedCrop.productionCosts.semences,
          coutsIntrants: selectedCrop.productionCosts.engrais,
          coutsMainOeuvre: selectedCrop.productionCosts.mainOeuvre,
          autresCouts: selectedCrop.productionCosts.pesticides,
          rendementAttendu: selectedCrop.averageYieldPerHectare
        }));
        setIsAutoFilled(true);
      }
    }
  };

  const isValid = formData.nom.trim() && formData.surface > 0;
  const totalCosts = formData.coutsPrepration + formData.coutsIntrants + formData.coutsMainOeuvre + formData.autresCouts;
  const selectedCrop = formData.cultureId ? IVORY_COAST_CROPS.find(crop => crop.id === formData.cultureId) : null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom de la parcelle *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => updateField('nom', e.target.value)}
                placeholder="ex: Parcelle Nord"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="surface">Surface (hectares) *</Label>
              <Input
                id="surface"
                type="number"
                step="0.1"
                min="0"
                value={formData.surface || ''}
                onChange={(e) => updateField('surface', parseFloat(e.target.value) || 0)}
                placeholder="2.5"
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Sélection de culture */}
          <div>
            <Label className="text-base font-medium">Culture à assigner</Label>
            <div className="mt-2">
              <CultureSelector
                selectedCultureId={formData.cultureId}
                onCultureChange={(cultureId) => updateField('cultureId', cultureId)}
                showDetails={!!formData.cultureId}
              />
            </div>
          </div>

          {/* Message d'auto-remplissage */}
          {isAutoFilled && selectedCrop && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-blue-800 font-medium">Valeurs pré-remplies pour {selectedCrop.name}</p>
                <p className="text-blue-700 text-sm mt-1">
                  Les coûts de production et le rendement ont été automatiquement remplis selon les données CNRA/ANADER. 
                  Vous pouvez les modifier selon vos besoins.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetToCropDefaults}
                  className="mt-2 text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  Restaurer les valeurs par défaut
                </Button>
              </div>
            </div>
          )}

          {/* Coûts de production */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Coûts de Production (FCFA)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coutsPrepration">Coûts de préparation du sol</Label>
                <Input
                  id="coutsPrepration"
                  type="number"
                  min="0"
                  value={formData.coutsPrepration || ''}
                  onChange={(e) => updateField('coutsPrepration', parseFloat(e.target.value) || 0)}
                  placeholder="500000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="coutsIntrants">Coûts des intrants</Label>
                <Input
                  id="coutsIntrants"
                  type="number"
                  min="0"
                  value={formData.coutsIntrants || ''}
                  onChange={(e) => updateField('coutsIntrants', parseFloat(e.target.value) || 0)}
                  placeholder="300000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="coutsMainOeuvre">Coûts de main d'œuvre</Label>
                <Input
                  id="coutsMainOeuvre"
                  type="number"
                  min="0"
                  value={formData.coutsMainOeuvre || ''}
                  onChange={(e) => updateField('coutsMainOeuvre', parseFloat(e.target.value) || 0)}
                  placeholder="200000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="autresCouts">Autres coûts</Label>
                <Input
                  id="autresCouts"
                  type="number"
                  min="0"
                  value={formData.autresCouts || ''}
                  onChange={(e) => updateField('autresCouts', parseFloat(e.target.value) || 0)}
                  placeholder="100000"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Récapitulatif des coûts */}
            {totalCosts > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Coûts totaux:</span>
                    <span className="ml-2 text-lg font-bold text-blue-600">
                      {totalCosts.toLocaleString()} FCFA
                    </span>
                  </div>
                  {formData.surface > 0 && (
                    <div>
                      <span className="font-medium">Coût par hectare:</span>
                      <span className="ml-2 text-lg font-bold text-blue-600">
                        {(totalCosts / formData.surface).toLocaleString()} FCFA/ha
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rendement attendu */}
          <div>
            <Label htmlFor="rendementAttendu">Rendement attendu (kg/ha/an)</Label>
            <Input
              id="rendementAttendu"
              type="number"
              min="0"
              value={formData.rendementAttendu || ''}
              onChange={(e) => updateField('rendementAttendu', parseFloat(e.target.value) || 0)}
              placeholder="5000"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Si une culture est assignée, le rendement sera calculé automatiquement selon les données CNRA/ANADER
            </p>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Informations supplémentaires sur la parcelle..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              disabled={!isValid}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Enregistrer la parcelle</span>
            </Button>
            
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
          </div>

          {!isValid && (
            <p className="text-sm text-red-600">
              Veuillez remplir au minimum le nom et la surface de la parcelle
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
