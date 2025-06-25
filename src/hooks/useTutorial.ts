
import { useState, useEffect } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  completed: boolean;
  required: boolean;
}

interface TutorialState {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  showDemo: boolean;
}

const TUTORIAL_STEPS: Omit<TutorialStep, 'completed'>[] = [
  {
    id: 'create-plantation',
    title: 'Créer votre première plantation',
    description: 'Commencez par créer une plantation pour organiser vos parcelles agricoles',
    target: 'create-plantation-btn',
    required: true
  },
  {
    id: 'add-parcelle',
    title: 'Ajouter des parcelles',
    description: 'Divisez votre plantation en parcelles pour une gestion détaillée',
    target: 'add-parcelle-btn',
    required: true
  },
  {
    id: 'assign-culture',
    title: 'Assigner des cultures',
    description: 'Choisissez les cultures adaptées à chaque parcelle selon le climat ivoirien',
    target: 'culture-selector',
    required: true
  },
  {
    id: 'analyze-performance',
    title: 'Analyser les performances',
    description: 'Consultez les métriques financières et la rentabilité de vos cultures',
    target: 'analytics-tab',
    required: false
  }
];

const STORAGE_KEY = 'plantation-tutorial-state';

export const useTutorial = () => {
  const [tutorialState, setTutorialState] = useState<TutorialState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default state
      }
    }
    
    return {
      isActive: true,
      currentStep: 0,
      steps: TUTORIAL_STEPS.map(step => ({ ...step, completed: false })),
      showDemo: false
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tutorialState));
  }, [tutorialState]);

  const markStepCompleted = (stepId: string) => {
    setTutorialState(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    }));
  };

  const nextStep = () => {
    setTutorialState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1)
    }));
  };

  const previousStep = () => {
    setTutorialState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  };

  const toggleTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };

  const resetTutorial = () => {
    setTutorialState({
      isActive: true,
      currentStep: 0,
      steps: TUTORIAL_STEPS.map(step => ({ ...step, completed: false })),
      showDemo: false
    });
  };

  const toggleDemo = () => {
    setTutorialState(prev => ({
      ...prev,
      showDemo: !prev.showDemo
    }));
  };

  const getCurrentStep = () => tutorialState.steps[tutorialState.currentStep];
  const getProgress = () => {
    const completed = tutorialState.steps.filter(step => step.completed).length;
    return (completed / tutorialState.steps.length) * 100;
  };

  const isStepCompleted = (stepId: string) => {
    return tutorialState.steps.find(step => step.id === stepId)?.completed || false;
  };

  return {
    tutorialState,
    markStepCompleted,
    nextStep,
    previousStep,
    toggleTutorial,
    resetTutorial,
    toggleDemo,
    getCurrentStep,
    getProgress,
    isStepCompleted
  };
};
