import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface OnboardingData {
  gender: string | null;
  firstName: string;
  lastName: string;
  nationality: string;
  profilePhoto: string | null;
  password: string;
  openBookingsNotifications: boolean;
}

export interface OnboardingState {
  currentStep: number;
  data: OnboardingData;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

const TOTAL_STEPS = 7;
const STORAGE_KEY = "onboarding_data";

const initialData: OnboardingData = {
  gender: null,
  firstName: "",
  lastName: "",
  nationality: "MU", // Default to Mauritius
  profilePhoto: null,
  password: "",
  openBookingsNotifications: true, // Default to enabled
};

export const useOnboardingState = () => {
  const navigate = useNavigate();
  
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    data: initialData,
    isSubmitting: false,
    errors: {},
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setState(prev => ({
          ...prev,
          data: { ...initialData, ...parsed }
        }));
      }
    } catch (error) {
      console.error("Error loading onboarding data:", error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save data to localStorage whenever it changes
  const saveData = useCallback((newData: Partial<OnboardingData>) => {
    setState(prev => {
      const updatedData = { ...prev.data, ...newData };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      } catch (error) {
        console.error("Error saving onboarding data:", error);
      }
      return {
        ...prev,
        data: updatedData,
        errors: {} // Clear errors when data changes
      };
    });
  }, []);

  // Validation functions for each step
  const validateStep = useCallback((step: number): boolean => {
    const { data } = state;
    switch (step) {
      case 1:
        return !!data.gender;
      case 2:
        return !!(data.firstName.trim() && data.lastName.trim());
      case 3:
        return !!data.nationality;
      case 4:
        return true; // Photo is optional
      case 5:
        return data.password.length >= 6;
      case 6:
        return true; // Notifications step
      case 7:
        return true; // Final step
      default:
        return false;
    }
  }, [state.data]);

  // Navigation functions
  const goToStep = useCallback((step: number) => {
    if (step < 1 || step > TOTAL_STEPS) return;
    
    // Validate that all previous steps are complete
    for (let i = 1; i < step; i++) {
      if (!validateStep(i)) {
        console.warn(`Cannot navigate to step ${step}: step ${i} is incomplete`);
        return;
      }
    }
    
    setState(prev => ({ ...prev, currentStep: step }));
  }, [validateStep]);

  const nextStep = useCallback(() => {
    const { currentStep } = state;
    
    if (!validateStep(currentStep)) {
      setState(prev => ({
        ...prev,
        errors: { [currentStep]: "Please complete this step before proceeding" }
      }));
      return;
    }
    
    if (currentStep < TOTAL_STEPS) {
      setState(prev => ({ ...prev, currentStep: currentStep + 1 }));
    } else {
      // Final step - complete onboarding
      completeOnboarding();
    }
  }, [state.currentStep, validateStep]);

  const previousStep = useCallback(() => {
    const { currentStep } = state;
    if (currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: currentStep - 1 }));
    }
  }, [state.currentStep]);

  const completeOnboarding = useCallback(async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      // The completion logic will be handled by the FinalStep component
      // This just clears the data and navigates
      localStorage.removeItem(STORAGE_KEY);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        errors: { general: "Failed to complete onboarding" }
      }));
    }
  }, [navigate]);

  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      currentStep: 1,
      data: initialData,
      isSubmitting: false,
      errors: {},
    });
  }, []);

  const progress = (state.currentStep / TOTAL_STEPS) * 100;
  const canGoNext = validateStep(state.currentStep);
  const canGoBack = state.currentStep > 1;

  return {
    ...state,
    totalSteps: TOTAL_STEPS,
    progress,
    canGoNext,
    canGoBack,
    saveData,
    validateStep,
    goToStep,
    nextStep,
    previousStep,
    completeOnboarding,
    clearData,
  };
};