import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '@/types/financial';

// Company Info interface
export interface CompanyInfo {
  preparerName: string;
  companyName: string;
  startingMonth: string;
  startingYear: number;
}

// Additional Parameters interface
export interface AdditionalParameters {
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

// Fixed Asset interface - updated with all required properties
export interface FixedAsset {
  id: string;
  category: string;
  description: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  depreciationRate: number;
  depreciationYears: number;
  icon: string;
}

// Funding Source interface - updated with required properties
export interface FundingSource {
  id: string;
  type: string;
  description: string;
  amount: number;
  interestRate?: number;
  term?: number;
  termYears?: number;
}

// Working Capital Item interface
export interface WorkingCapitalItem {
  id: string;
  category: string;
  description: string;
  amount: number;
}

// Operating Capital interface
export interface OperatingCapital {
  workingCapital: number;
  creditLine: number;
  creditLineInterestRate: number;
}

// Operating Expense interface - updated with all required properties
export interface OperatingExpense {
  id: string;
  category: string;
  description: string;
  monthlyAmount: number;
  growthRate: number;
  isAutoCalculated: boolean;
}

// Salary interface
export interface Salary {
  id: string;
  name: string;
  position: string;
  monthlySalary: number;
  monthlyCharges: number;
  startMonth: number;
}

// Employee interface with French properties for MasseSalarialeSection
export interface Employee {
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
  // Legacy properties for backwards compatibility
  name?: string;
  position?: string;
  monthlySalary?: number;
  monthlyCharges?: number;
  startMonth?: number;
}

// Payroll Data interface
export interface PayrollData {
  employees: Employee[];
  totalMonthlySalaries: number;
  totalMonthlyCharges: number;
  totalPayroll: number;
}

// Calculations interface with all required properties
export interface Calculations {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  netIncome: number;
  totalAssets: number;
  totalFixedAssets: number;
  totalLiabilities: number;
  totalFundingSources: number;
  totalOperatingCapital: number;
  totalRequiredFunds: number;
  fundingBalance: number;
  equity: number;
  cashFlow: any[];
  ratios: any[];
  totalMonthlySalaries: number;
  totalMonthlyCharges: number;
  monthlyLoanPayments: {
    commercial: number;
    mortgage: number;
    creditCard: number;
    vehicle: number;
    other: number;
  };
}

interface FinancialDataContextType {
  data: FinancialData;
  updateData: (updates: Partial<FinancialData>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: () => void;
  removeProduct: (id: string) => void;
  assignProductToParcelle: (productId: string, parcelleId: string) => void;
  calculateProductRevenue: (productId: string) => number;
  operatingExpensesTotal: number;
  totalPayroll: number;
  calculateTotalSalaries: () => number;
  calculateTotalCharges: () => number;
  totalMonthlySalaries: number;
  totalMonthlyCharges: number;
  
  // Missing methods that components expect
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => void;
  updateAdditionalParameters: (updates: Partial<AdditionalParameters>) => void;
  updateFixedAssets: (assets: FixedAsset[]) => void;
  updateFundingSources: (sources: FundingSource[]) => void;
  updateOperatingCapital: (capital: WorkingCapitalItem[]) => void;
  updateOperatingExpenses: (expenses: OperatingExpense[]) => void;
  updatePayrollData: (payroll: Partial<PayrollData>) => void;
  calculations: Calculations;
}

interface FinancialData {
  products: Product[];
  salaries: Salary[];
  operatingCapital: OperatingCapital;
  operatingExpenses: OperatingExpense[];
  
  // Missing properties that components expect
  companyInfo: CompanyInfo;
  additionalParameters: AdditionalParameters;
  fixedAssets: FixedAsset[];
  fundingSources: FundingSource[];
  workingCapitalItems: WorkingCapitalItem[];
  payrollData: PayrollData;
}

const initialData: FinancialData = {
  products: [{
    id: 'default-product',
    name: 'Default Culture',
    unitsPerMonth: 100,
    pricePerUnit: 500000,
    cogsPerUnit: 250000,
    cropType: 'maraichage',
    unit: 'kg',
    cycleMonths: 3,
    periodeRepos: 0,
    rendementEstime: 0,
    rendementReel: 0,
    cropId: '',
    parcelleId: ''
  }],
  salaries: [],
  operatingCapital: {
    workingCapital: 25000,
    creditLine: 50000,
    creditLineInterestRate: 12,
  },
  operatingExpenses: [],
  
  // Initialize missing properties
  companyInfo: {
    preparerName: '',
    companyName: '',
    startingMonth: 'Janvier',
    startingYear: new Date().getFullYear()
  },
  additionalParameters: {
    paymentTerms: {
      cash: 30,
      net30: 40,
      net60: 20,
      over60: 10
    },
    supplierPaymentTerms: 30,
    creditLine: {
      amount: 50000,
      interestRate: 12
    },
    additionalAssets: {
      year2: 0,
      year3: 0
    },
    taxAssumptions: {
      corporateTaxRate: 25,
      depreciationRate: 20
    }
  },
  fixedAssets: [],
  fundingSources: [],
  workingCapitalItems: [],
  payrollData: {
    employees: [],
    totalMonthlySalaries: 0,
    totalMonthlyCharges: 0,
    totalPayroll: 0
  }
};

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export const FinancialDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FinancialData>(initialData);

  const updateData = useCallback((updates: Partial<FinancialData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateCompanyInfo = useCallback((updates: Partial<CompanyInfo>) => {
    setData(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, ...updates }
    }));
  }, []);

  const updateAdditionalParameters = useCallback((updates: Partial<AdditionalParameters>) => {
    setData(prev => ({
      ...prev,
      additionalParameters: { ...prev.additionalParameters, ...updates }
    }));
  }, []);

  const updateFixedAssets = useCallback((assets: FixedAsset[]) => {
    setData(prev => ({ ...prev, fixedAssets: assets }));
  }, []);

  const updateFundingSources = useCallback((sources: FundingSource[]) => {
    setData(prev => ({ ...prev, fundingSources: sources }));
  }, []);

  const updateOperatingCapital = useCallback((capital: WorkingCapitalItem[]) => {
    setData(prev => ({ ...prev, workingCapitalItems: capital }));
  }, []);

  const updateOperatingExpenses = useCallback((expenses: OperatingExpense[]) => {
    setData(prev => ({ ...prev, operatingExpenses: expenses }));
  }, []);

  const updatePayrollData = useCallback((payroll: Partial<PayrollData>) => {
    setData(prev => {
      const updatedEmployees = payroll.employees || prev.payrollData.employees;
      
      // Calculate totals when updating
      const totalMonthlySalaries = updatedEmployees.reduce((total, emp) => {
        return total + (parseFloat(emp.salaireBrut.toString()) || 0);
      }, 0);
      
      const totalMonthlyCharges = updatedEmployees.reduce((total, emp) => {
        return total + (parseFloat(emp.cnpsEmployeur.toString()) || 0) + (parseFloat(emp.autresCharges.toString()) || 0);
      }, 0);
      
      const totalPayroll = totalMonthlySalaries + totalMonthlyCharges;
      
      return {
        ...prev,
        payrollData: {
          employees: updatedEmployees,
          totalMonthlySalaries,
          totalMonthlyCharges,
          totalPayroll
        }
      };
    });
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    }));
  }, []);

  const addProduct = useCallback(() => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      unitsPerMonth: 0,
      pricePerUnit: 0,
      cogsPerUnit: 0,
      cropType: 'maraichage',
      unit: 'kg',
      cycleMonths: 3,
      periodeRepos: 0,
      rendementEstime: 0,
      rendementReel: 0,
      cropId: '',
      parcelleId: ''
    };
    
    setData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(product => product.id !== id)
    }));
  }, []);

  const assignProductToParcelle = useCallback((productId: string, parcelleId: string) => {
    updateProduct(productId, { parcelleId });
  }, [updateProduct]);

  const calculateProductRevenue = useCallback((productId: string) => {
    const product = data.products.find(p => p.id === productId);
    if (!product) return 0;

    const rendement = product.rendementReel || product.rendementEstime || 0;
    const prixUnitaire = product.pricePerUnit || 0;
    const cycleMonths = product.cycleMonths || 3;
    const periodeRepos = product.periodeRepos || Math.floor(cycleMonths * 0.2);
    const cyclesParAn = Math.floor(12 / (cycleMonths + periodeRepos));
    
    return rendement * prixUnitaire * cyclesParAn;
  }, [data.products]);

  const operatingExpensesTotal = data.operatingExpenses.reduce((acc, expense) => acc + expense.monthlyAmount, 0);

  const calculateTotalSalaries = useCallback(() => {
    return data.payrollData.employees.reduce((acc, emp) => acc + (parseFloat(emp.salaireBrut.toString()) || 0), 0);
  }, [data.payrollData.employees]);

  const calculateTotalCharges = useCallback(() => {
    return data.payrollData.employees.reduce((acc, emp) => {
      return acc + (parseFloat(emp.cnpsEmployeur.toString()) || 0) + (parseFloat(emp.autresCharges.toString()) || 0);
    }, 0);
  }, [data.payrollData.employees]);

  const totalPayroll = calculateTotalSalaries() + calculateTotalCharges();
  const totalMonthlySalaries = calculateTotalSalaries();
  const totalMonthlyCharges = calculateTotalCharges();

  // Enhanced calculations with all required properties
  const totalFixedAssets = data.fixedAssets.reduce((acc, asset) => acc + (asset.quantity * asset.unitPrice), 0);
  const totalFundingSources = data.fundingSources.reduce((acc, source) => acc + source.amount, 0);
  const totalOperatingCapital = data.workingCapitalItems.reduce((acc, item) => acc + item.amount, 0);
  const totalRequiredFunds = totalFixedAssets + totalOperatingCapital;
  const fundingBalance = totalFundingSources - totalRequiredFunds;

  const calculations: Calculations = {
    totalRevenue: data.products.reduce((acc, product) => acc + calculateProductRevenue(product.id), 0),
    totalCosts: operatingExpensesTotal + totalPayroll,
    grossProfit: 0,
    netIncome: 0,
    totalAssets: totalFixedAssets,
    totalFixedAssets,
    totalLiabilities: totalFundingSources,
    totalFundingSources,
    totalOperatingCapital,
    totalRequiredFunds,
    fundingBalance,
    equity: 0,
    cashFlow: [],
    ratios: [],
    totalMonthlySalaries,
    totalMonthlyCharges,
    monthlyLoanPayments: {
      commercial: 0,
      mortgage: 0,
      creditCard: 0,
      vehicle: 0,
      other: 0
    }
  };

  const value: FinancialDataContextType = {
    data,
    updateData,
    updateProduct,
    addProduct,
    removeProduct,
    assignProductToParcelle,
    calculateProductRevenue,
    operatingExpensesTotal,
    totalPayroll,
    calculateTotalSalaries,
    calculateTotalCharges,
    totalMonthlySalaries,
    totalMonthlyCharges,
    updateCompanyInfo,
    updateAdditionalParameters,
    updateFixedAssets,
    updateFundingSources,
    updateOperatingCapital,
    updateOperatingExpenses,
    updatePayrollData,
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
  if (!context) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
