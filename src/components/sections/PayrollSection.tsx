
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard } from '@/components/ui/InfoCard';

const PayrollSection = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payroll System - Year 1</h2>
        <p className="text-gray-600">Configure employee categories and payroll taxes</p>
      </div>

      <InfoCard 
        title="Payroll Configuration Coming Soon"
        content={
          <div className="space-y-4">
            <p className="text-gray-700">
              This section will include comprehensive payroll management with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Owner(s) compensation and hours tracking</li>
              <li>Full-time and part-time employee management</li>
              <li>Independent contractor rates</li>
              <li>Automated payroll tax calculations (Social Security, Medicare, FUTA, SUTA)</li>
              <li>Employee benefits and worker's compensation</li>
              <li>3-year growth projections with configurable rates</li>
            </ul>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">💼 Preview Features:</p>
              <p className="text-blue-700 text-sm">
                Automatic calculation of all payroll taxes, benefits, and multi-year projections 
                with industry-standard growth rates.
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default PayrollSection;
