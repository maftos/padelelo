import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type TransitionDirection = 'forward' | 'backward';
export type TransitionState = 'idle' | 'transitioning';

export const useOnboardingNavigation = () => {
  const navigate = useNavigate();
  const [transitionState, setTransitionState] = useState<TransitionState>('idle');
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>('forward');

  const navigateToStep = useCallback((
    stepNumber: number, 
    direction: TransitionDirection = 'forward',
    onComplete?: () => void
  ) => {
    if (transitionState === 'transitioning') return;

    setTransitionState('transitioning');
    setTransitionDirection(direction);

    // Wait for exit animation to complete
    setTimeout(() => {
      if (stepNumber === 0) {
        navigate('/onboarding');
      } else if (stepNumber === -1) {
        navigate('/onboarding/final');
      } else {
        navigate(`/onboarding/step-${stepNumber}`);
      }
      
      // Reset transition state after route change
      setTimeout(() => {
        setTransitionState('idle');
        onComplete?.();
      }, 50); // Small buffer to ensure route change completes
    }, 300); // Exit animation duration
  }, [navigate, transitionState]);

  const goToNextStep = useCallback((currentStep: number, onComplete?: () => void) => {
    const nextStep = currentStep === 6 ? -1 : currentStep + 1;
    navigateToStep(nextStep, 'forward', onComplete);
  }, [navigateToStep]);

  const goToPreviousStep = useCallback((currentStep: number, onComplete?: () => void) => {
    const previousStep = currentStep - 1;
    navigateToStep(previousStep, 'backward', onComplete);
  }, [navigateToStep]);

  return {
    transitionState,
    transitionDirection,
    goToNextStep,
    goToPreviousStep,
    navigateToStep
  };
};