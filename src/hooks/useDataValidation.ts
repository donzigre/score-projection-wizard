
import { useFinancialData } from '@/contexts/FinancialDataContext';

export const useDataValidation = () => {
  const { data } = useFinancialData();

  const hasCompanyInfo = Boolean(
    data.companyInfo?.companyName && 
    data.companyInfo?.preparerName
  );

  const hasProducts = data.products && data.products.length > 0;
  
  const hasEmployees = data.payrollData?.employees && data.payrollData.employees.length > 0;
  
  const hasOperatingExpenses = data.operatingExpenses && data.operatingExpenses.length > 0;
  
  const hasFixedAssets = data.fixedAssets && data.fixedAssets.length > 0;
  
  const hasFundingSources = data.fundingSources && data.fundingSources.length > 0;

  const hasBasicData = hasCompanyInfo;
  
  const hasFinancialData = hasProducts || hasOperatingExpenses || hasEmployees;
  
  // Améliorer les conditions pour accepter les données pré-remplies
  const canGenerateReports = hasCompanyInfo && (hasProducts || hasOperatingExpenses || hasEmployees);

  return {
    hasCompanyInfo,
    hasProducts,
    hasEmployees,
    hasOperatingExpenses,
    hasFixedAssets,
    hasFundingSources,
    hasBasicData,
    hasFinancialData,
    canGenerateReports,
    data
  };
};
