
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { CropType, IVORY_COAST_REGIONS, AGRICULTURAL_SEASONS } from '@/config/ivoryCoastAgriculture';

interface CustomCropFormProps {
  onSubmit: (crop: Omit<CropType, 'id'>) => void;
  onCancel: () => void;
  initialData?: Partial<CropType>;
}

export const CustomCropForm: React.FC<CustomCropFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState<Omit<CropType, 'id'>>({
    name: initialData?.name || '',
    category: initialData?.category || 'maraichage',
    cycleMonths: initialData?.cycleMonths || 3,
    seasons: initialData?.seasons || [],
    unitType: initialData?.unitType || 'kg',
    averageYieldPerHectare: initialData?.averageYieldPerHectare || 0,
    regionalPrices: initialData?.regionalPrices || { min: 0, max: 0, average: 0 },
    productionCosts: initialData?.productionCosts || {
      semences: 0,
      engrais: 0,
      pesticides: 0,
      mainOeuvre: 0
    },
    plantingDensity: initialData?.plantingDensity || 0,
    description: initialData?.description || '',
    bestRegions: initialData?.bestRegions || [],
    rotationCompatible: initialData?.rotationCompatible || []
  });

  const [newRegion, setNewRegion] = useState('');
  const [newSeason, setNewSeason] = useState('');

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent as keyof typeof prev], [field]: value }
    }));
  };

  const addRegion = () => {
    if (newRegion && !formData.bestRegions.includes(newRegion)) {
      updateFormData('bestRegions', [...formData.bestRegions, newRegion]);
      setNewRegion('');
    }
  };

  const removeRegion = (region: string) => {
    updateFormData('bestRegions', formData.bestRegions.filter(r => r !== region));
  };

  const addSeason = () => {
    if (newSeason && !formData.seasons.includes(newSeason)) {
      updateFormData('seasons', [...formData.seasons, newSeason]);
      setNewSeason('');
    }
  };

  const removeSeason = (season: string) => {
    updateFormData('seasons', formData.seasons.filter(s => s !== season));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculer le prix moyen si min et max sont renseignés
    if (formData.regionalPrices.min > 0 && formData.regionalPrices.max > 0 && formData.regionalPrices.average === 0) {
      const average = (formData.regionalPrices.min + formData.regionalPrices.max) / 2;
      updateNestedField('regionalPrices', 'average', average);
    }
    
    onSubmit(formData);
  };

  const isFormValid = formData.name && formData.averageYieldPerHectare > 0 && formData.regionalPrices.average > 0;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Ajouter une Culture Personnalisée</span>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="crop-name">Nom de la Culture *</Label>
              <Input
                id="crop-name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Ex: Patate douce"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateFormData('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maraichage">Maraîchage</SelectItem>
                  <SelectItem value="vivrier">Vivrier</SelectItem>
                  <SelectItem value="tubercule">Tubercule</SelectItem>
                  <SelectItem value="legumineuse">Légumineuse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cycle-months">Cycle (mois) *</Label>
              <Input
                id="cycle-months"
                type="number"
                min="1"
                max="24"
                value={formData.cycleMonths}
                onChange={(e) => updateFormData('cycleMonths', Number(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="unit-type">Unité de Vente</Label>
              <Select
                value={formData.unitType}
                onValueChange={(value) => updateFormData('unitType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                  <SelectItem value="tonne">Tonne</SelectItem>
                  <SelectItem value="sac">Sac</SelectItem>
                  <SelectItem value="cuvette">Cuvette</SelectItem>
                  <SelectItem value="botte">Botte</SelectItem>
                  <SelectItem value="panier">Panier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rendement et prix */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Rendement et Production</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="yield">Rendement par hectare *</Label>
                  <Input
                    id="yield"
                    type="number"
                    value={formData.averageYieldPerHectare}
                    onChange={(e) => updateFormData('averageYieldPerHectare', Number(e.target.value))}
                    placeholder="Ex: 15000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="density">Densité de plantation (/ha)</Label>
                  <Input
                    id="density"
                    type="number"
                    value={formData.plantingDensity}
                    onChange={(e) => updateFormData('plantingDensity', Number(e.target.value))}
                    placeholder="Ex: 25000"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Prix Régionaux (FCFA)</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="price-min">Prix minimum</Label>
                  <Input
                    id="price-min"
                    type="number"
                    value={formData.regionalPrices.min}
                    onChange={(e) => updateNestedField('regionalPrices', 'min', Number(e.target.value))}
                    placeholder="Ex: 200"
                  />
                </div>
                <div>
                  <Label htmlFor="price-max">Prix maximum</Label>
                  <Input
                    id="price-max"
                    type="number"
                    value={formData.regionalPrices.max}
                    onChange={(e) => updateNestedField('regionalPrices', 'max', Number(e.target.value))}
                    placeholder="Ex: 400"
                  />
                </div>
                <div>
                  <Label htmlFor="price-avg">Prix moyen *</Label>
                  <Input
                    id="price-avg"
                    type="number"
                    value={formData.regionalPrices.average}
                    onChange={(e) => updateNestedField('regionalPrices', 'average', Number(e.target.value))}
                    placeholder="Ex: 300"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Coûts de production */}
          <div>
            <h4 className="font-medium mb-3">Coûts de Production par Hectare (FCFA)</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="cost-seeds">Semences</Label>
                <Input
                  id="cost-seeds"
                  type="number"
                  value={formData.productionCosts.semences}
                  onChange={(e) => updateNestedField('productionCosts', 'semences', Number(e.target.value))}
                  placeholder="Ex: 80000"
                />
              </div>
              <div>
                <Label htmlFor="cost-fertilizer">Engrais</Label>
                <Input
                  id="cost-fertilizer"
                  type="number"
                  value={formData.productionCosts.engrais}
                  onChange={(e) => updateNestedField('productionCosts', 'engrais', Number(e.target.value))}
                  placeholder="Ex: 120000"
                />
              </div>
              <div>
                <Label htmlFor="cost-pesticides">Pesticides</Label>
                <Input
                  id="cost-pesticides"
                  type="number"
                  value={formData.productionCosts.pesticides}
                  onChange={(e) => updateNestedField('productionCosts', 'pesticides', Number(e.target.value))}
                  placeholder="Ex: 60000"
                />
              </div>
              <div>
                <Label htmlFor="cost-labor">Main d'œuvre</Label>
                <Input
                  id="cost-labor"
                  type="number"
                  value={formData.productionCosts.mainOeuvre}
                  onChange={(e) => updateNestedField('productionCosts', 'mainOeuvre', Number(e.target.value))}
                  placeholder="Ex: 180000"
                />
              </div>
            </div>
          </div>

          {/* Régions et saisons */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Régions Adaptées</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select value={newRegion} onValueChange={setNewRegion}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Ajouter une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {IVORY_COAST_REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                      <SelectItem value="Toutes régions">Toutes régions</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addRegion} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.bestRegions.map((region) => (
                    <Badge key={region} variant="secondary" className="flex items-center gap-1">
                      {region}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeRegion(region)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Saisons de Culture</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select value={newSeason} onValueChange={setNewSeason}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Ajouter une saison" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGRICULTURAL_SEASONS.map((season) => (
                        <SelectItem key={season.name} value={season.name}>{season.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addSeason} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seasons.map((season) => (
                    <Badge key={season} variant="secondary" className="flex items-center gap-1">
                      {season}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeSeason(season)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Décrivez les caractéristiques de cette culture..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Ajouter la Culture
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
