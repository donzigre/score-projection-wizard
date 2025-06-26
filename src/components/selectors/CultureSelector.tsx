
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Leaf, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { IVORY_COAST_CROPS, CropType } from '@/config/ivoryCoastAgriculture';
import { formatCurrency } from '@/utils/formatting';

interface CultureSelectorProps {
  selectedCultureId: string | null;
  onCultureChange: (cultureId: string | null) => void;
  showDetails?: boolean;
}

export const CultureSelector: React.FC<CultureSelectorProps> = ({
  selectedCultureId,
  onCultureChange,
  showDetails = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Toutes les cultures' },
    { value: 'maraichage', label: 'Maraîchage' },
    { value: 'vivrier', label: 'Vivrier' },
    { value: 'tubercule', label: 'Tubercules' },
    { value: 'legumineuse', label: 'Légumineuses' }
  ];

  const filteredCrops = IVORY_COAST_CROPS.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    const isCurrentlySelected = selectedCultureId === crop.id;
    
    // Always include the currently selected crop, even if it doesn't match filters
    return (matchesSearch && matchesCategory) || isCurrentlySelected;
  });

  const selectedCrop = selectedCultureId ? IVORY_COAST_CROPS.find(c => c.id === selectedCultureId) : null;

  const getCategoryColor = (category: string) => {
    const colors = {
      'maraichage': 'bg-green-100 text-green-800',
      'vivrier': 'bg-yellow-100 text-yellow-800',
      'tubercule': 'bg-orange-100 text-orange-800',
      'legumineuse': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une culture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sélecteur principal */}
      <Select 
        value={selectedCultureId || "no-culture"} 
        onValueChange={(value) => onCultureChange(value === "no-culture" ? null : value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner une culture" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <SelectItem value="no-culture">Aucune culture</SelectItem>
          {filteredCrops.map((crop) => (
            <SelectItem key={crop.id} value={crop.id} className="py-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{crop.name}</span>
                </div>
                <Badge className={getCategoryColor(crop.category)}>
                  {crop.category}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Détails de la culture sélectionnée */}
      {showDetails && selectedCrop && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              {selectedCrop.name}
              <Badge className={getCategoryColor(selectedCrop.category)}>
                {selectedCrop.category}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{selectedCrop.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Cycle:</span>
                  <span>{selectedCrop.cycleMonths} mois</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Rendement:</span>
                  <span>{selectedCrop.averageYieldPerHectare.toLocaleString()} {selectedCrop.unitType}/ha</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Prix moyen:</span>
                  <span>{formatCurrency(selectedCrop.regionalPrices.average)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Saisons: {selectedCrop.seasons.join(', ')}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Coûts de production par hectare:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Semences: {formatCurrency(selectedCrop.productionCosts.semences)}</div>
                <div>Engrais: {formatCurrency(selectedCrop.productionCosts.engrais)}</div>
                <div>Pesticides: {formatCurrency(selectedCrop.productionCosts.pesticides)}</div>
                <div>Main d'œuvre: {formatCurrency(selectedCrop.productionCosts.mainOeuvre)}</div>
              </div>
            </div>

            {selectedCrop.bestRegions.length > 0 && (
              <div>
                <span className="font-medium">Régions recommandées: </span>
                <span className="text-gray-600">{selectedCrop.bestRegions.join(', ')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
