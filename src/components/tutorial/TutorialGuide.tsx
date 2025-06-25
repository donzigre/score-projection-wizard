
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  HelpCircle, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  RotateCcw,
  Lightbulb,
  Play
} from "lucide-react";
import { useTutorial } from '@/hooks/useTutorial';

interface TutorialGuideProps {
  className?: string;
}

export const TutorialGuide: React.FC<TutorialGuideProps> = ({ className }) => {
  const {
    tutorialState,
    nextStep,
    previousStep,
    toggleTutorial,
    resetTutorial,
    toggleDemo,
    getCurrentStep,
    getProgress
  } = useTutorial();

  if (!tutorialState.isActive) {
    return (
      <Button
        onClick={toggleTutorial}
        variant="outline"
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white hover:bg-blue-700"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Aide
      </Button>
    );
  }

  const currentStep = getCurrentStep();
  const progress = getProgress();
  const completedSteps = tutorialState.steps.filter(step => step.completed).length;

  return (
    <Card className={`fixed bottom-4 right-4 w-80 z-50 shadow-lg border-blue-200 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Guide d'utilisation
            </CardTitle>
            <div className="text-blue-100 text-sm mt-1">
              Étape {tutorialState.currentStep + 1} sur {tutorialState.steps.length}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTutorial}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{completedSteps}/{tutorialState.steps.length} terminées</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Étape actuelle */}
        {currentStep && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {currentStep.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-blue-50" />
              )}
              <h3 className="font-medium">{currentStep.title}</h3>
              {currentStep.required && (
                <Badge variant="secondary" className="text-xs">Requis</Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600">
              {currentStep.description}
            </p>

            {/* Messages contextuels */}
            {currentStep.id === 'create-plantation' && completedSteps === 0 && (
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <p className="font-medium text-blue-900">💡 Conseil :</p>
                <p className="text-blue-800">
                  Utilisez le bouton "Nouvelle Plantation" en haut de la page pour commencer.
                </p>
              </div>
            )}

            {currentStep.id === 'add-parcelle' && completedSteps === 1 && (
              <div className="bg-green-50 p-3 rounded-lg text-sm">
                <p className="font-medium text-green-900">🎯 Action suivante :</p>
                <p className="text-green-800">
                  Sélectionnez une plantation puis cliquez sur le bouton "+" pour ajouter des parcelles.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousStep}
            disabled={tutorialState.currentStep === 0}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            onClick={nextStep}
            disabled={tutorialState.currentStep === tutorialState.steps.length - 1}
            className="flex-1"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mode démo */}
        <div className="border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDemo}
            className="w-full text-xs"
          >
            <Play className="h-3 w-3 mr-1" />
            {tutorialState.showDemo ? 'Masquer' : 'Voir'} les données d'exemple
          </Button>
        </div>

        {/* Actions avancées */}
        <div className="flex gap-2 text-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTutorial}
            className="flex-1"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Recommencer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
