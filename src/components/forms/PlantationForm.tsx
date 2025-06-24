
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Save, X } from "lucide-react";

interface PlantationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  title?: string;
}

const REGIONS_COTE_DIVOIRE = [
  "Abidjan", "Agnéby-Tiassa", "Bafing", "Bagoué", "Béré", "Bounkani", 
  "Cavally", "Folon", "Gbêkê", "Gbokle", "Gôh", "Grands-Ponts", 
  "Guémon", "Hambol", "Haut-Sassandra", "Iffou", "Indénié-Djuablin", 
  "Kabadougou", "La Mé", "Lôh-Djiboua", "Marahoué", "Moronou", 
  "Nawa", "N'Zi", "Poro", "San-Pédro", "Tchologo", "Tonkpi", 
  "Worodougou", "Yamoussoukro"
];

export const PlantationForm: React.FC<PlantationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  title = "Nouvelle Plantation"
}) => {
  const [formData, setFormData] = useState({
    nom: initialData?.nom || '',
    proprietaire: initialData?.proprietaire || '',
    typeExploitation: initialData?.typeExploitation || 'familiale',
    localisation: {
      region: initialData?.localisation?.region || '',
      ville: initialData?.localisation?.ville || '',
      coordonnees: initialData?.localisation?.coordonnees || { lat: 0, lng: 0 }
    },
    surfaceTotale: initialData?.surfaceTotale || 0,
    description: initialData?.description || '',
    statut: initialData?.statut || 'active',
    notes: initialData?.notes || ''
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de la plantation</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Ex: Plantation de Bouaké"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proprietaire">Propriétaire</Label>
              <Input
                id="proprietaire"
                value={formData.proprietaire}
                onChange={(e) => handleInputChange('proprietaire', e.target.value)}
                placeholder="Nom du propriétaire"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="typeExploitation">Type d'exploitation</Label>
              <Select 
                value={formData.typeExploitation} 
                onValueChange={(value) => handleInputChange('typeExploitation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="familiale">Familiale</SelectItem>
                  <SelectItem value="commerciale">Commerciale</SelectItem>
                  <SelectItem value="cooperative">Coopérative</SelectItem>
                  <SelectItem value="industrielle">Industrielle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="surfaceTotale">Surface totale (hectares)</Label>
              <Input
                id="surfaceTotale"
                type="number"
                step="0.1"
                min="0"
                value={formData.surfaceTotale}
                onChange={(e) => handleInputChange('surfaceTotale', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Région</Label>
              <Select 
                value={formData.localisation.region} 
                onValueChange={(value) => handleInputChange('localisation.region', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la région" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS_COTE_DIVOIRE.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville">Ville/Village</Label>
              <Input
                id="ville"
                value={formData.localisation.ville}
                onChange={(e) => handleInputChange('localisation.ville', e.target.value)}
                placeholder="Ex: Yamoussoukro"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de la plantation, caractéristiques du sol, climat, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes additionnelles</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notes personnelles, observations, etc."
              rows={2}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex items-center gap-2 flex-1">
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
