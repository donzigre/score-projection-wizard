
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Parcelle, CultureParcelle, ParcelleCalculations } from '@/types/parcelle';

interface ParcellesContextType {
  parcelles: Parcelle[];
  culturesParcelles: CultureParcelle[];
  addParcelle: (parcelle: Omit<Parcelle, 'id' | 'dateCreation'>) => void;
  updateParcelle: (id: string, updates: Partial<Parcelle>) => void;
  removeParcelle: (id: string) => void;
  assignCultureToParcelle: (parcelleId: string, cultureId: string) => void;
  calculateParcelleMetrics: (parcelleId: string) => ParcelleCalculations;
  getTotalMetrics: () => ParcelleCalculations;
}

const ParcellesContext = createContext<ParcellesContextType | undefined>(undefined);

export const ParcellesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [culturesParcelles, setCulturesParcelles] = useState<CultureParcelle[]>([]);

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

  const assignCultureToParcelle = useCallback((parcelleId: string, cultureId: string) => {
    updateParcelle(parcelleId, { cultureId });
  }, [updateParcelle]);

  const calculateParcelleMetrics = useCallback((parcelleId: string): ParcelleCalculations => {
    const parcelle = parcelles.find(p => p.id === parcelleId);
    if (!parcelle) return { coutsTotaux: 0, revenus: 0, margeParHectare: 0, margeTotale: 0, rentabilite: 0 };

    const coutsTotaux = parcelle.coutsPrepration + parcelle.coutsIntrants + 
                       parcelle.coutsMainOeuvre + parcelle.autresCouts;
    const revenus = parcelle.rendementAttendu * parcelle.surface;
    const margeTotale = revenus - coutsTotaux;
    const margeParHectare = parcelle.surface > 0 ? margeTotale / parcelle.surface : 0;
    const rentabilite = coutsTotaux > 0 ? (margeTotale / coutsTotaux) * 100 : 0;

    return {
      coutsTotaux,
      revenus,
      margeParHectare,
      margeTotale,
      rentabilite
    };
  }, [parcelles]);

  const getTotalMetrics = useCallback((): ParcelleCalculations => {
    return parcelles.reduce((total, parcelle) => {
      const metrics = calculateParcelleMetrics(parcelle.id);
      return {
        coutsTotaux: total.coutsTotaux + metrics.coutsTotaux,
        revenus: total.revenus + metrics.revenus,
        margeParHectare: 0, // N/A pour le total
        margeTotale: total.margeTotale + metrics.margeTotale,
        rentabilite: 0 // Calculé après
      };
    }, { coutsTotaux: 0, revenus: 0, margeParHectare: 0, margeTotale: 0, rentabilite: 0 });
  }, [parcelles, calculateParcelleMetrics]);

  const value: ParcellesContextType = {
    parcelles,
    culturesParcelles,
    addParcelle,
    updateParcelle,
    removeParcelle,
    assignCultureToParcelle,
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
