
import { FinancialData } from '@/contexts/FinancialDataContext';
import { Parcelle } from '@/types/parcelle';
import { Product } from '@/types/financial';

export interface FinancialStatement {
  year1: number;
  year2: number;
  year3: number;
}

export interface BilanData {
  actif: {
    immobilisations: FinancialStatement;
    stocks: FinancialStatement;
    creances: FinancialStatement;
    tresorerie: FinancialStatement;
    totalActif: FinancialStatement;
  };
  passif: {
    capital: FinancialStatement;
    emprunts: FinancialStatement;
    dettes: FinancialStatement;
    resultatAccumule: FinancialStatement;
    totalPassif: FinancialStatement;
  };
}

export interface CompteResultatData {
  chiffreAffaires: FinancialStatement;
  chargesExploitation: FinancialStatement;
  masseSalariale: FinancialStatement;
  amortissements: FinancialStatement;
  resultatExploitation: FinancialStatement;
  chargesFinancieres: FinancialStatement;
  resultatNet: FinancialStatement;
}

export const calculateDepreciation = (assets: any[], year: number): number => {
  return assets.reduce((total, asset) => {
    const annualDepreciation = (asset.quantity * asset.unitPrice * asset.depreciationRate) / 100;
    return total + annualDepreciation;
  }, 0);
};

export const calculateRevenue = (products: Product[], year: number): number => {
  return products.reduce((total, product) => {
    const cyclesPerYear = Math.floor(12 / ((product.cycleMonths || 3) + (product.periodeRepos || 0)));
    const annualProduction = (product.rendementReel || product.rendementEstime || 0) * cyclesPerYear;
    const revenue = annualProduction * product.pricePerUnit;
    
    // Appliquer une croissance de 5% par an par défaut
    const growthRate = 1.05;
    return total + (revenue * Math.pow(growthRate, year - 1));
  }, 0);
};

export const calculateOperatingExpenses = (expenses: any[], year: number): number => {
  return expenses.reduce((total, expense) => {
    const growthMultiplier = Math.pow(1 + (expense.growthRate / 100), year - 1);
    return total + (expense.monthlyAmount * 12 * growthMultiplier);
  }, 0);
};

export const calculatePayroll = (payrollData: any, year: number): number => {
  const monthlyTotal = payrollData.totalMonthlySalaries + payrollData.totalMonthlyCharges;
  // Croissance salariale de 3% par an
  const growthRate = 1.03;
  return monthlyTotal * 12 * Math.pow(growthRate, year - 1);
};

export const calculateInterestExpenses = (fundingSources: any[], year: number): number => {
  return fundingSources.reduce((total, source) => {
    if (source.type === 'Emprunt bancaire' && source.interestRate) {
      return total + (source.amount * source.interestRate / 100);
    }
    return total;
  }, 0);
};

export const generateCompteResultat = (data: FinancialData): CompteResultatData => {
  const chiffreAffaires = {
    year1: calculateRevenue(data.products, 1),
    year2: calculateRevenue(data.products, 2),
    year3: calculateRevenue(data.products, 3)
  };

  const chargesExploitation = {
    year1: calculateOperatingExpenses(data.operatingExpenses, 1),
    year2: calculateOperatingExpenses(data.operatingExpenses, 2),
    year3: calculateOperatingExpenses(data.operatingExpenses, 3)
  };

  const masseSalariale = {
    year1: calculatePayroll(data.payrollData, 1),
    year2: calculatePayroll(data.payrollData, 2),
    year3: calculatePayroll(data.payrollData, 3)
  };

  const amortissements = {
    year1: calculateDepreciation(data.fixedAssets, 1),
    year2: calculateDepreciation(data.fixedAssets, 2),
    year3: calculateDepreciation(data.fixedAssets, 3)
  };

  const chargesFinancieres = {
    year1: calculateInterestExpenses(data.fundingSources, 1),
    year2: calculateInterestExpenses(data.fundingSources, 2),
    year3: calculateInterestExpenses(data.fundingSources, 3)
  };

  const resultatExploitation = {
    year1: chiffreAffaires.year1 - chargesExploitation.year1 - masseSalariale.year1 - amortissements.year1,
    year2: chiffreAffaires.year2 - chargesExploitation.year2 - masseSalariale.year2 - amortissements.year2,
    year3: chiffreAffaires.year3 - chargesExploitation.year3 - masseSalariale.year3 - amortissements.year3
  };

  const resultatNet = {
    year1: resultatExploitation.year1 - chargesFinancieres.year1,
    year2: resultatExploitation.year2 - chargesFinancieres.year2,
    year3: resultatExploitation.year3 - chargesFinancieres.year3
  };

  return {
    chiffreAffaires,
    chargesExploitation,
    masseSalariale,
    amortissements,
    resultatExploitation,
    chargesFinancieres,
    resultatNet
  };
};

export const generateBilan = (data: FinancialData, compteResultat: CompteResultatData): BilanData => {
  // ACTIF
  const immobilisationsInitiales = data.fixedAssets.reduce((total, asset) => 
    total + (asset.quantity * asset.unitPrice), 0);
  
  const immobilisations = {
    year1: immobilisationsInitiales - calculateDepreciation(data.fixedAssets, 1),
    year2: immobilisationsInitiales - calculateDepreciation(data.fixedAssets, 1) - calculateDepreciation(data.fixedAssets, 2),
    year3: immobilisationsInitiales - calculateDepreciation(data.fixedAssets, 1) - calculateDepreciation(data.fixedAssets, 2) - calculateDepreciation(data.fixedAssets, 3)
  };

  const stocks = {
    year1: 500000, // Estimation basée sur 1 mois de CA
    year2: 600000,
    year3: 700000
  };

  const creances = {
    year1: compteResultat.chiffreAffaires.year1 * 0.1, // 10% du CA en créances
    year2: compteResultat.chiffreAffaires.year2 * 0.1,
    year3: compteResultat.chiffreAffaires.year3 * 0.1
  };

  const tresorerieInitiale = data.workingCapitalItems.reduce((total, item) => total + item.amount, 0);
  const tresorerie = {
    year1: tresorerieInitiale + compteResultat.resultatNet.year1,
    year2: tresorerieInitiale + compteResultat.resultatNet.year1 + compteResultat.resultatNet.year2,
    year3: tresorerieInitiale + compteResultat.resultatNet.year1 + compteResultat.resultatNet.year2 + compteResultat.resultatNet.year3
  };

  const totalActif = {
    year1: immobilisations.year1 + stocks.year1 + creances.year1 + tresorerie.year1,
    year2: immobilisations.year2 + stocks.year2 + creances.year2 + tresorerie.year2,
    year3: immobilisations.year3 + stocks.year3 + creances.year3 + tresorerie.year3
  };

  // PASSIF
  const capitalInitial = data.fundingSources
    .filter(source => source.type === 'Apport personnel' || source.type === 'Capital social')
    .reduce((total, source) => total + source.amount, 0);

  const capital = {
    year1: capitalInitial,
    year2: capitalInitial,
    year3: capitalInitial
  };

  const empruntsInitiaux = data.fundingSources
    .filter(source => source.type === 'Emprunt bancaire')
    .reduce((total, source) => total + source.amount, 0);

  const emprunts = {
    year1: empruntsInitiaux * 0.9, // Remboursement progressif
    year2: empruntsInitiaux * 0.8,
    year3: empruntsInitiaux * 0.7
  };

  const dettes = {
    year1: compteResultat.chargesExploitation.year1 * 0.08, // 8% des charges en dettes
    year2: compteResultat.chargesExploitation.year2 * 0.08,
    year3: compteResultat.chargesExploitation.year3 * 0.08
  };

  const resultatAccumule = {
    year1: compteResultat.resultatNet.year1,
    year2: compteResultat.resultatNet.year1 + compteResultat.resultatNet.year2,
    year3: compteResultat.resultatNet.year1 + compteResultat.resultatNet.year2 + compteResultat.resultatNet.year3
  };

  const totalPassif = {
    year1: capital.year1 + emprunts.year1 + dettes.year1 + resultatAccumule.year1,
    year2: capital.year2 + emprunts.year2 + dettes.year2 + resultatAccumule.year2,
    year3: capital.year3 + emprunts.year3 + dettes.year3 + resultatAccumule.year3
  };

  return {
    actif: {
      immobilisations,
      stocks,
      creances,
      tresorerie,
      totalActif
    },
    passif: {
      capital,
      emprunts,
      dettes,
      resultatAccumule,
      totalPassif
    }
  };
};
