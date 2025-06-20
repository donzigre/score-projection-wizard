
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save } from "lucide-react";
import { useFinancialData } from '@/contexts/FinancialDataContext';

interface ParcelleFormData {
  nom: string;
  surface: number;
  coutsPrepration: number;
  coutsIntrants: number;
  coutsMainOeuvre: number;
  autresCouts: number;
  rendementAttendu: number;
  cultureId: string;
}

interface ParcelleFormProps {
  onSubmit: (data: Omit<ParcelleFormData, 'cultureId'> & { cultureId: string | null }) => void;
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
  const { data } = useFinancialData();
  const [formData, setFormData] = useState<ParcelleFormData>({
    nom: initialData.nom || '',
    surface: initialData.surface || 0,
    coutsPrepration: initialData.coutsPrepration || 0,
    coutsIntrants: initialData.coutsIntrants || 0,
    coutsMainOeuvre: initialData.coutsMainOeuvre || 0,
    autresCouts: initialData.autresCouts || 0,
    rendementAttendu: initialData.rendementAttendu || 0,
    cultureId: initialData.cultureId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nom && formData.surface > 0) {
      onSubmit({
        ...formData,
        cultureId: formData.cultureId || null
      });
    }
  };

  const updateField = (field: keyof ParcelleFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isValid = formData.nom.trim() && formData.surface > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Culture assignée */}
          <div>
            <Label>Culture à planter</Label>
            <Select
              value={formData.cultureId}
              onValueChange={(value) => updateField('cultureId', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choisir une culture (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune culture pour le moment</SelectItem>
                {data.products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Coûts */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Coûts de Production (FCFA)</h4>
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
                <Label htmlFor="coutsIntrants">Coûts des intrants (semences, engrais)</Label>
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
          </div>

          {/* Calcul automatique des coûts totaux */}
          {(formData.coutsPrepration || formData.coutsIntrants || formData.coutsMainOeuvre || formData.autresCouts) && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Coûts totaux estimés :</strong> {' '}
                {(formData.coutsPrepration + formData.coutsIntrants + formData.coutsMainOeuvre + formData.autresCouts).toLocaleString()} FCFA
              </p>
              {formData.surface > 0 && (
                <p className="text-sm text-blue-700">
                  <strong>Coût par hectare :</strong> {' '}
                  {((formData.coutsPrepration + formData.coutsIntrants + formData.coutsMainOeuvre + formData.autresCouts) / formData.surface).toLocaleString()} FCFA/ha
                </p>
              )}
            </div>
          )}

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
