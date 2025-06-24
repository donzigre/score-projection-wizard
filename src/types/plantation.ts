
export interface Plantation {
  id: string;
  nom: string;
  localisation: {
    region: string;
    ville: string;
    coordonnees?: { lat: number; lng: number };
  };
  surfaceTotale: number;
  proprietaire: string;
  typeExploitation: 'familiale' | 'commerciale' | 'cooperative' | 'industrielle';
  description?: string;
  dateCreation: Date;
  statut: 'active' | 'inactive' | 'en_preparation';
  notes?: string;
}

export interface CultureHistorique {
  id: string;
  cultureId: string;
  datePlantation: Date;
  dateRecolte?: Date;
  rendementReel?: number;
  statut: 'planifiee' | 'en_cours' | 'recoltee' | 'terminee';
  notes?: string;
}

export interface ParcelleWithHistory {
  id: string;
  nom: string;
  surface: number;
  typesSol: string[];
  pente: 'plat' | 'leger' | 'modere' | 'fort';
  accesChemin: boolean;
  sourceEau: 'pluie' | 'irrigation' | 'puits' | 'riviere';
  coordonnees?: { lat: number; lng: number };
  dateCreation: Date;
  notes?: string;
  cultureId: string | null;
  plantationId: string;
  culturesHistorique: CultureHistorique[];
  cultureActuelle?: string;
  rotationPrevue?: string[];
}

export interface PlantationCalculations {
  surfaceTotale: number;
  nombreParcelles: number;
  coutsTotaux: number;
  revenus: number;
  margeTotale: number;
  rentabilite: number;
  parcellesActives: number;
  culturesDistinctes: number;
}
