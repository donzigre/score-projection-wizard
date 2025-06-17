
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { InfoCard } from '@/components/ui/InfoCard';

const SetupSection = () => {
  const { data, updateCompanyInfo } = useFinancialData();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Setup & Company Information</h2>
        <p className="text-gray-600">Enter your basic company information to get started with your financial projections</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-blue-900">Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="preparer-name" className="text-sm font-medium text-gray-700">
                Preparer Name
              </Label>
              <Input
                id="preparer-name"
                value={data.companyInfo.preparerName}
                onChange={(e) => updateCompanyInfo({ preparerName: e.target.value })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                Company Name
              </Label>
              <Input
                id="company-name"
                value={data.companyInfo.companyName}
                onChange={(e) => updateCompanyInfo({ companyName: e.target.value })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="Enter your company name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Starting Month</Label>
                <Select
                  value={data.companyInfo.startingMonth}
                  onValueChange={(value) => updateCompanyInfo({ startingMonth: value })}
                >
                  <SelectTrigger className="mt-1 bg-blue-50 border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Starting Year</Label>
                <Select
                  value={data.companyInfo.startingYear.toString()}
                  onValueChange={(value) => updateCompanyInfo({ startingYear: parseInt(value) })}
                >
                  <SelectTrigger className="mt-1 bg-blue-50 border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <InfoCard 
          title="Getting Started Guide"
          content={
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Step 1:</strong> Complete your company information on the left</p>
              <p><strong>Step 2:</strong> Navigate to "Starting Point" to enter your initial funding and assets</p>
              <p><strong>Step 3:</strong> Set up your payroll information for employee costs</p>
              <p><strong>Step 4:</strong> Create your sales forecast with product details</p>
              <p><strong>Step 5:</strong> Review all calculations and generate reports</p>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="font-medium text-blue-900">💡 Tip:</p>
                <p className="text-blue-800">Your company name will automatically appear on all financial statements and reports.</p>
              </div>
            </div>
          }
        />
      </div>

      {data.companyInfo.companyName && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Welcome, {data.companyInfo.companyName}!
              </h3>
              <p className="text-green-700">
                Your financial projections will begin in {data.companyInfo.startingMonth} {data.companyInfo.startingYear}
              </p>
              <p className="text-sm text-green-600 mt-2">
                Prepared by: {data.companyInfo.preparerName || 'Not specified'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SetupSection;
