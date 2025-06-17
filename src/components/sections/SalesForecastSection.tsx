
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency } from '@/utils/formatting';
import { Plus, X } from 'lucide-react';

const SalesForecastSection = () => {
  const { data, updateProduct, addProduct, removeProduct } = useFinancialData();

  const ProductCard = ({ product }: { product: any }) => {
    const margin = product.pricePerUnit - product.cogsPerUnit;
    const monthlyRevenue = product.unitsPerMonth * product.pricePerUnit;
    const monthlyCOGS = product.unitsPerMonth * product.cogsPerUnit;
    const monthlyMargin = monthlyRevenue - monthlyCOGS;

    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-blue-900">{product.name}</CardTitle>
          {data.products.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeProduct(product.id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Product Name</Label>
            <Input
              value={product.name}
              onChange={(e) => updateProduct(product.id, { name: e.target.value })}
              className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Units per Month</Label>
              <Input
                type="number"
                value={product.unitsPerMonth || ''}
                onChange={(e) => updateProduct(product.id, { unitsPerMonth: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Price per Unit</Label>
              <Input
                type="number"
                step="0.01"
                value={product.pricePerUnit || ''}
                onChange={(e) => updateProduct(product.id, { pricePerUnit: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">COGS per Unit</Label>
            <Input
              type="number"
              step="0.01"
              value={product.cogsPerUnit || ''}
              onChange={(e) => updateProduct(product.id, { cogsPerUnit: parseFloat(e.target.value) || 0 })}
              className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          <div className="pt-4 border-t border-blue-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Margin per Unit:</span>
              <span className={`font-medium ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(margin)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monthly Revenue:</span>
              <span className="font-medium text-blue-600">{formatCurrency(monthlyRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monthly COGS:</span>
              <span className="font-medium text-orange-600">{formatCurrency(monthlyCOGS)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Monthly Gross Margin:</span>
              <span className={`font-bold ${monthlyMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthlyMargin)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const totalMonthlyRevenue = data.products.reduce((sum, product) => 
    sum + (product.unitsPerMonth * product.pricePerUnit), 0);
  const totalMonthlyCOGS = data.products.reduce((sum, product) => 
    sum + (product.unitsPerMonth * product.cogsPerUnit), 0);
  const totalMonthlyMargin = totalMonthlyRevenue - totalMonthlyCOGS;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sales Forecast - Year 1</h2>
        <p className="text-gray-600">Define your products and monthly sales projections</p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Products & Services</h3>
          <p className="text-sm text-gray-600">Configure up to 6 products or services</p>
        </div>
        {data.products.length < 6 && (
          <Button 
            onClick={addProduct}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Monthly Growth Information */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Growth Rate Assumptions</CardTitle>
          <p className="text-sm text-gray-600">Automated monthly growth rates applied to your base projections</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-green-700">Q1 Growth</h4>
              <p className="text-2xl font-bold text-green-800">10%</p>
              <p className="text-xs text-gray-600">per month</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-blue-700">Q2 Growth</h4>
              <p className="text-2xl font-bold text-blue-800">6%</p>
              <p className="text-xs text-gray-600">per month</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-purple-700">Q3 Growth</h4>
              <p className="text-2xl font-bold text-purple-800">4%</p>
              <p className="text-xs text-gray-600">per month</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-orange-700">Q4 Growth</h4>
              <p className="text-2xl font-bold text-orange-800">3%</p>
              <p className="text-xs text-gray-600">per month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Monthly Sales Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-blue-200 text-sm">Total Monthly Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(totalMonthlyRevenue)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Total Monthly COGS</p>
              <p className="text-3xl font-bold">{formatCurrency(totalMonthlyCOGS)}</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm">Total Monthly Gross Margin</p>
              <p className={`text-3xl font-bold ${totalMonthlyMargin >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {formatCurrency(totalMonthlyMargin)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesForecastSection;
