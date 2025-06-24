
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Plantation, ParcelleWithHistory, CultureHistorique, PlantationCalculations } from '@/types/plantation';
import { IVORY_COAST_CROPS, CropType } from '@/config/ivoryCoastAgriculture';

interface PlantationsContextType {
  plantations: Plantation[];
  parcelles: ParcelleWithHistory[];
  customCrops: CropType[];
  
  // Plantation management
  addPlantation: (plantation: Omit<Plantation, 'id' | 'dateCreation'>) => void;
  updatePlantation: (id: string, updates: Partial<Plantation>) => void;
  removePlantation: (id: string) => void;
  
  // Parcelle management
  addParcelle: (parcelle: Omit<ParcelleWithHistory, 'id' | 'dateCreation' | 'culturesHistorique'>) => void;
  updateParcelle: (id: string, updates: Partial<ParcelleWithHistory>) => void;
  removeParcelle: (id: string) => void;
  
  // Culture management
  assignCultureToParcelle: (parcelleId: string, cultureId: string | null) => void;
  addCultureToHistory: (parcelleId: string, culture: Omit<CultureHistorique, 'id'>) => void;
  
  // Utilities
  getParcellesByPlantation: (plantationId: string) => ParcelleWithHistory[];
  getAllCrops: () => CropType[];
  calculatePlantationMetrics: (plantationId: string) => PlantationCalculations;
  getTotalMetrics: () => PlantationCalculations;
}

const PlantationsContext = createContext<PlantationsContextType | undefined>(undefined);

export const PlantationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plantations, setPlantations] = useState<Plantation[]>([]);
  const [parcelles, setParcelles] = useState<ParcelleWithHistory[]>([]);
  const [customCrops, setCustomCrops] = useState<CropType[]>([]);

  const addPlantation = useCallback((plantationData: Omit<Plantation, 'id' | 'dateCreation'>) => {
    const newPlantation: Plantation = {
      ...plantationData,
      id: Date.now().toString(),
      dateCreation: new Date()
    };
    setPlantations(prev => [...prev, newPlantation]);
  }, []);

  const updatePlantation = useCallback((id: string, updates: Partial<Plantation>) => {
    setPlantations(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const removePlantation = useCallback((id: string) => {
    setPlantations(prev => prev.filter(p => p.id !== id));
    // Remove all parcelles of this plantation
    setParcelles(prev => prev.filter(p => p.plantationId !== id));
  }, []);

  const addParcelle = useCallback((parcelleData: Omit<ParcelleWithHistory, 'id' | 'dateCreation' | 'culturesHistorique'>) => {
    const newParcelle: ParcelleWithHistory = {
      ...parcelleData,
      id: Date.now().toString(),
      dateCreation: new Date(),
      culturesHistorique: []
    };
    setParcelles(prev => [...prev, newParcelle]);
  }, []);

  const updateParcelle = useCallback((id: string, updates: Partial<ParcelleWithHistory>) => {
    setParcelles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const removeParcelle = useCallback((id: string) => {
    setParcelles(prev => prev.filter(p => p.id !== id));
  }, []);

  const assignCultureToParcelle = useCallback((parcelleId: string, cultureId: string | null) => {
    const parcelle = parcelles.find(p => p.id === parcelleId);
    if (!parcelle) return;

    // If there was a previous culture, add it to history
    if (parcelle.cultureActuelle) {
      const historyEntry: CultureHistorique = {
        id: Date.now().toString(),
        cultureId: parcelle.cultureActuelle,
        datePlantation: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago as default
        statut: 'terminee'
      };
      
      updateParcelle(parcelleId, {
        culturesHistorique: [...parcelle.culturesHistorique, historyEntry],
        cultureActuelle: cultureId || undefined,
        cultureId: cultureId
      });
    } else {
      updateParcelle(parcelleId, { 
        cultureActuelle: cultureId || undefined,
        cultureId: cultureId
      });
    }
  }, [parcelles, updateParcelle]);

  const addCultureToHistory = useCallback((parcelleId: string, culture: Omit<CultureHistorique, 'id'>) => {
    const parcelle = parcelles.find(p => p.id === parcelleId);
    if (!parcelle) return;

    const newHistoryEntry: CultureHistorique = {
      ...culture,
      id: Date.now().toString()
    };

    updateParcelle(parcelleId, {
      culturesHistorique: [...parcelle.culturesHistorique, newHistoryEntry]
    });
  }, [parcelles, updateParcelle]);

  const getParcellesByPlantation = useCallback((plantationId: string): ParcelleWithHistory[] => {
    return parcelles.filter(p => p.plantationId === plantationId);
  }, [parcelles]);

  const getAllCrops = useCallback((): CropType[] => {
    return [...IVORY_COAST_CROPS, ...customCrops];
  }, [customCrops]);

  const calculatePlantationMetrics = useCallback((plantationId: string): PlantationCalculations => {
    const plantationParcelles = getParcellesByPlantation(plantationId);
    const allCrops = getAllCrops();
    
    const totals = plantationParcelles.reduce((acc, parcelle) => {
      const assignedCrop = parcelle.cultureActuelle ? allCrops.find(c => c.id === parcelle.cultureActuelle) : undefined;
      
      // Simple calculations - we'll need to implement proper calculation functions
      const couts = assignedCrop ? parcelle.surface * (assignedCrop.coutProduction || 1000) : 0;
      const revenus = assignedCrop ? parcelle.surface * (assignedCrop.rendementMoyen || 1) * (assignedCrop.prixVenteMoyen || 500) : 0;
      
      return {
        surfaceTotale: acc.surfaceTotale + parcelle.surface,
        coutsTotaux: acc.coutsTotaux + couts,
        revenus: acc.revenus + revenus,
        parcellesActives: acc.parcellesActives + (parcelle.cultureActuelle ? 1 : 0),
        culturesSet: acc.culturesSet.add(parcelle.cultureActuelle || '')
      };
    }, {
      surfaceTotale: 0,
      coutsTotaux: 0,
      revenus: 0,
      parcellesActives: 0,
      culturesSet: new Set<string>()
    });

    const margeTotale = totals.revenus - totals.coutsTotaux;
    const rentabilite = totals.coutsTotaux > 0 ? (margeTotale / totals.coutsTotaux) * 100 : 0;

    return {
      surfaceTotale: totals.surfaceTotale,
      nombreParcelles: plantationParcelles.length,
      coutsTotaux: totals.coutsTotaux,
      revenus: totals.revenus,
      margeTotale,
      rentabilite,
      parcellesActives: totals.parcellesActives,
      culturesDistinctes: totals.culturesSet.size - (totals.culturesSet.has('') ? 1 : 0)
    };
  }, [getParcellesByPlantation, getAllCrops]);

  const getTotalMetrics = useCallback((): PlantationCalculations => {
    const allMetrics = plantations.map(p => calculatePlantationMetrics(p.id));
    
    return allMetrics.reduce((total, metrics) => ({
      surfaceTotale: total.surfaceTotale + metrics.surfaceTotale,
      nombreParcelles: total.nombreParcelles + metrics.nombreParcelles,
      coutsTotaux: total.coutsTotaux + metrics.coutsTotaux,
      revenus: total.revenus + metrics.revenus,
      margeTotale: total.margeTotale + metrics.margeTotale,
      rentabilite: total.coutsTotaux > 0 ? ((total.revenus - total.coutsTotaux) / total.coutsTotaux) * 100 : 0,
      parcellesActives: total.parcellesActives + metrics.parcellesActives,
      culturesDistinctes: Math.max(total.culturesDistinctes, metrics.culturesDistinctes)
    }), {
      surfaceTotale: 0,
      nombreParcelles: 0,
      coutsTotaux: 0,
      revenus: 0,
      margeTotale: 0,
      rentabilite: 0,
      parcellesActives: 0,
      culturesDistinctes: 0
    });
  }, [plantations, calculatePlantationMetrics]);

  const value: PlantationsContextType = {
    plantations,
    parcelles,
    customCrops,
    addPlantation,
    updatePlantation,
    removePlantation,
    addParcelle,
    updateParcelle,
    removeParcelle,
    assignCultureToParcelle,
    addCultureToHistory,
    getParcellesByPlantation,
    getAllCrops,
    calculatePlantationMetrics,
    getTotalMetrics
  };

  return (
    <PlantationsContext.Provider value={value}>
      {children}
    </PlantationsContext.Provider>
  );
};

export const usePlantations = () => {
  const context = useContext(PlantationsContext);
  if (context === undefined) {
    throw new Error('usePlantations must be used within a PlantationsProvider');
  }
  return context;
};
