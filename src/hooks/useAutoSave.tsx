
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAutoSave = (data: any, projectId?: string) => {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    const currentDataString = JSON.stringify(data);
    
    // Éviter les sauvegardes inutiles si les données n'ont pas changé
    if (currentDataString === lastSavedRef.current) {
      return;
    }

    // Debounce la sauvegarde - attendre 2 secondes après le dernier changement
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('Pas d\'utilisateur connecté, pas de sauvegarde');
          return;
        }

        if (projectId) {
          // Mise à jour du projet existant
          const { error } = await supabase
            .from('financial_projects')
            .update({
              company_info: data.companyInfo,
              fixed_assets: data.fixedAssets,
              operating_capital: data.operatingCapital,
              funding_sources: data.fundingSources,
              products: data.products,
              operating_expenses: data.operatingExpenses,
              payroll_data: data.payrollData,
              additional_parameters: data.additionalParameters,
            })
            .eq('id', projectId);

          if (error) throw error;
        } else {
          // Création d'un nouveau projet
          const { error } = await supabase
            .from('financial_projects')
            .insert({
              user_id: session.user.id,
              company_info: data.companyInfo,
              fixed_assets: data.fixedAssets,
              operating_capital: data.operatingCapital,
              funding_sources: data.fundingSources,
              products: data.products,
              operating_expenses: data.operatingExpenses,
              payroll_data: data.payrollData,
              additional_parameters: data.additionalParameters,
            });

          if (error) throw error;
        }

        lastSavedRef.current = currentDataString;
        console.log('Données sauvegardées automatiquement');
        
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder vos données",
          variant: "destructive",
        });
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, projectId, toast]);
};
