
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Parcelle, CultureParcelle, ParcelleCalculations } from '@/types/parcelle';
import { IVORY_COAST_CROPS, CropType } from '@/config/ivoryCoastAgriculture';
import { 
  calculateParcelleProductionCosts, 
  calculateParcelleRevenue, 
  calculateMonthlyRevenue, 
  calculateRevenuePerCycle,
  calculateCyclesPerYear 
} from '@/utils/parcelleCalculations';

interface ParcellesContextType {
  parcelles: Parcelle[];
  culturesParcelles: CultureParcelle[];
  customCrops: CropType[];
  addParcelle: (parcelle: Omit<Parcelle, 'id' | 'dateCreation'>) => void;
  updateParcelle: (id: string, updates: Partial<Parcelle>) => void;
  removeParcelle: (id: string) => void;
  assignCultureToParcelle: (parcelleId: string, cultureId: string | null) => void;
  addCustomCrop: (crop: Omit<CropType, 'id'>) => void;
  getAllCrops: () => CropType[];
  calculateParcelleMetrics: (parcelleId: string) => ParcelleCalculations;
  getTotalMetrics: () => ParcelleCalculations;
}

// Données de démonstration initiales basées sur les images Excel
const initialParcelles: Parcelle[] = [
  {
    id: '1',
    nom: 'Parcelle Gombo A1',
    surface: 1.0, // 1 hectare
    localisation: 'Zone Nord',
    typeTerroir: 'Sol argileux',
    cultureId: 'gombo', // ID du gombo dans IVORY_COAST_CROPS
    statut: 'En production',
    dateCreation: new Date('2025-06-01'),
    // Coûts basés sur les données Excel
    coutsPrepration: 150000, // Préparation du sol
    coutsIntrants: 290000 + 1560000 + 250000, // Semences + Engrais + Pesticides
    coutsMainOeuvre: 600000, // Main d'œuvre annuelle
    autresCouts: 800000 + 250000 + 150000 + 300000, // Équipements et infrastructure
    rendementAttendu: 7122 * 593.5, // 7122 kg/ha * 593.5 FCFA/kg
    notes: 'Parcelle de démonstration basée sur les données CNRA/ANADER'
  }
];

const ParcellesContext = createContext<ParcellesContextType | undefined>(undefined);

export const ParcellesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parcelles, setParcelles] = useState<Parcelle[]>(initialParcelles);
  const [culturesParcelles, setCulturesParcelles] = useState<CultureParcelle[]>([]);
  const [customCrops, setCustomCrops] = useState<CropType[]>([]);

  const addParcelle = useCallback((parcelleData: Omit<Parcelle, 'id' | 'dateCreation'>) => {
    const newParcelle: Parcelle = {
      ...parcelleData,
      id: Date.now().toString(),
      dateCreation: new Date()
    };
    setParcelles(prev => [...prev, newParcelle]);
  }, []);

  const updateParcelle = useCallback((id: string, updates: Partial<Parcelle>) => {
    setParcelles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const removeParcelle = useCallback((id: string) => {
    setParcelles(prev => prev.filter(p => p.id !== id));
    setCulturesParcelles(prev => prev.filter(cp => cp.parcelleId !== id));
  }, []);

  const assignCultureToParcelle = useCallback((parcelleId: string, cultureId: string | null) => {
    updateParcelle(parcelleId, { cultureId });
  }, [updateParcelle]);

  const addCustomCrop = useCallback((cropData: Omit<CropType, 'id'>) => {
    const newCrop: CropType = {
      ...cropData,
      id: `custom-${Date.now()}`
    };
    setCustomCrops(prev => [...prev, newCrop]);
  }, []);

  const getAllCrops = useCallback((): CropType[] => {
    return [...IVORY_COAST_CROPS, ...customCrops];
  }, [customCrops]);

  const calculateParcelleMetrics = useCallback((parcelleId: string): ParcelleCalculations => {
    const parcelle = parcelles.find(p => p.id === parcelleId);
    if (!parcelle) {
      return { 
        coutsTotaux: 0, 
        revenus: 0, 
        margeParHectare: 0, 
        margeTotale: 0, 
        rentabilite: 0,
        revenuMensuelMoyen: 0,
        revenuParCycleMoyen: 0,
        nombreCyclesParAn: 0
      };
    }

    const allCrops = getAllCrops();
    const assignedCrop = parcelle.cultureId ? allCrops.find(c => c.id === parcelle.cultureId) : undefined;
    
    // Utiliser les fonctions unifiées de calcul
    const coutsTotaux = calculateParcelleProductionCosts(parcelle, assignedCrop);
    const revenus = calculateParcelleRevenue(parcelle, assignedCrop);
    
    const margeTotale = revenus - coutsTotaux;
    const margeParHectare = parcelle.surface > 0 ? margeTotale / parcelle.surface : 0;
    const rentabilite = coutsTotaux > 0 ? (margeTotale / coutsTotaux) * 100 : 0;
    
    // Nouveaux calculs pour les revenus mensuels et par cycles
    const revenuMensuelMoyen = calculateMonthlyRevenue(revenus);
    const revenuParCycleMoyen = calculateRevenuePerCycle(parcelle, assignedCrop);
    
    // Utiliser cycleMonths au lieu de growthCycle
    const cycleMonths = assignedCrop?.cycleMonths || 3;
    const nombreCyclesParAn = calculateCyclesPerYear(cycleMonths, 0);

    return {
      coutsTotaux,
      revenus,
      margeParHectare,
      margeTotale,
      rentabilite,
      revenuMensuelMoyen,
      revenuParCycleMoyen,
      nombreCyclesParAn
    };
  }, [parcelles, getAllCrops]);

  const getTotalMetrics = useCallback((): ParcelleCalculations => {
    const totals = parcelles.reduce((total, parcelle) => {
      const metrics = calculateParcelleMetrics(parcelle.id);
      return {
        coutsTotaux: total.coutsTotaux + metrics.coutsTotaux,
        revenus: total.revenus + metrics.revenus,
        margeParHectare: 0, // N/A pour le total
        margeTotale: total.margeTotale + metrics.margeTotale,
        rentabilite: 0, // Calculé après
        revenuMensuelMoyen: total.revenuMensuelMoyen + metrics.revenuMensuelMoyen,
        revenuParCycleMoyen: total.revenuParCycleMoyen + metrics.revenuParCycleMoyen,
        nombreCyclesParAn: total.nombreCyclesParAn + metrics.nombreCyclesParAn
      };
    }, { 
      coutsTotaux: 0, 
      revenus: 0, 
      margeParHectare: 0, 
      margeTotale: 0, 
      rentabilite: 0,
      revenuMensuelMoyen: 0,
      revenuParCycleMoyen: 0,
      nombreCyclesParAn: 0
    });

    // Calculer la rentabilité globale
    totals.rentabilite = totals.coutsTotaux > 0 ? (totals.margeTotale / totals.coutsTotaux) * 100 : 0;
    
    // Calculer les moyennes pour les métriques par cycle
    const nombreParcelles = parcelles.length;
    if (nombreParcelles > 0) {
      totals.revenuParCycleMoyen = totals.revenuParCycleMoyen / nombreParcelles;
      totals.nombreCyclesParAn = totals.nombreCyclesParAn / nombreParcelles;
    }

    return totals;
  }, [parcelles, calculateParcelleMetrics]);

  const value: ParcellesContextType = {
    parcelles,
    culturesParcelles,
    customCrops,
    addParcelle,
    updateParcelle,
    removeParcelle,
    assignCultureToParcelle,
    addCustomCrop,
    getAllCrops,
    calculateParcelleMetrics,
    getTotalMetrics
  };

  return (
    <ParcellesContext.Provider value={value}>
      {children}
    </ParcellesContext.Provider>
  );
};

export const useParcelles = () => {
  const context = useContext(ParcellesContext);
  if (context === undefined) {
    throw new Error('useParcelles must be used within a ParcellesProvider');
  }
  return context;
};
