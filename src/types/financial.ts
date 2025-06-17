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

export interface OperatingExpense {
  id: string;
  category: string;
  monthlyAmount: number;
  growthRate: number;
  isAutoCalculated: boolean;
}

export interface CashFlowItem {
  month: number;
  year: number;
  collections: number;
  payments: number;
  netCashFlow: number;
  cumulativeCash: number;
  creditLineUsed: number;
}

export interface FinancialRatio {
  name: string;
  value: number;
  benchmark: number;
  status: 'good' | 'warning' | 'danger';
}

export interface DiagnosticAlert {
  id: string;
  category: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  recommendation: string;
}

export interface Product {
  id: string;
  name: string;
  unitsPerMonth: number;
  pricePerUnit: number;
  cogsPerUnit: number;
  cropType?: 'maraichage' | 'vivrier';
  unit?: string;
  cycleMonths?: number;
  periodeRepos?: number;
  rendementEstime?: number;
  rendementReel?: number;
  cropId?: string; // ID de référence vers IVORY_COAST_CROPS
  parcelleId?: string; // ID de la parcelle assignée
}
