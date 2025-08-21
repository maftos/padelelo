import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from 'canvas-confetti';
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { StepTransition } from "@/components/onboarding/StepTransition";
import { GenderStep } from "@/components/onboarding/steps/GenderStep";
import { NameStep } from "@/components/onboarding/steps/NameStep";
import { NationalityStep } from "@/components/onboarding/steps/NationalityStep";
import { PhotoStep } from "@/components/onboarding/steps/PhotoStep";
import { PasswordStep } from "@/components/onboarding/steps/PasswordStep";
import { NotificationsStep } from "@/components/onboarding/steps/NotificationsStep";
import { FinalStep } from "@/components/onboarding/steps/FinalStep";

export default function Onboarding() {
  const { profile, isLoading } = useUserProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    currentStep,
    totalSteps,
    data,
    progress,
    canGoNext,
    canGoBack,
    isSubmitting,
    saveData,
    nextStep,
    previousStep,
    completeOnboarding,
  } = useOnboardingState();

  useEffect(() => {
    console.log("Onboarding.tsx - profile:", profile);
    
    if (!isLoading && profile?.is_onboarded) {
      console.log("User is already onboarded, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    console.log("Onboarding.tsx - Loading...");
    return null;
  }

  const handlePasswordStepComplete = async () => {
    if (!user || !canGoNext) return;
    
    try {
      // First, set the password in the auth system
      const { error: passwordError } = await supabase.auth.updateUser({
        password: data.password
      });

      if (passwordError) throw passwordError;

      // Then complete onboarding with all user data
      const { error: completeError } = await supabase.rpc('complete_onboarding', {
        p_first_name: data.firstName,
        p_last_name: data.lastName,
        p_gender: data.gender || '',
        p_nationality: data.nationality,
        p_profile_photo: data.profilePhoto || ''
      } as any);

      if (completeError) throw completeError;

      // Show success animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast.success("Welcome to PadelELO!");
      nextStep(); // Move to notifications step
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error("Error completing onboarding");
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenderStep
            selectedGender={data.gender}
            onGenderChange={(gender) => saveData({ gender })}
            onNext={nextStep}
            canGoNext={canGoNext}
          />
        );
      case 2:
        return (
          <NameStep
            firstName={data.firstName}
            lastName={data.lastName}
            onFirstNameChange={(firstName) => saveData({ firstName })}
            onLastNameChange={(lastName) => saveData({ lastName })}
            onNext={nextStep}
            canGoNext={canGoNext}
          />
        );
      case 3:
        return (
          <NationalityStep
            nationality={data.nationality}
            onNationalityChange={(nationality) => saveData({ nationality })}
            onNext={nextStep}
            canGoNext={canGoNext}
          />
        );
      case 4:
        return (
          <PhotoStep
            profilePhoto={data.profilePhoto}
            firstName={data.firstName}
            lastName={data.lastName}
            onPhotoChange={(profilePhoto) => saveData({ profilePhoto })}
            onNext={nextStep}
            canGoNext={canGoNext}
          />
        );
      case 5:
        return (
          <PasswordStep
            password={data.password}
            onPasswordChange={(password) => saveData({ password })}
            onNext={nextStep}
            canGoNext={canGoNext}
            isSubmitting={isSubmitting}
          />
        );
      case 6:
        return (
          <NotificationsStep
            openBookingsNotifications={data.openBookingsNotifications}
            onOpenBookingsChange={(openBookingsNotifications) => saveData({ openBookingsNotifications })}
            onNext={nextStep}
            canGoNext={canGoNext}
            isSubmitting={isSubmitting}
          />
        );
      case 7:
        return (
          <FinalStep
            data={data}
            onComplete={completeOnboarding}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  const getNextButtonText = () => {
    switch (currentStep) {
      case 4:
        return data.profilePhoto ? "Continue" : "Skip for now";
      case 5:
        return isSubmitting ? "Setting up your profile..." : "Complete";
      case 7:
        return isSubmitting ? "Setting up your profile..." : "Let's go! 🚀";
      default:
        return "Next";
    }
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
      showBack={canGoBack && currentStep < 7} // Hide back button on final step
      onNext={currentStep === 5 ? handlePasswordStepComplete : currentStep < 6 ? nextStep : undefined} // Handle password step completion
      onBack={canGoBack && currentStep < 7 ? previousStep : undefined}
      isNextDisabled={!canGoNext || isSubmitting}
      nextButtonText={getNextButtonText()}
    >
      <StepTransition isActive={true}>
        {renderCurrentStep()}
      </StepTransition>
    </OnboardingLayout>
  );
}