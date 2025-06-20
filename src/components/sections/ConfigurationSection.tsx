
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useAutoSave } from '@/hooks/useAutoSave';
import { InfoCard } from '@/components/ui/InfoCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Check, Loader2 } from 'lucide-react';

const ConfigurationSection = () => {
  const { data, updateCompanyInfo } = useFinancialData();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-sauvegarde (comme avant)
  useAutoSave(data);

  const mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const anneeActuelle = new Date().getFullYear();
  const annees = Array.from({ length: 11 }, (_, i) => anneeActuelle - 5 + i);

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour sauvegarder",
          variant: "destructive",
        });
        return;
      }

      // Vérifier si un projet existe déjà pour cet utilisateur
      const { data: existingProjects } = await supabase
        .from('financial_projects')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      // Convertir les données en JSON pour éviter les erreurs TypeScript
      const projectData = {
        company_info: JSON.parse(JSON.stringify(data.companyInfo)),
        fixed_assets: JSON.parse(JSON.stringify(data.fixedAssets)),
        operating_capital: JSON.parse(JSON.stringify(data.operatingCapital)),
        funding_sources: JSON.parse(JSON.stringify(data.fundingSources)),
        products: JSON.parse(JSON.stringify(data.products)),
        operating_expenses: JSON.parse(JSON.stringify(data.operatingExpenses)),
        payroll_data: JSON.parse(JSON.stringify(data.payrollData)),
        additional_parameters: JSON.parse(JSON.stringify(data.additionalParameters)),
      };

      if (existingProjects && existingProjects.length > 0) {
        // Mettre à jour le projet existant
        const { error } = await supabase
          .from('financial_projects')
          .update(projectData)
          .eq('id', existingProjects[0].id);

        if (error) throw error;
      } else {
        // Créer un nouveau projet
        const { error } = await supabase
          .from('financial_projects')
          .insert({
            ...projectData,
            user_id: session.user.id,
            project_name: data.companyInfo.companyName || 'Nouveau Projet',
          });

        if (error) throw error;
      }

      setLastSaved(new Date());
      toast({
        title: "Projet sauvegardé",
        description: "Vos données ont été sauvegardées avec succès",
        variant: "default",
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le projet",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = data.companyInfo.companyName && data.companyInfo.preparerName;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Configuration & Informations Entreprise</h2>
        <p className="text-gray-600">Saisissez les informations de base de votre entreprise pour commencer vos projections financières</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-blue-900 flex items-center justify-between">
              Détails de l'Entreprise
              {lastSaved && (
                <div className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  Sauvegardé à {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="preparer-name" className="text-sm font-medium text-gray-700">
                Nom du Préparateur *
              </Label>
              <Input
                id="preparer-name"
                value={data.companyInfo.preparerName}
                onChange={(e) => updateCompanyInfo({ preparerName: e.target.value })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="Entrez votre nom"
                required
              />
            </div>

            <div>
              <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                Nom de l'Entreprise *
              </Label>
              <Input
                id="company-name"
                value={data.companyInfo.companyName}
                onChange={(e) => updateCompanyInfo({ companyName: e.target.value })}
                className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                placeholder="Entrez le nom de votre entreprise"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Mois de Début</Label>
                <Select
                  value={data.companyInfo.startingMonth}
                  onValueChange={(value) => updateCompanyInfo({ startingMonth: value })}
                >
                  <SelectTrigger className="mt-1 bg-blue-50 border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mois.map((mois) => (
                      <SelectItem key={mois} value={mois}>{mois}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Année de Début</Label>
                <Select
                  value={data.companyInfo.startingYear.toString()}
                  onValueChange={(value) => updateCompanyInfo({ startingYear: parseInt(value) })}
                >
                  <SelectTrigger className="mt-1 bg-blue-50 border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {annees.map((annee) => (
                      <SelectItem key={annee} value={annee.toString()}>{annee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleManualSave}
                disabled={!isFormValid || isSaving}
                className="flex items-center space-x-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </Button>
              
              {!isFormValid && (
                <p className="text-sm text-red-600 flex items-center">
                  Veuillez remplir tous les champs obligatoires (*)
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <InfoCard 
          title="Guide de Démarrage"
          content={
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Étape 1 :</strong> Complétez les informations de votre entreprise ci-contre</p>
              <p><strong>Étape 2 :</strong> Naviguez vers "Point de Départ" pour saisir votre financement initial et vos actifs</p>
              <p><strong>Étape 3 :</strong> Configurez vos informations de masse salariale pour les coûts employés</p>
              <p><strong>Étape 4 :</strong> Créez vos prévisions de ventes avec les détails produits</p>
              <p><strong>Étape 5 :</strong> Vérifiez tous les calculs et générez les rapports</p>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="font-medium text-blue-900">💡 Conseil :</p>
                <p className="text-blue-800">Vos données sont sauvegardées automatiquement toutes les 2 secondes. Vous pouvez également sauvegarder manuellement.</p>
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
                Bienvenue, {data.companyInfo.companyName} !
              </h3>
              <p className="text-green-700">
                Vos projections financières débuteront en {data.companyInfo.startingMonth} {data.companyInfo.startingYear}
              </p>
              <p className="text-sm text-green-600 mt-2">
                Préparé par : {data.companyInfo.preparerName || 'Non spécifié'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConfigurationSection;
