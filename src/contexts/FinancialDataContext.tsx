
import React, { createContext, useContext, useState, useCallback } from 'react';

interface CompanyInfo {
  preparerName: string;
  companyName: string;
  startingMonth: string;
  startingYear: number;
}

// Nouvelles interfaces pour l'agriculture ivoirienne
interface FixedAsset {
  id: string;
  category: string;
  name: string;
  quantity: number;
  unitPrice: number;
  depreciationYears: number;
  icon: string;
}

interface FundingSource {
  id: string;
  type: string;
  amount: number;
  interestRate: number;
  termYears: number;
}

interface WorkingCapitalItem {
  id: string;
  category: string;
  amount: number;
  description: string;
}

interface Employee {
  id: string;
  nom: string;
  prenom: string;
  poste: string;
  typeContrat: 'CDI' | 'CDD' | 'Saisonnier' | 'Consultant';
  salaireBrut: number;
  heuresParMois: number;
  tauxHoraire: number;
  cnpsEmploye: number;
  cnpsEmployeur: number;
  autresCharges: number;
}

interface PayrollData {
  employees: Employee[];
  chargesSociales: {
    cnpsEmployeur: number;
    cnpsEmploye: number;
    autresTaxes: number;
  };
  inflationAnnuelle: number;
}

// Interfaces originales pour compatibilité
interface OriginalFixedAssets {
  realEstateLand: number;
  realEstateBuildings: number;
  leaseholdImprovements: number;
  equipment: number;
  furnitureFixtures: number;
  vehicles: number;
  other: number;
}

interface OriginalOperatingCapital {
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

interface OriginalFundingSources {
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

interface AdditionalParameters {
  paymentTerms: {
    cash: number;
    net30: number;
    net60: number;
    over60: number;
  };
  supplierPaymentTerms: number;
  creditLine: {
    amount: number;
    interestRate: number;
  };
  additionalAssets: {
    year2: number;
    year3: number;
  };
  taxAssumptions: {
    corporateTaxRate: number;
    depreciationRate: number;
  };
}

interface OperatingExpense {
  id: string;
  category: string;
  monthlyAmount: number;
  growthRate: number;
  isAutoCalculated: boolean;
}

interface FinancialData {
  companyInfo: CompanyInfo;
  // Nouvelles structures agricoles
  fixedAssets: FixedAsset[];
  operatingCapital: WorkingCapitalItem[];
  fundingSources: FundingSource[];
  payrollData: PayrollData;
  // Structures originales pour compatibilité
  originalFixedAssets?: OriginalFixedAssets;
  originalOperatingCapital?: OriginalOperatingCapital;
  originalFundingSources?: OriginalFundingSources;
  products: Product[];
  additionalParameters?: AdditionalParameters;
  operatingExpenses?: OperatingExpense[];
}

interface FinancialDataContextType {
  data: FinancialData;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  updateFixedAssets: (assets: FixedAsset[]) => void;
  updateOperatingCapital: (capital: WorkingCapitalItem[]) => void;
  updateFundingSources: (sources: FundingSource[]) => void;
  updatePayrollData: (payroll: Partial<PayrollData>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  addProduct: () => void;
  removeProduct: (id: string) => void;
  updateAdditionalParameters: (params: Partial<AdditionalParameters>) => void;
  updateOperatingExpenses: (expenses: OperatingExpense[]) => void;
  calculations: {
    totalFixedAssets: number;
    totalOperatingCapital: number;
    totalRequiredFunds: number;
    totalFundingSources: number;
    fundingBalance: number;
    totalMonthlySalaries: number;
    totalMonthlyCharges: number;
    monthlyLoanPayments: {
      commercial: number;
      mortgage: number;
      creditCard: number;
      vehicle: number;
      other: number;
    };
  };
}

const defaultFixedAssets: FixedAsset[] = [
  { id: '1', category: 'Terrain', name: 'Terrain agricole (hectares)', quantity: 1, unitPrice: 2000000, depreciationYears: 0, icon: 'land' },
  { id: '2', category: 'Équipement', name: 'Tracteur', quantity: 1, unitPrice: 15000000, depreciationYears: 10, icon: 'tractor' },
  { id: '3', category: 'Équipement', name: 'Système d\'irrigation', quantity: 1, unitPrice: 5000000, depreciationYears: 15, icon: 'irrigation' },
  { id: '4', category: 'Bâtiment', name: 'Hangar de stockage', quantity: 1, unitPrice: 8000000, depreciationYears: 20, icon: 'building' },
];

const defaultFundingSources: FundingSource[] = [
  { id: '1', type: 'Apport personnel', amount: 20000000, interestRate: 0, termYears: 0 },
  { id: '2', type: 'Prêt bancaire agricole', amount: 15000000, interestRate: 8.5, termYears: 7 },
];

const defaultWorkingCapital: WorkingCapitalItem[] = [
  { id: '1', category: 'Semences', amount: 2000000, description: 'Stock initial de semences pour une saison' },
  { id: '2', category: 'Engrais et intrants', amount: 3000000, description: 'Engrais et produits phytosanitaires' },
  { id: '3', category: 'Fonds de roulement', amount: 5000000, description: 'Réserve pour charges courantes' },
  { id: '4', category: 'Réserve climatique', amount: 2000000, description: 'Fonds d\'urgence pour mauvaises récoltes' },
];

const defaultPayrollData: PayrollData = {
  employees: [
    {
      id: '1',
      nom: 'KOUAME',
      prenom: 'Jean',
      poste: 'Directeur d\'exploitation',
      typeContrat: 'CDI',
      salaireBrut: 500000,
      heuresParMois: 173,
      tauxHoraire: 0,
      cnpsEmploye: 16000,
      cnpsEmployeur: 81500,
      autresCharges: 25000
    }
  ],
  chargesSociales: {
    cnpsEmployeur: 16.3,
    cnpsEmploye: 3.2,
    autresTaxes: 5.0
  },
  inflationAnnuelle: 3.5
};

const defaultData: FinancialData = {
  companyInfo: {
    preparerName: '',
    companyName: '',
    startingMonth: 'January',
    startingYear: new Date().getFullYear()
  },
  fixedAssets: defaultFixedAssets,
  operatingCapital: defaultWorkingCapital,
  fundingSources: defaultFundingSources,
  payrollData: defaultPayrollData,
  products: [
    { id: '1', name: 'Product 1', unitsPerMonth: 0, pricePerUnit: 0, cogsPerUnit: 0 }
  ],
  additionalParameters: {
    paymentTerms: {
      cash: 40,
      net30: 40,
      net60: 15,
      over60: 5
    },
    supplierPaymentTerms: 30,
    creditLine: {
      amount: 50000,
      interestRate: 8.5
    },
    additionalAssets: {
      year2: 0,
      year3: 0
    },
    taxAssumptions: {
      corporateTaxRate: 28,
      depreciationRate: 5
    }
  },
  operatingExpenses: [
    { id: '1', category: 'Publicité et Marketing', monthlyAmount: 2000, growthRate: 5, isAutoCalculated: false },
    { id: '2', category: 'Transport et Déplacements', monthlyAmount: 800, growthRate: 3, isAutoCalculated: false },
    { id: '3', category: 'Assurances', monthlyAmount: 600, growthRate: 3, isAutoCalculated: false },
    { id: '4', category: 'Loyer et Charges Locatives', monthlyAmount: 3000, growthRate: 2, isAutoCalculated: false },
    { id: '5', category: 'Télécommunications', monthlyAmount: 300, growthRate: 2, isAutoCalculated: false },
    { id: '6', category: 'Fournitures de Bureau', monthlyAmount: 200, growthRate: 3, isAutoCalculated: false },
    { id: '7', category: 'Services Professionnels', monthlyAmount: 1500, growthRate: 3, isAutoCalculated: false },
    { id: '8', category: 'Amortissements', monthlyAmount: 0, growthRate: 0, isAutoCalculated: true },
    { id: '9', category: 'Intérêts Bancaires', monthlyAmount: 0, growthRate: 0, isAutoCalculated: true },
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

  const updateFixedAssets = useCallback((assets: FixedAsset[]) => {
    setData(prev => ({
      ...prev,
      fixedAssets: assets
    }));
  }, []);

  const updateOperatingCapital = useCallback((capital: WorkingCapitalItem[]) => {
    setData(prev => ({
      ...prev,
      operatingCapital: capital
    }));
  }, []);

  const updateFundingSources = useCallback((sources: FundingSource[]) => {
    setData(prev => ({
      ...prev,
      fundingSources: sources
    }));
  }, []);

  const updatePayrollData = useCallback((payroll: Partial<PayrollData>) => {
    setData(prev => ({
      ...prev,
      payrollData: { ...prev.payrollData, ...payroll }
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

  const updateAdditionalParameters = useCallback((params: Partial<AdditionalParameters>) => {
    setData(prev => ({
      ...prev,
      additionalParameters: { ...prev.additionalParameters, ...params }
    }));
  }, []);

  const updateOperatingExpenses = useCallback((expenses: OperatingExpense[]) => {
    setData(prev => ({
      ...prev,
      operatingExpenses: expenses
    }));
  }, []);

  // Calculations
  const totalFixedAssets = data.fixedAssets.reduce((total, asset) => total + (asset.quantity * asset.unitPrice), 0);
  const totalOperatingCapital = data.operatingCapital.reduce((total, item) => total + item.amount, 0);
  const totalRequiredFunds = totalFixedAssets + totalOperatingCapital;
  const totalFundingSources = data.fundingSources.reduce((total, source) => total + source.amount, 0);
  const fundingBalance = totalFundingSources - totalRequiredFunds;

  // Payroll calculations
  const totalMonthlySalaries = data.payrollData.employees.reduce((total, emp) => {
    return total + (emp.typeContrat === 'Saisonnier' ? emp.tauxHoraire * emp.heuresParMois : emp.salaireBrut);
  }, 0);
  
  const totalMonthlyCharges = data.payrollData.employees.reduce((total, emp) => {
    return total + emp.cnpsEmployeur + emp.autresCharges;
  }, 0);

  const calculateMonthlyPayment = (principal: number, rate: number, months: number) => {
    if (principal === 0 || rate === 0) return 0;
    const monthlyRate = rate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const monthlyLoanPayments = {
    commercial: data.fundingSources.find(s => s.type.includes('bancaire'))?.amount 
      ? calculateMonthlyPayment(data.fundingSources.find(s => s.type.includes('bancaire'))!.amount, 
          data.fundingSources.find(s => s.type.includes('bancaire'))!.interestRate, 
          data.fundingSources.find(s => s.type.includes('bancaire'))!.termYears * 12) : 0,
    mortgage: 0,
    creditCard: 0,
    vehicle: 0,
    other: 0
  };

  const calculations = {
    totalFixedAssets,
    totalOperatingCapital,
    totalRequiredFunds,
    totalFundingSources,
    fundingBalance,
    totalMonthlySalaries,
    totalMonthlyCharges,
    monthlyLoanPayments
  };

  const value: FinancialDataContextType = {
    data,
    updateCompanyInfo,
    updateFixedAssets,
    updateOperatingCapital,
    updateFundingSources,
    updatePayrollData,
    updateProduct,
    addProduct,
    removeProduct,
    updateAdditionalParameters,
    updateOperatingExpenses,
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

export type { FixedAsset, FundingSource, WorkingCapitalItem, Employee, PayrollData };
