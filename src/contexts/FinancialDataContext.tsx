import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '@/types/financial';
import { OperatingCapital } from '@/types/configuration';
import { OperatingExpense } from '@/types/expenses';
import { Salary } from '@/types/salary';

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
}

interface FinancialData {
  products: Product[];
  salaries: Salary[];
  operatingCapital: OperatingCapital;
  operatingExpenses: OperatingExpense[];
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
};

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export const FinancialDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FinancialData>(initialData);

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
      cropId: '', // ID de la culture de référence
      parcelleId: '' // ID de la parcelle assignée
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

  const updateData = useCallback((updates: Partial<FinancialData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const operatingExpensesTotal = data.operatingExpenses.reduce((acc, expense) => acc + expense.monthlyAmount, 0);

  const calculateTotalSalaries = useCallback(() => {
    return data.salaries.reduce((acc, salary) => acc + salary.monthlySalary, 0);
  }, [data.salaries]);

  const calculateTotalCharges = useCallback(() => {
    return data.salaries.reduce((acc, salary) => acc + salary.monthlyCharges, 0);
  }, [data.salaries]);

  const totalPayroll = calculateTotalSalaries() + calculateTotalCharges();

  const totalMonthlySalaries = data.salaries.reduce((acc, salary) => acc + salary.monthlySalary, 0);
  const totalMonthlyCharges = data.salaries.reduce((acc, salary) => acc + salary.monthlyCharges, 0);

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
