
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SetupSection from './sections/SetupSection';
import StartingPointSection from './sections/StartingPointSection';
import SalesForecastSection from './sections/SalesForecastSection';
import PayrollSection from './sections/PayrollSection';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';

const FinancialProjections = () => {
  const [activeTab, setActiveTab] = useState("setup");

  const tabs = [
    { id: "setup", label: "Setup & Directions", component: SetupSection },
    { id: "starting-point", label: "Starting Point", component: StartingPointSection },
    { id: "payroll", label: "Payroll Year 1", component: PayrollSection },
    { id: "sales-forecast", label: "Sales Forecast Year 1", component: SalesForecastSection },
    { id: "additional-inputs", label: "Additional Inputs", component: () => <div>Coming Soon</div> },
    { id: "operating-expenses", label: "Operating Expenses", component: () => <div>Coming Soon</div> },
    { id: "cash-flow", label: "Cash Flow", component: () => <div>Coming Soon</div> },
    { id: "income-statement", label: "Income Statement", component: () => <div>Coming Soon</div> },
    { id: "balance-sheet", label: "Balance Sheet", component: () => <div>Coming Soon</div> },
    { id: "breakeven", label: "Breakeven Analysis", component: () => <div>Coming Soon</div> },
    { id: "ratios", label: "Financial Ratios", component: () => <div>Coming Soon</div> },
    { id: "diagnostics", label: "Diagnostic Tools", component: () => <div>Coming Soon</div> },
  ];

  return (
    <FinancialDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              SCORE Financial Projections Template
            </h1>
            <p className="text-lg text-gray-600">Comprehensive 3-Year Business Financial Planning Tool</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-200 bg-gradient-to-r from-blue-500/5 to-green-500/5">
                <TabsList className="h-auto p-2 bg-transparent w-full justify-start overflow-x-auto">
                  {tabs.slice(0, 6).map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="px-4 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <div className="border-b border-gray-100 bg-gradient-to-r from-green-500/5 to-blue-500/5">
                <TabsList className="h-auto p-2 bg-transparent w-full justify-start overflow-x-auto">
                  {tabs.slice(6).map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="px-4 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="p-6">
                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <tab.component />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </FinancialDataProvider>
  );
};

export default FinancialProjections;
