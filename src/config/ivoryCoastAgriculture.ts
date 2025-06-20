export interface CropType {
  id: string;
  name: string;
  category: 'maraichage' | 'vivrier' | 'tubercule' | 'legumineuse';
  cycleMonths: number;
  seasons: string[];
  unitType: 'kg' | 'tonne' | 'sac' | 'cuvette' | 'botte' | 'panier';
  averageYieldPerHectare: number;
  regionalPrices: {
    min: number;
    max: number;
    average: number;
  };
  productionCosts: {
    semences: number; // FCFA par hectare
    engrais: number;
    pesticides: number;
    mainOeuvre: number;
  };
  plantingDensity: number; // plants par hectare
  description: string;
  bestRegions: string[];
  rotationCompatible: string[];
}

export const IVORY_COAST_CROPS: CropType[] = [
  // Cultures maraîchères
  {
    id: 'tomate',
    name: 'Tomate',
    category: 'maraichage',
    cycleMonths: 3,
    seasons: ['Saison sèche', 'Début hivernage'],
    unitType: 'cuvette',
    averageYieldPerHectare: 1500,
    regionalPrices: { min: 2000, max: 3500, average: 2750 },
    productionCosts: { semences: 80000, engrais: 120000, pesticides: 60000, mainOeuvre: 180000 },
    plantingDensity: 25000,
    description: 'Culture maraîchère très rentable, 3-4 cycles par an possible',
    bestRegions: ['Abidjan', 'Bouaké', 'Korhogo'],
    rotationCompatible: ['salade', 'gombo', 'haricot-vert']
  },
  {
    id: 'oignon',
    name: 'Oignon',
    category: 'maraichage',
    cycleMonths: 4,
    seasons: ['Saison sèche'],
    unitType: 'sac',
    averageYieldPerHectare: 200,
    regionalPrices: { min: 30000, max: 45000, average: 37500 },
    productionCosts: { semences: 150000, engrais: 200000, pesticides: 80000, mainOeuvre: 220000 },
    plantingDensity: 400000,
    description: 'Culture de contre-saison très profitable, forte demande',
    bestRegions: ['Korhogo', 'Ferkessédougou', 'Bouaké'],
    rotationCompatible: ['mais', 'riz']
  },
  {
    id: 'salade',
    name: 'Salade',
    category: 'maraichage',
    cycleMonths: 2,
    seasons: ['Saison sèche', 'Début hivernage'],
    unitType: 'botte',
    averageYieldPerHectare: 8000,
    regionalPrices: { min: 200, max: 400, average: 300 },
    productionCosts: { semences: 40000, engrais: 60000, pesticides: 30000, mainOeuvre: 120000 },
    plantingDensity: 100000,
    description: 'Cycle très court, rotation rapide, marché urbain',
    bestRegions: ['Abidjan', 'Yamoussoukro', 'Bouaké'],
    rotationCompatible: ['tomate', 'chou', 'carotte']
  },
  {
    id: 'gombo',
    name: 'Gombo',
    category: 'maraichage',
    cycleMonths: 3,
    seasons: ['Hivernage', 'Post-hivernage'],
    unitType: 'kg',
    averageYieldPerHectare: 8000,
    regionalPrices: { min: 350, max: 500, average: 425 },
    productionCosts: { semences: 25000, engrais: 80000, pesticides: 40000, mainOeuvre: 140000 },
    plantingDensity: 40000,
    description: 'Légume traditionnel très demandé, résistant',
    bestRegions: ['Toutes régions'],
    rotationCompatible: ['aubergine', 'piment', 'haricot-vert']
  },
  {
    id: 'aubergine',
    name: 'Aubergine',
    category: 'maraichage',
    cycleMonths: 4,
    seasons: ['Hivernage', 'Post-hivernage'],
    unitType: 'kg',
    averageYieldPerHectare: 15000,
    regionalPrices: { min: 250, max: 400, average: 325 },
    productionCosts: { semences: 60000, engrais: 100000, pesticides: 50000, mainOeuvre: 160000 },
    plantingDensity: 20000,
    description: 'Production étalée, bon rendement',
    bestRegions: ['Abidjan', 'Bouaké', 'San-Pédro'],
    rotationCompatible: ['gombo', 'piment', 'concombre']
  },
  {
    id: 'piment',
    name: 'Piment',
    category: 'maraichage',
    cycleMonths: 4,
    seasons: ['Hivernage', 'Post-hivernage'],
    unitType: 'kg',
    averageYieldPerHectare: 12000,
    regionalPrices: { min: 800, max: 1500, average: 1150 },
    productionCosts: { semences: 80000, engrais: 120000, pesticides: 60000, mainOeuvre: 180000 },
    plantingDensity: 25000,
    description: 'Forte valeur ajoutée, demande croissante',
    bestRegions: ['Toutes régions'],
    rotationCompatible: ['aubergine', 'gombo', 'tomate']
  },
  {
    id: 'chou',
    name: 'Chou',
    category: 'maraichage',
    cycleMonths: 3,
    seasons: ['Saison sèche'],
    unitType: 'kg',
    averageYieldPerHectare: 20000,
    regionalPrices: { min: 150, max: 300, average: 225 },
    productionCosts: { semences: 100000, engrais: 150000, pesticides: 80000, mainOeuvre: 200000 },
    plantingDensity: 40000,
    description: 'Légume de saison fraîche, bon rendement',
    bestRegions: ['Bouaké', 'Korhogo', 'Man'],
    rotationCompatible: ['carotte', 'salade', 'haricot-vert']
  },
  {
    id: 'carotte',
    name: 'Carotte',
    category: 'maraichage',
    cycleMonths: 3,
    seasons: ['Saison sèche'],
    unitType: 'kg',
    averageYieldPerHectare: 15000,
    regionalPrices: { min: 200, max: 400, average: 300 },
    productionCosts: { semences: 120000, engrais: 100000, pesticides: 50000, mainOeuvre: 150000 },
    plantingDensity: 500000,
    description: 'Culture de saison fraîche, marché en croissance',
    bestRegions: ['Bouaké', 'Korhogo', 'Man'],
    rotationCompatible: ['chou', 'salade', 'oignon']
  },
  {
    id: 'concombre',
    name: 'Concombre',
    category: 'maraichage',
    cycleMonths: 3,
    seasons: ['Hivernage', 'Saison sèche'],
    unitType: 'kg',
    averageYieldPerHectare: 18000,
    regionalPrices: { min: 200, max: 350, average: 275 },
    productionCosts: { semences: 50000, engrais: 80000, pesticides: 40000, mainOeuvre: 120000 },
    plantingDensity: 15000,
    description: 'Culture polyvalente, demande urbaine',
    bestRegions: ['Abidjan', 'Bouaké', 'Yamoussoukro'],
    rotationCompatible: ['tomate', 'aubergine', 'gombo']
  },
  {
    id: 'haricot-vert',
    name: 'Haricot Vert',
    category: 'maraichage',
    cycleMonths: 2,
    seasons: ['Hivernage', 'Post-hivernage'],
    unitType: 'kg',
    averageYieldPerHectare: 8000,
    regionalPrices: { min: 400, max: 700, average: 550 },
    productionCosts: { semences: 60000, engrais: 80000, pesticides: 30000, mainOeuvre: 140000 },
    plantingDensity: 250000,
    description: 'Cycle court, améliore le sol, rentable',
    bestRegions: ['Bouaké', 'Korhogo', 'Daloa'],
    rotationCompatible: ['mais', 'riz', 'chou']
  },

  // Cultures vivrières
  {
    id: 'mais',
    name: 'Maïs',
    category: 'vivrier',
    cycleMonths: 4,
    seasons: ['Hivernage'],
    unitType: 'sac',
    averageYieldPerHectare: 80,
    regionalPrices: { min: 15000, max: 22000, average: 18500 },
    productionCosts: { semences: 40000, engrais: 120000, pesticides: 30000, mainOeuvre: 100000 },
    plantingDensity: 53000,
    description: 'Céréale de base, forte demande locale',
    bestRegions: ['Toutes régions'],
    rotationCompatible: ['arachide', 'niebe', 'soja']
  },
  {
    id: 'riz',
    name: 'Riz Pluvial',
    category: 'vivrier',
    cycleMonths: 5,
    seasons: ['Hivernage'],
    unitType: 'sac',
    averageYieldPerHectare: 60,
    regionalPrices: { min: 18000, max: 26000, average: 22000 },
    productionCosts: { semences: 80000, engrais: 150000, pesticides: 40000, mainOeuvre: 120000 },
    plantingDensity: 120000,
    description: 'Aliment de base, marché garanti',
    bestRegions: ['Bouaké', 'Korhogo', 'Ferkessédougou'],
    rotationCompatible: ['mais', 'arachide', 'niebe']
  },
  {
    id: 'arachide',
    name: 'Arachide',
    category: 'legumineuse',
    cycleMonths: 4,
    seasons: ['Hivernage'],
    unitType: 'sac',
    averageYieldPerHectare: 25,
    regionalPrices: { min: 40000, max: 55000, average: 47500 },
    productionCosts: { semences: 80000, engrais: 60000, pesticides: 25000, mainOeuvre: 120000 },
    plantingDensity: 125000,
    description: 'Légumineuse riche en protéines, améliore le sol',
    bestRegions: ['Bouaké', 'Korhogo', 'Katiola'],
    rotationCompatible: ['mais', 'riz', 'soja']
  },
  {
    id: 'soja',
    name: 'Soja',
    category: 'legumineuse',
    cycleMonths: 4,
    seasons: ['Hivernage'],
    unitType: 'sac',
    averageYieldPerHectare: 20,
    regionalPrices: { min: 45000, max: 65000, average: 55000 },
    productionCosts: { semences: 60000, engrais: 40000, pesticides: 20000, mainOeuvre: 100000 },
    plantingDensity: 400000,
    description: 'Forte demande industrielle, enrichit le sol',
    bestRegions: ['Bouaké', 'Katiola', 'Ferkessédougou'],
    rotationCompatible: ['mais', 'riz', 'arachide']
  },
  {
    id: 'niebe',
    name: 'Niébé (Haricot)',
    category: 'legumineuse',
    cycleMonths: 3,
    seasons: ['Hivernage', 'Post-hivernage'],
    unitType: 'sac',
    averageYieldPerHectare: 15,
    regionalPrices: { min: 50000, max: 70000, average: 60000 },
    productionCosts: { semences: 40000, engrais: 30000, pesticides: 15000, mainOeuvre: 80000 },
    plantingDensity: 62500,
    description: 'Haricot local, résistant à la sécheresse',
    bestRegions: ['Korhogo', 'Ferkessédougou', 'Odienné'],
    rotationCompatible: ['mais', 'riz', 'sesame']
  },
  {
    id: 'sesame',
    name: 'Sésame',
    category: 'vivrier',
    cycleMonths: 4,
    seasons: ['Hivernage'],
    unitType: 'sac',
    averageYieldPerHectare: 8,
    regionalPrices: { min: 80000, max: 120000, average: 100000 },
    productionCosts: { semences: 20000, engrais: 40000, pesticides: 15000, mainOeuvre: 80000 },
    plantingDensity: 200000,
    description: 'Culture de rente, forte valeur ajoutée',
    bestRegions: ['Korhogo', 'Ferkessédougou', 'Bondoukou'],
    rotationCompatible: ['mais', 'arachide', 'niebe']
  },

  // Tubercules
  {
    id: 'manioc',
    name: 'Manioc',
    category: 'tubercule',
    cycleMonths: 12,
    seasons: ['Toute année'],
    unitType: 'tonne',
    averageYieldPerHectare: 15,
    regionalPrices: { min: 70000, max: 90000, average: 80000 },
    productionCosts: { semences: 120000, engrais: 40000, pesticides: 20000, mainOeuvre: 150000 },
    plantingDensity: 10000,
    description: 'Tubercule de sécurité alimentaire, transformation possible',
    bestRegions: ['Toutes régions'],
    rotationCompatible: ['mais', 'arachide', 'plantain']
  },
  {
    id: 'igname',
    name: 'Igname',
    category: 'tubercule',
    cycleMonths: 8,
    seasons: ['Début hivernage'],
    unitType: 'tonne',
    averageYieldPerHectare: 12,
    regionalPrices: { min: 110000, max: 140000, average: 125000 },
    productionCosts: { semences: 200000, engrais: 80000, pesticides: 30000, mainOeuvre: 200000 },
    plantingDensity: 10000,
    description: 'Tubercule noble, forte valeur culturelle et commerciale',
    bestRegions: ['Bouaké', 'Yamoussoukro', 'Daloa'],
    rotationCompatible: ['mais', 'arachide', 'plantain']
  },
  {
    id: 'plantain',
    name: 'Plantain',
    category: 'tubercule',
    cycleMonths: 12,
    seasons: ['Toute année'],
    unitType: 'kg',
    averageYieldPerHectare: 25000,
    regionalPrices: { min: 150, max: 250, average: 200 },
    productionCosts: { semences: 300000, engrais: 100000, pesticides: 50000, mainOeuvre: 250000 },
    plantingDensity: 1600,
    description: 'Culture pérenne, production continue, forte demande',
    bestRegions: ['Abidjan', 'San-Pédro', 'Daloa'],
    rotationCompatible: ['manioc', 'igname', 'banane']
  },
  {
    id: 'banane-douce',
    name: 'Banane Douce',
    category: 'tubercule',
    cycleMonths: 12,
    seasons: ['Toute année'],
    unitType: 'kg',
    averageYieldPerHectare: 30000,
    regionalPrices: { min: 200, max: 350, average: 275 },
    productionCosts: { semences: 350000, engrais: 120000, pesticides: 60000, mainOeuvre: 280000 },
    plantingDensity: 1600,
    description: 'Fruit de dessert, marché urbain en croissance',
    bestRegions: ['Abidjan', 'San-Pédro', 'Soubré'],
    rotationCompatible: ['plantain', 'manioc', 'igname']
  }
];

export const AGRICULTURAL_SEASONS = [
  {
    name: 'Saison sèche',
    period: 'Novembre - Mars',
    description: 'Période idéale pour le maraîchage irrigué',
    crops: ['oignon', 'tomate', 'salade', 'chou', 'carotte', 'concombre']
  },
  {
    name: 'Hivernage',
    period: 'Avril - Octobre', 
    description: 'Saison des pluies pour les cultures pluviales',
    crops: ['mais', 'riz', 'arachide', 'soja', 'niebe', 'sesame', 'gombo', 'aubergine', 'piment', 'haricot-vert', 'manioc', 'igname']
  },
  {
    name: 'Post-hivernage',
    period: 'Septembre - Novembre',
    description: 'Fin de saison des pluies, cultures de transition',
    crops: ['gombo', 'aubergine', 'niebe', 'haricot-vert']
  },
  {
    name: 'Début hivernage',
    period: 'Mars - Mai',
    description: 'Début des pluies, préparation des grandes cultures',
    crops: ['tomate', 'salade', 'igname']
  }
];

export const IVORY_COAST_REGIONS = [
  'Abidjan', 'Bouaké', 'Korhogo', 'San-Pédro', 'Yamoussoukro', 
  'Daloa', 'Man', 'Ferkessédougou', 'Katiola', 'Odienné', 
  'Bondoukou', 'Soubré', 'Gagnoa', 'Divo'
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
  corporateTaxRate: 25,
  vat: 18,
  cnpsRate: 16.3,
  cnpsEmployeeRate: 3.2,
  minimumWage: 60000,
  agricultureTaxExemption: true
};
