
// Adaptateurs pour maintenir la compatibilité entre les anciens types et les nouveaux
import { FixedAsset, FundingSource, WorkingCapitalItem } from '@/contexts/FinancialDataContext';

export interface LegacyFixedAssets {
  realEstateLand: number;
  realEstateBuildings: number;
  leaseholdImprovements: number;
  equipment: number;
  furnitureFixtures: number;
  vehicles: number;
  other: number;
}

export interface LegacyOperatingCapital {
  preOpeningSalaries: number;
  prepaidInsurance: number;
  inventory: number;
  legalAccounting: number;
  rentDeposits: number;
  utilityDeposits: number;
  supplies: number;
  advertising: number;
  licenses: number;
  otherStartupCosts: number;
  workingCapital: number;
}

export interface LegacyFundingSources {
  ownersEquityPercent: number;
  ownersEquityAmount: number;
  outsideInvestorsPercent: number;
  outsideInvestorsAmount: number;
  commercialLoanAmount: number;
  commercialMortgageAmount: number;
  creditCardDebt: number;
  vehicleLoans: number;
  otherBankDebt: number;
}

export const convertFixedAssetsToLegacy = (assets: FixedAsset[]): LegacyFixedAssets => {
  const legacy: LegacyFixedAssets = {
    realEstateLand: 0,
    realEstateBuildings: 0,
    leaseholdImprovements: 0,
    equipment: 0,
    furnitureFixtures: 0,
    vehicles: 0,
    other: 0
  };

  assets.forEach(asset => {
    const totalValue = asset.quantity * asset.unitPrice;
    
    switch (asset.category.toLowerCase()) {
      case 'terrain':
        legacy.realEstateLand += totalValue;
        break;
      case 'bâtiment':
      case 'batiment':
        legacy.realEstateBuildings += totalValue;
        break;
      case 'équipement':
      case 'equipement':
        legacy.equipment += totalValue;
        break;
      case 'véhicule':
      case 'vehicule':
        legacy.vehicles += totalValue;
        break;
      default:
        legacy.other += totalValue;
    }
  });

  return legacy;
};

export const convertOperatingCapitalToLegacy = (capital: WorkingCapitalItem[]): LegacyOperatingCapital => {
  const legacy: LegacyOperatingCapital = {
    preOpeningSalaries: 0,
    prepaidInsurance: 0,
    inventory: 0,
    legalAccounting: 0,
    rentDeposits: 0,
    utilityDeposits: 0,
    supplies: 0,
    advertising: 0,
    licenses: 0,
    otherStartupCosts: 0,
    workingCapital: 0
  };

  capital.forEach(item => {
    switch (item.category.toLowerCase()) {
      case 'semences':
        legacy.inventory += item.amount;
        break;
      case 'engrais et intrants':
        legacy.supplies += item.amount;
        break;
      case 'main-d\'œuvre':
        legacy.preOpeningSalaries += item.amount;
        break;
      case 'fonds de roulement':
        legacy.workingCapital += item.amount;
        break;
      default:
        legacy.otherStartupCosts += item.amount;
    }
  });

  return legacy;
};

export const convertFundingSourcesToLegacy = (sources: FundingSource[]): LegacyFundingSources => {
  const legacy: LegacyFundingSources = {
    ownersEquityPercent: 0,
    ownersEquityAmount: 0,
    outsideInvestorsPercent: 0,
    outsideInvestorsAmount: 0,
    commercialLoanAmount: 0,
    commercialMortgageAmount: 0,
    creditCardDebt: 0,
    vehicleLoans: 0,
    otherBankDebt: 0
  };

  const totalFunding = sources.reduce((sum, source) => sum + source.amount, 0);

  sources.forEach(source => {
    const percentage = totalFunding > 0 ? (source.amount / totalFunding) * 100 : 0;
    
    switch (source.type.toLowerCase()) {
      case 'apport personnel':
        legacy.ownersEquityAmount += source.amount;
        legacy.ownersEquityPercent += percentage;
        break;
      case 'prêt bancaire agricole':
      case 'prêt bancaire':
        legacy.commercialLoanAmount += source.amount;
        break;
      case 'microfinance':
        legacy.otherBankDebt += source.amount;
        break;
      default:
        legacy.otherBankDebt += source.amount;
    }
  });

  return legacy;
};
