
export interface CropType {
  id: string;
  name: string;
  category: 'maraichage' | 'vivrier';
  cycleMonths: number;
  seasons: string[];
  unitType: 'kg' | 'tonne' | 'sac' | 'cuvette';
  averageYieldPerHectare: number;
  averagePricePerUnit: number;
  averageCostPerUnit: number;
  description: string;
}

export const IVORY_COAST_CROPS: CropType[] = [
  // Cultures maraîchères (cycles courts)
  {
    id: 'tomate',
    name: 'Tomate',
    category: 'maraichage',
    cycleMonths: 3,
    seasons: ['Saison sèche', 'Début hivernage'],
    unitType: 'cuvette',
    averageYieldPerHectare: 1500,
    averagePricePerUnit: 2500,
    averageCostPerUnit: 1200,
    description: 'Culture maraîchère rentable, 3-4 cycles par an'
  },
  {
    id: 'oignon',
    name: 'Oignon',
    category: 'maraichage',
    cycleMonths: 4,
    seasons: ['Saison sèche'],
    unitType: 'sac',
    averageYieldPerHectare: 200,
    averagePricePerUnit: 35000,
    averageCostPerUnit: 18000,
    description: 'Culture de contre-saison très profitable'
  },
  {
    id: 'salade',
    name: 'Salade',
    category: 'maraichage',
    cycleMonths: 2,
    seasons: ['Saison sèche', 'Début hivernage'],
    unitType: 'cuvette',
    averageYieldPerHectare: 2000,
    averagePricePerUnit: 1500,
    averageCostPerUnit: 800,
    description: 'Cycle très court, rotation rapide'
  },
  {
    id: 'gombo',
    name: 'Gombo',
    category: 'maraichage',
    cycleMonths: 3,
    seasons: ['Hivernage', 'Post-hivernage'],
    unitType: 'kg',
    averageYieldPerHectare: 8000,
    averagePricePerUnit: 400,
    averageCostPerUnit: 200,
    description: 'Légume traditionnel très demandé'
  },
  {
    id: 'aubergine',
    name: 'Aubergine',
    category: 'maraichage',
    cycleMonths: 4,
    seasons: ['Hivernage', 'Post-hivernage'],
    unitType: 'kg',
    averageYieldPerHectare: 15000,
    averagePricePerUnit: 300,
    averageCostPerUnit: 150,
    description: 'Production étalée sur plusieurs mois'
  },

  // Cultures vivrières (cycles longs)
  {
    id: 'mais',
    name: 'Maïs',
    category: 'vivrier',
    cycleMonths: 4,
    seasons: ['Hivernage'],
    unitType: 'sac',
    averageYieldPerHectare: 80,
    averagePricePerUnit: 18000,
    averageCostPerUnit: 8000,
    description: 'Céréale de base, forte demande locale'
  },
  {
    id: 'riz',
    name: 'Riz pluvial',
    category: 'vivrier',
    cycleMonths: 5,
    seasons: ['Hivernage'],
    unitType: 'sac',
    averageYieldPerHectare: 60,
    averagePricePerUnit: 22000,
    averageCostPerUnit: 12000,
    description: 'Aliment de base, marché garanti'
  },
  {
    id: 'manioc',
    name: 'Manioc',
    category: 'vivrier',
    cycleMonths: 12,
    seasons: ['Toute année'],
    unitType: 'tonne',
    averageYieldPerHectare: 15,
    averagePricePerUnit: 80000,
    averageCostPerUnit: 35000,
    description: 'Tubercule de sécurité alimentaire'
  },
  {
    id: 'igname',
    name: 'Igname',
    category: 'vivrier',
    cycleMonths: 8,
    seasons: ['Début hivernage'],
    unitType: 'tonne',
    averageYieldPerHectare: 12,
    averagePricePerUnit: 120000,
    averageCostPerUnit: 60000,
    description: 'Tubercule noble, forte valeur ajoutée'
  },
  {
    id: 'arachide',
    name: 'Arachide',
    category: 'vivrier',
    cycleMonths: 4,
    seasons: ['Hivernage'],
    unitType: 'sac',
    averageYieldPerHectare: 25,
    averagePricePerUnit: 45000,
    averageCostPerUnit: 25000,
    description: 'Légumineuse riche en protéines'
  }
];

export const AGRICULTURAL_SEASONS = [
  {
    name: 'Saison sèche',
    period: 'Novembre - Mars',
    description: 'Période idéale pour le maraîchage irrigué'
  },
  {
    name: 'Hivernage',
    period: 'Avril - Octobre', 
    description: 'Saison des pluies pour les cultures pluviales'
  },
  {
    name: 'Post-hivernage',
    period: 'Septembre - Novembre',
    description: 'Fin de saison des pluies'
  }
];

export const AGRICULTURAL_EXPENSES_CI = [
  { id: '1', category: 'Semences et Plants', monthlyAmount: 150000, growthRate: 5, isAutoCalculated: false },
  { id: '2', category: 'Engrais et Amendements', monthlyAmount: 200000, growthRate: 8, isAutoCalculated: false },
  { id: '3', category: 'Pesticides et Fongicides', monthlyAmount: 80000, growthRate: 6, isAutoCalculated: false },
  { id: '4', category: 'Main-d\'œuvre Permanente', monthlyAmount: 300000, growthRate: 3, isAutoCalculated: false },
  { id: '5', category: 'Main-d\'œuvre Saisonnière', monthlyAmount: 500000, growthRate: 4, isAutoCalculated: false },
  { id: '6', category: 'Carburant et Huiles', monthlyAmount: 120000, growthRate: 10, isAutoCalculated: false },
  { id: '7', category: 'Transport et Logistique', monthlyAmount: 180000, growthRate: 5, isAutoCalculated: false },
  { id: '8', category: 'Stockage et Conservation', monthlyAmount: 100000, growthRate: 3, isAutoCalculated: false },
  { id: '9', category: 'Location Matériel Agricole', monthlyAmount: 150000, growthRate: 4, isAutoCalculated: false },
  { id: '10', category: 'Entretien Équipements', monthlyAmount: 80000, growthRate: 6, isAutoCalculated: false },
  { id: '11', category: 'Eau et Irrigation', monthlyAmount: 90000, growthRate: 7, isAutoCalculated: false },
  { id: '12', category: 'Assurance Récolte', monthlyAmount: 50000, growthRate: 2, isAutoCalculated: false },
  { id: '13', category: 'Frais Vétérinaires', monthlyAmount: 40000, growthRate: 3, isAutoCalculated: false },
  { id: '14', category: 'Taxes et Redevances', monthlyAmount: 35000, growthRate: 2, isAutoCalculated: false },
];

export const IVORY_COAST_TAX_RATES = {
  corporateTaxRate: 25, // Impôt sur les sociétés en Côte d'Ivoire
  vat: 18, // TVA ivoirienne
  cnpsRate: 16.3, // Charges sociales CNPS (employeur)
  cnpsEmployeeRate: 3.2, // Charges sociales CNPS (employé)
  minimumWage: 60000, // SMIG ivoirien par mois
  agricultureTaxExemption: true // Exonérations fiscales agriculture
};
