
export interface Parcelle {
  id: string;
  nom: string;
  surface: number; // en hectares
  cultureId: string | null;
  coutsPrepration: number;
  coutsIntrants: number;
  coutsMainOeuvre: number;
  autresCouts: number;
  rendementAttendu: number; // unités par hectare
  dateCreation: Date;
  statut: 'preparee' | 'plantee' | 'en_croissance' | 'recoltee';
  notes?: string;
}

export interface CultureParcelle {
  parcelleId: string;
  cultureId: string;
  datePlantation: Date;
  dateRecoltePrevu: Date;
  quantitePlantee: number;
  rendementReel?: number;
}

export interface ParcelleCalculations {
  coutsTotaux: number;
  revenus: number;
  margeParHectare: number;
  margeTotale: number;
  rentabilite: number; // en pourcentage
}
