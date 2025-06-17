
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { formatCurrency, formatPercentage } from '@/utils/formatting';

const OutilsDiagnosticSection = () => {
  const { data, calculations } = useFinancialData();

  const runDiagnostics = () => {
    const alerts = [];

    // 1. Adéquation apport propriétaire
    const equityRatio = calculations.totalFundingSources > 0 ? 
      data.fundingSources.ownersEquityAmount / calculations.totalFundingSources : 0;
    
    if (equityRatio < 0.3) {
      alerts.push({
        id: 'equity-low',
        category: 'Financement',
        message: 'Apport en capitaux propres insuffisant',
        severity: 'error' as const,
        recommendation: `Augmenter l'apport propriétaire. Actuel: ${formatPercentage(equityRatio * 100)}, recommandé: ≥30%`,
        value: equityRatio
      });
    } else if (equityRatio < 0.4) {
      alerts.push({
        id: 'equity-warning',
        category: 'Financement',
        message: 'Apport en capitaux propres limite',
        severity: 'warning' as const,
        recommendation: `Envisager d'augmenter l'apport. Actuel: ${formatPercentage(equityRatio * 100)}, optimal: ≥40%`,
        value: equityRatio
      });
    } else {
      alerts.push({
        id: 'equity-good',
        category: 'Financement',
        message: 'Apport en capitaux propres adéquat',
        severity: 'info' as const,
        recommendation: `Ratio d'apport satisfaisant: ${formatPercentage(equityRatio * 100)}`,
        value: equityRatio
      });
    }

    // 2. Soutenabilité remboursements emprunts
    const totalMonthlyPayments = Object.values(calculations.monthlyLoanPayments).reduce((sum, payment) => sum + payment, 0);
    const monthlyCashFlow = data.products?.reduce((total, product) => {
      const monthlyRevenue = product.unitsPerMonth * product.pricePerUnit;
      const monthlyCOGS = product.unitsPerMonth * product.cogsPerUnit;
      return total + (monthlyRevenue - monthlyCOGS);
    }, 0) || 0;

    const paymentRatio = monthlyCashFlow > 0 ? totalMonthlyPayments / monthlyCashFlow : 999;

    if (paymentRatio > 0.4) {
      alerts.push({
        id: 'debt-service-high',
        category: 'Endettement',
        message: 'Charge de remboursement trop élevée',
        severity: 'error' as const,
        recommendation: `Réduire l'endettement ou augmenter le chiffre d'affaires. Ratio actuel: ${formatPercentage(paymentRatio * 100)}`,
        value: paymentRatio
      });
    } else if (paymentRatio > 0.25) {
      alerts.push({
        id: 'debt-service-warning',
        category: 'Endettement',
        message: 'Charge de remboursement élevée',
        severity: 'warning' as const,
        recommendation: `Surveiller la capacité de remboursement. Ratio actuel: ${formatPercentage(paymentRatio * 100)}`,
        value: paymentRatio
      });
    }

    // 3. Cohérence marges brutes
    const averageMargin = data.products?.reduce((sum, product, index, array) => {
      const margin = product.pricePerUnit > 0 ? 
        ((product.pricePerUnit - product.cogsPerUnit) / product.pricePerUnit) * 100 : 0;
      return sum + margin / array.length;
    }, 0) || 0;

    if (averageMargin < 20) {
      alerts.push({
        id: 'margin-low',
        category: 'Rentabilité',
        message: 'Marge brute insuffisante',
        severity: 'error' as const,
        recommendation: `Améliorer les marges produits. Marge moyenne actuelle: ${formatPercentage(averageMargin)}`,
        value: averageMargin
      });
    } else if (averageMargin < 30) {
      alerts.push({
        id: 'margin-warning',
        category: 'Rentabilité',
        message: 'Marge brute limite',
        severity: 'warning' as const,
        recommendation: `Optimiser les marges si possible. Marge moyenne actuelle: ${formatPercentage(averageMargin)}`,
        value: averageMargin
      });
    }

    // 4. Niveau dépenses publicitaires
    const advertisingExpense = (data.operatingExpenses || [])
      .find(expense => expense.category.toLowerCase().includes('publicité'))?.monthlyAmount || 0;
    
    const monthlyRevenue = data.products?.reduce((total, product) => {
      return total + (product.unitsPerMonth * product.pricePerUnit);
    }, 0) || 0;

    const advertisingRatio = monthlyRevenue > 0 ? advertisingExpense / monthlyRevenue : 0;

    if (advertisingRatio < 0.02) {
      alerts.push({
        id: 'advertising-low',
        category: 'Marketing',
        message: 'Budget publicitaire potentiellement insuffisant',
        severity: 'warning' as const,
        recommendation: `Considérer augmenter le budget marketing. Actuel: ${formatPercentage(advertisingRatio * 100)} du CA`,
        value: advertisingRatio
      });
    } else if (advertisingRatio > 0.15) {
      alerts.push({
        id: 'advertising-high',
        category: 'Marketing',
        message: 'Budget publicitaire très élevé',
        severity: 'warning' as const,
        recommendation: `Vérifier l'efficacité des dépenses marketing. Actuel: ${formatPercentage(advertisingRatio * 100)} du CA`,
        value: advertisingRatio
      });
    }

    // 5. Analyse rentabilité
    const netProfitMargin = averageMargin * 0.3; // Estimation marge nette = 30% de la marge brute
    
    if (netProfitMargin < 5) {
      alerts.push({
        id: 'profitability-low',
        category: 'Rentabilité',
        message: 'Rentabilité prévisionnelle faible',
        severity: 'error' as const,
        recommendation: `Améliorer la rentabilité globale. Marge nette estimée: ${formatPercentage(netProfitMargin)}`,
        value: netProfitMargin
      });
    }

    // 6. Suffisance flux trésorerie
    const workingCapital = data.operatingCapital?.workingCapital || 0;
    const monthlyExpenses = (data.operatingExpenses || []).reduce((sum, expense) => sum + expense.monthlyAmount, 0) + 15000; // + masse salariale

    const cashCoverageMonths = monthlyExpenses > 0 ? workingCapital / monthlyExpenses : 0;

    if (cashCoverageMonths < 2) {
      alerts.push({
        id: 'cash-low',
        category: 'Trésorerie',
        message: 'Fonds de roulement insuffisant',
        severity: 'error' as const,
        recommendation: `Augmenter le fonds de roulement. Couverture actuelle: ${cashCoverageMonths.toFixed(1)} mois`,
        value: cashCoverageMonths
      });
    } else if (cashCoverageMonths < 3) {
      alerts.push({
        id: 'cash-warning',
        category: 'Trésorerie',
        message: 'Fonds de roulement limite',
        severity: 'warning' as const,
        recommendation: `Prévoir une marge de sécurité. Couverture actuelle: ${cashCoverageMonths.toFixed(1)} mois`,
        value: cashCoverageMonths
      });
    }

    // 7. Équilibrage bilan
    const balanceCheck = Math.abs(calculations.totalRequiredFunds - calculations.totalFundingSources) < 1000;
    
    if (!balanceCheck) {
      alerts.push({
        id: 'balance-error',
        category: 'Structure',
        message: 'Déséquilibre besoins/ressources de financement',
        severity: 'error' as const,
        recommendation: `Équilibrer les besoins et sources de financement. Écart: ${formatCurrency(calculations.fundingBalance)}`,
        value: calculations.fundingBalance
      });
    }

    // 8. Atteinte seuil rentabilité
    const totalFixedCosts = (data.operatingExpenses || []).reduce((sum, expense) => sum + expense.monthlyAmount * 12, 0) + (15000 * 12);
    const totalRevenue = data.products?.reduce((total, product) => {
      return total + (product.unitsPerMonth * product.pricePerUnit * 12);
    }, 0) || 0;
    const totalCOGS = data.products?.reduce((total, product) => {
      return total + (product.unitsPerMonth * product.cogsPerUnit * 12);
    }, 0) || 0;
    
    const breakevenRevenue = (totalRevenue - totalCOGS) > 0 ? 
      totalFixedCosts / ((totalRevenue - totalCOGS) / totalRevenue) : 999999;
    
    if (totalRevenue < breakevenRevenue) {
      alerts.push({
        id: 'breakeven-not-reached',
        category: 'Rentabilité',
        message: 'Seuil de rentabilité non atteint',
        severity: 'error' as const,
        recommendation: `Augmenter le CA ou réduire les charges. Seuil: ${formatCurrency(breakevenRevenue)}, Actuel: ${formatCurrency(totalRevenue)}`,
        value: totalRevenue / breakevenRevenue
      });
    }

    return alerts;
  };

  const diagnosticAlerts = runDiagnostics();

  const AlertIcon = ({ severity }: { severity: string }) => {
    switch (severity) {
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'info': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-orange-200 bg-orange-50';
      case 'info': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const criticalAlerts = diagnosticAlerts.filter(alert => alert.severity === 'error');
  const warningAlerts = diagnosticAlerts.filter(alert => alert.severity === 'warning');
  const infoAlerts = diagnosticAlerts.filter(alert => alert.severity === 'info');

  const overallScore = Math.max(0, 100 - (criticalAlerts.length * 20) - (warningAlerts.length * 10));

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Outils de Diagnostic</h2>
        <p className="text-gray-600">Analyse automatique et alertes sur la viabilité du projet</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Score de Viabilité Globale</span>
            <span className={`text-3xl font-bold ${
              overallScore >= 80 ? 'text-green-600' : 
              overallScore >= 60 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {overallScore}/100
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900">Alertes Critiques</h3>
              <p className="text-3xl font-bold text-red-600">{criticalAlerts.length}</p>
              <p className="text-sm text-red-700">Requièrent une action immédiate</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900">Avertissements</h3>
              <p className="text-3xl font-bold text-orange-600">{warningAlerts.length}</p>
              <p className="text-sm text-orange-700">À surveiller attentivement</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Points Positifs</h3>
              <p className="text-3xl font-bold text-green-600">{infoAlerts.length}</p>
              <p className="text-sm text-green-700">Aspects bien maîtrisés</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Analyses Détaillées</h3>
        
        {diagnosticAlerts.map((alert) => (
          <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.severity)}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertIcon severity={alert.severity} />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{alert.message}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'error' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'warning' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.category}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{alert.recommendation}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>ID: {alert.id}</span>
                    <span>Sévérité: {alert.severity}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan d'Action Recommandé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalAlerts.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Actions Prioritaires (Urgentes)</h4>
                <ul className="space-y-2">
                  {criticalAlerts.map((alert, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{alert.recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {warningAlerts.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-900 mb-2">Actions Recommandées (Court terme)</h4>
                <ul className="space-y-2">
                  {warningAlerts.map((alert, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-500 font-bold">•</span>
                      <span>{alert.recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {criticalAlerts.length === 0 && warningAlerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-900 mb-2">Excellent ! Projet Viable</h4>
                <p className="text-green-700">
                  Votre projet présente une structure financière solide. 
                  Continuez à surveiller régulièrement ces indicateurs.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Méthode de Diagnostic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-3">Critères Analysés</h4>
              <ul className="space-y-2">
                <li>• Ratio d'apport en capitaux propres (≥30%)</li>
                <li>• Capacité de remboursement des emprunts (≤25%)</li>
                <li>• Cohérence des marges brutes (≥20%)</li>
                <li>• Niveau des investissements marketing (2-15%)</li>
                <li>• Seuil de rentabilité et viabilité</li>
                <li>• Suffisance du fonds de roulement (≥3 mois)</li>
                <li>• Équilibre financier global</li>
                <li>• Ratios de performance sectoriels</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Scoring</h4>
              <ul className="space-y-2">
                <li>• <span className="text-red-600 font-medium">Alerte Critique:</span> -20 points</li>
                <li>• <span className="text-orange-600 font-medium">Avertissement:</span> -10 points</li>
                <li>• <span className="text-green-600 font-medium">Point Positif:</span> +0 points</li>
                <li>• <span className="font-medium">Score ≥80:</span> Projet viable</li>
                <li>• <span className="font-medium">Score 60-79:</span> Ajustements nécessaires</li>
                <li>• <span className="font-medium">Score &lt;60:</span> Restructuration requise</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutilsDiagnosticSection;
