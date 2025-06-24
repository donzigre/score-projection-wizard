import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParcelleManagementSection } from '@/components/sections/ParcelleManagementSection';
import PrevisionsVentesSection from '@/components/sections/PrevisionsVentesSection';
import MasseSalarialeSection from '@/components/sections/MasseSalarialeSection';
import ChargesExploitationSection from '@/components/sections/ChargesExploitationSection';
import FluxTresorerieAgricoleSection from '@/components/sections/FluxTresorerieAgricoleSection';
import BilanSection from '@/components/sections/BilanSection';
import CompteResultatSection from '@/components/sections/CompteResultatSection';
import RatiosFinanciersSection from '@/components/sections/RatiosFinanciersSection';
import OutilsDiagnosticSection from '@/components/sections/OutilsDiagnosticSection';
import AnalyseSeuilRentabiliteSection from '@/components/sections/AnalyseSeuilRentabiliteSection';
import ConfigurationSection from '@/components/sections/ConfigurationSection';
import TestInteractionSection from '@/components/sections/TestInteractionSection';
import { Sprout, TrendingUp, Users, CreditCard, BarChart3, FileText, Calculator, Settings, TestTube2, Activity, Building2 } from "lucide-react";
import { PlantationHierarchySection } from '@/components/sections/PlantationHierarchySection';

const Index = () => {
  const [activeTab, setActiveTab] = useState("plantations");

  const tabs = [
    {
      id: "plantations",
      label: "Gestion Plantations",
      icon: Building2,
      component: PlantationHierarchySection,
      description: "Gestion hiérarchique complète des plantations et parcelles"
    },
    {
      id: "parcelles",
      label: "Parcelles (Ancien)",
      icon: Sprout,
      component: ParcelleManagementSection,
      description: "Interface de gestion des parcelles (version précédente)"
    },
    {
      id: "ventes",
      label: "Prévisions Ventes",
      icon: TrendingUp,
      component: PrevisionsVentesSection,
      description: "Projections de ventes et revenus"
    },
    {
      id: "salaires",
      label: "Masse Salariale", 
      icon: Users,
      component: MasseSalarialeSection,
      description: "Gestion des employés et charges sociales"
    },
    {
      id: "charges",
      label: "Charges Exploitation",
      icon: CreditCard,
      component: ChargesExploitationSection,
      description: "Frais d'exploitation et coûts opérationnels"
    },
    {
      id: "tresorerie",
      label: "Flux Trésorerie",
      icon: BarChart3,
      component: FluxTresorerieAgricoleSection,
      description: "Suivi des flux de trésorerie agricoles"
    },
    {
      id: "bilan",
      label: "Bilan",
      icon: FileText,
      component: BilanSection,
      description: "Bilan comptable prévisionnel"
    },
    {
      id: "compte-resultat",
      label: "Compte Résultat",
      icon: Calculator,
      component: CompteResultatSection,
      description: "Compte de résultat prévisionnel"
    },
    {
      id: "ratios",
      label: "Ratios Financiers",
      icon: Activity,
      component: RatiosFinanciersSection,
      description: "Indicateurs de performance financière"
    },
    {
      id: "diagnostic",
      label: "Outils Diagnostic",
      icon: TestTube2,
      component: OutilsDiagnosticSection,
      description: "Outils d'analyse et de diagnostic"
    },
    {
      id: "seuil-rentabilite",
      label: "Seuil Rentabilité",
      icon: TrendingUp,
      component: AnalyseSeuilRentabiliteSection,
      description: "Analyse du seuil de rentabilité"
    },
    {
      id: "configuration",
      label: "Configuration",
      icon: Settings,
      component: ConfigurationSection,
      description: "Paramètres du système"
    },
    {
      id: "test",
      label: "Test Interactions",
      icon: TestTube2,
      component: TestInteractionSection,
      description: "Tests et validations"
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="container mx-auto p-4">
        {/* En-tête principal */}
        <Card className="mb-6 bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-2">
              Plan d'Affaires Agricole - Côte d'Ivoire
            </CardTitle>
            <p className="text-green-100 text-lg">
              Solution complète pour la planification financière agricole avec données CNRA/ANADER
            </p>
          </CardHeader>
        </Card>

        {/* Navigation par onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 overflow-x-auto">
            <TabsList className="grid grid-cols-6 lg:grid-cols-12 h-auto p-1 bg-white border border-gray-200 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center gap-1 p-3 text-xs font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Indicateur de section active */}
          {activeTabData && (
            <Card className="mb-6 border-l-4 border-l-green-500">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <activeTabData.icon className="h-6 w-6 text-green-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {activeTabData.label}
                    </h2>
                    <p className="text-gray-600">{activeTabData.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contenu des onglets */}
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <div className="animate-in fade-in-50 duration-500">
                <tab.component />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
