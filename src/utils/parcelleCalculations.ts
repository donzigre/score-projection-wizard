
import { Parcelle } from '@/types/parcelle';
import { IVORY_COAST_CROPS, CropType } from '@/config/ivoryCoastAgriculture';

export const calculateParcelleProductionCosts = (parcelle: Parcelle, assignedCrop?: CropType) => {
  if (!assignedCrop) {
    // Utiliser les coûts manuels de la parcelle
    return parcelle.coutsPrepration + parcelle.coutsIntrants + 
           parcelle.coutsMainOeuvre + parcelle.autresCouts;
  }

  // Calculs automatiques basés sur les données CNRA/ANADER
  const preparationCosts = assignedCrop.productionCosts.preparation || 0;
  const seedCosts = assignedCrop.productionCosts.seeds || 0;
  const fertiliserCosts = assignedCrop.productionCosts.fertilizer || 0;
  const pesticideCosts = assignedCrop.productionCosts.pesticides || 0;
  const laborCosts = assignedCrop.productionCosts.labor || 0;
  const otherCosts = assignedCrop.productionCosts.other || 0;

  const costPerHectare = preparationCosts + seedCosts + fertiliserCosts + 
                        pesticideCosts + laborCosts + otherCosts;
  
  return costPerHectare * parcelle.surface;
};

export const calculateCyclesPerYear = (cycleMonths: number, reposPeriod: number = 0) => {
  const totalCycleTime = cycleMonths + reposPeriod;
  return Math.floor(12 / totalCycleTime);
};

export const calculateParcelleRevenue = (parcelle: Parcelle, assignedCrop?: CropType) => {
  if (!assignedCrop) {
    // Utiliser le rendement manuel
    return parcelle.rendementAttendu * parcelle.surface;
  }

  // Calculs automatiques
  const cycleMonths = assignedCrop.growthCycle?.duration || 3;
  const reposPeriod = assignedCrop.growthCycle?.restPeriod || 0;
  const cyclesPerYear = calculateCyclesPerYear(cycleMonths, reposPeriod);
  
  const productionPerCycle = assignedCrop.averageYieldPerHectare * parcelle.surface;
  const revenuePerCycle = productionPerCycle * assignedCrop.regionalPrices.average;
  
  return revenuePerCycle * cyclesPerYear;
};

export const calculateMonthlyRevenue = (annualRevenue: number) => {
  return annualRevenue / 12;
};

export const calculateRevenuePerCycle = (parcelle: Parcelle, assignedCrop?: CropType) => {
  if (!assignedCrop) {
    // Pour les calculs manuels, on assume un cycle de 3 mois par défaut
    const cyclesPerYear = calculateCyclesPerYear(3, 0);
    return (parcelle.rendementAttendu * parcelle.surface) / cyclesPerYear;
  }

  const productionPerCycle = assignedCrop.averageYieldPerHectare * parcelle.surface;
  return productionPerCycle * assignedCrop.regionalPrices.average;
};
