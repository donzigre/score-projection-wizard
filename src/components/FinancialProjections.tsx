
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfigurationSection from './sections/ConfigurationSection';
import PointDepartSection from './sections/PointDepartSection';
import PrevisionsVentesSection from './sections/PrevisionsVentesSection';
import MasseSalarialeSection from './sections/MasseSalarialeSection';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';

const FinancialProjections = () => {
  const [activeTab, setActiveTab] = useState("configuration");

  const tabs = [
    { id: "configuration", label: "Configuration & Instructions", component: ConfigurationSection },
    { id: "point-depart", label: "Point de Départ", component: PointDepartSection },
    { id: "masse-salariale", label: "Masse Salariale Année 1", component: MasseSalarialeSection },
    { id: "previsions-ventes", label: "Prévisions de Ventes Année 1", component: PrevisionsVentesSection },
    { id: "parametres-supplementaires", label: "Paramètres Supplémentaires", component: () => <div>Prochainement</div> },
    { id: "charges-exploitation", label: "Charges d'Exploitation", component: () => <div>Prochainement</div> },
    { id: "flux-tresorerie", label: "Flux de Trésorerie", component: () => <div>Prochainement</div> },
    { id: "compte-resultat", label: "Compte de Résultat", component: () => <div>Prochainement</div> },
    { id: "bilan", label: "Bilan", component: () => <div>Prochainement</div> },
    { id: "analyse-seuil", label: "Analyse du Seuil de Rentabilité", component: () => <div>Prochainement</div> },
    { id: "ratios-financiers", label: "Ratios Financiers", component: () => <div>Prochainement</div> },
    { id: "outils-diagnostic", label: "Outils de Diagnostic", component: () => <div>Prochainement</div> },
  ];

  return (
    <FinancialDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              Modèle de Projections Financières SCORE
            </h1>
            <p className="text-lg text-gray-600">Outil complet de planification financière d'entreprise sur 3 ans</p>
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
