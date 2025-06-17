
import React, { createContext, useContext, useState, useCallback } from 'react';

interface CompanyInfo {
  preparerName: string;
  companyName: string;
  startingMonth: string;
  startingYear: number;
}

interface FixedAssets {
  realEstateLand: number;
  realEstateBuildings: number;
  leaseholdImprovements: number;
  equipment: number;
  furnitureFixtures: number;
  vehicles: number;
  other: number;
}

interface OperatingCapital {
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

interface FundingSources {
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

interface Product {
  id: string;
  name: string;
  unitsPerMonth: number;
  pricePerUnit: number;
  cogsPerUnit: number;
}

interface FinancialData {
  companyInfo: CompanyInfo;
  fixedAssets: FixedAssets;
  operatingCapital: OperatingCapital;
  fundingSources: FundingSources;
  products: Product[];
}

interface FinancialDataContextType {
  data: FinancialData;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  updateFixedAssets: (assets: Partial<FixedAssets>) => void;
  updateOperatingCapital: (capital: Partial<OperatingCapital>) => void;
  updateFundingSources: (sources: Partial<FundingSources>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  addProduct: () => void;
  removeProduct: (id: string) => void;
  calculations: {
    totalFixedAssets: number;
    totalOperatingCapital: number;
    totalRequiredFunds: number;
    totalFundingSources: number;
    fundingBalance: number;
    monthlyLoanPayments: {
      commercial: number;
      mortgage: number;
      creditCard: number;
      vehicle: number;
      other: number;
    };
  };
}

const defaultData: FinancialData = {
  companyInfo: {
    preparerName: '',
    companyName: '',
    startingMonth: 'January',
    startingYear: new Date().getFullYear()
  },
  fixedAssets: {
    realEstateLand: 0,
    realEstateBuildings: 0,
    leaseholdImprovements: 0,
    equipment: 0,
    furnitureFixtures: 0,
    vehicles: 0,
    other: 0
  },
  operatingCapital: {
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
  },
  fundingSources: {
    ownersEquityPercent: 0,
    ownersEquityAmount: 0,
    outsideInvestorsPercent: 0,
    outsideInvestorsAmount: 0,
    commercialLoanAmount: 0,
    commercialMortgageAmount: 0,
    creditCardDebt: 0,
    vehicleLoans: 0,
    otherBankDebt: 0
  },
  products: [
    { id: '1', name: 'Product 1', unitsPerMonth: 0, pricePerUnit: 0, cogsPerUnit: 0 }
  ]
};

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export const FinancialDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FinancialData>(defaultData);

  const updateCompanyInfo = useCallback((info: Partial<CompanyInfo>) => {
    setData(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, ...info }
    }));
  }, []);

  const updateFixedAssets = useCallback((assets: Partial<FixedAssets>) => {
    setData(prev => ({
      ...prev,
      fixedAssets: { ...prev.fixedAssets, ...assets }
    }));
  }, []);

  const updateOperatingCapital = useCallback((capital: Partial<OperatingCapital>) => {
    setData(prev => ({
      ...prev,
      operatingCapital: { ...prev.operatingCapital, ...capital }
    }));
  }, []);

  const updateFundingSources = useCallback((sources: Partial<FundingSources>) => {
    setData(prev => ({
      ...prev,
      fundingSources: { ...prev.fundingSources, ...sources }
    }));
  }, []);

  const updateProduct = useCallback((id: string, product: Partial<Product>) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...product } : p)
    }));
  }, []);

  const addProduct = useCallback(() => {
    setData(prev => ({
      ...prev,
      products: [...prev.products, {
        id: Date.now().toString(),
        name: `Product ${prev.products.length + 1}`,
        unitsPerMonth: 0,
        pricePerUnit: 0,
        cogsPerUnit: 0
      }]
    }));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  }, []);

  // Calculations
  const totalFixedAssets = Object.values(data.fixedAssets).reduce((sum, val) => sum + val, 0);
  const totalOperatingCapital = Object.values(data.operatingCapital).reduce((sum, val) => sum + val, 0);
  const totalRequiredFunds = totalFixedAssets + totalOperatingCapital;

  const calculateMonthlyPayment = (principal: number, rate: number, months: number) => {
    if (principal === 0 || rate === 0) return 0;
    const monthlyRate = rate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const monthlyLoanPayments = {
    commercial: calculateMonthlyPayment(data.fundingSources.commercialLoanAmount, 9, 84),
    mortgage: calculateMonthlyPayment(data.fundingSources.commercialMortgageAmount, 9, 240),
    creditCard: calculateMonthlyPayment(data.fundingSources.creditCardDebt, 7, 60),
    vehicle: calculateMonthlyPayment(data.fundingSources.vehicleLoans, 6, 48),
    other: calculateMonthlyPayment(data.fundingSources.otherBankDebt, 5, 36)
  };

  const totalFundingSources = Object.values(data.fundingSources).reduce((sum, val) => sum + val, 0);
  const fundingBalance = totalFundingSources - totalRequiredFunds;

  const calculations = {
    totalFixedAssets,
    totalOperatingCapital,
    totalRequiredFunds,
    totalFundingSources,
    fundingBalance,
    monthlyLoanPayments
  };

  const value: FinancialDataContextType = {
    data,
    updateCompanyInfo,
    updateFixedAssets,
    updateOperatingCapital,
    updateFundingSources,
    updateProduct,
    addProduct,
    removeProduct,
    calculations
  };

  return (
    <FinancialDataContext.Provider value={value}>
      {children}
    </FinancialDataContext.Provider>
  );
};

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
