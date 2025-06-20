
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfigurationSection from './sections/ConfigurationSection';
import PointDepartSection from './sections/PointDepartSection';
import PointDepartAgricoleSection from './sections/PointDepartAgricoleSection';
import PrevisionsVentesSection from './sections/PrevisionsVentesSection';
import MasseSalarialeSection from './sections/MasseSalarialeSection';
import ParametresSupplementairesSection from './sections/ParametresSupplementairesSection';
import ChargesExploitationSection from './sections/ChargesExploitationSection';
import FluxTresorerieSection from './sections/FluxTresorerieSection';
import FluxTresorerieAgricoleSection from './sections/FluxTresorerieAgricoleSection';
import CompteResultatSection from './sections/CompteResultatSection';
import BilanSection from './sections/BilanSection';
import AnalyseSeuilRentabiliteSection from './sections/AnalyseSeuilRentabiliteSection';
import RatiosFinanciersSection from './sections/RatiosFinanciersSection';
import OutilsDiagnosticSection from './sections/OutilsDiagnosticSection';
import GestionParcellesCulturesSection from './sections/GestionParcellesCulturesSection';
import TestInteractionSection from './sections/TestInteractionSection';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';
import { ParcellesProvider } from '@/contexts/ParcellesContext';

const FinancialProjections = () => {
  const [activeTab, setActiveTab] = useState("configuration");

  const navigateToAgricole = () => {
    setActiveTab("point-depart-agricole");
  };

  const tabs = [
    { id: "configuration", label: "Configuration & Instructions", component: ConfigurationSection },
    { id: "point-depart", label: "Point de Départ", component: () => <PointDepartSection onNavigateToAgricole={navigateToAgricole} /> },
    { id: "point-depart-agricole", label: "Point de Départ Agricole", component: PointDepartAgricoleSection },
    { id: "gestion-parcelles", label: "Gestion Parcelles & Cultures", component: GestionParcellesCulturesSection },
    { id: "masse-salariale", label: "Masse Salariale Année 1", component: MasseSalarialeSection },
    { id: "previsions-ventes", label: "Prévisions de Ventes Année 1", component: PrevisionsVentesSection },
    { id: "parametres-supplementaires", label: "Paramètres Supplémentaires", component: ParametresSupplementairesSection },
    { id: "charges-exploitation", label: "Charges d'Exploitation", component: ChargesExploitationSection },
    { id: "flux-tresorerie-agricole", label: "Flux de Trésorerie Agricole", component: FluxTresorerieAgricoleSection },
    { id: "flux-tresorerie", label: "Flux de Trésorerie Classique", component: FluxTresorerieSection },
    { id: "compte-resultat", label: "Compte de Résultat", component: CompteResultatSection },
    { id: "bilan", label: "Bilan", component: BilanSection },
    { id: "analyse-seuil", label: "Analyse du Seuil de Rentabilité", component: AnalyseSeuilRentabiliteSection },
    { id: "ratios-financiers", label: "Ratios Financiers", component: RatiosFinanciersSection },
    { id: "outils-diagnostic", label: "Outils de Diagnostic", component: OutilsDiagnosticSection },
    { id: "test-interaction", label: "Test d'Interaction", component: TestInteractionSection },
  ];

  return (
    <FinancialDataProvider>
      <ParcellesProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                Modèle de Projections Financières Agricoles SCORE
              </h1>
              <p className="text-lg text-gray-600">Outil complet de planification financière agricole avec cycles de production réalistes</p>
            </div>

            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-gray-200 bg-gradient-to-r from-blue-500/5 to-green-500/5">
                  <TabsList className="h-auto p-2 bg-transparent w-full justify-start overflow-x-auto">
                    {tabs.slice(0, 8).map((tab) => (
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
                    {tabs.slice(8).map((tab) => (
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
      </ParcellesProvider>
    </FinancialDataProvider>
  );
};

export default FinancialProjections;
