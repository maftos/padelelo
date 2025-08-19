import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { StepTransition } from "@/components/onboarding/StepTransition";
import { GenderStep } from "@/components/onboarding/steps/GenderStep";
import { NameStep } from "@/components/onboarding/steps/NameStep";
import { NationalityStep } from "@/components/onboarding/steps/NationalityStep";
import { PhotoStep } from "@/components/onboarding/steps/PhotoStep";
import { PasswordStep } from "@/components/onboarding/steps/PasswordStep";
import { FinalStep } from "@/components/onboarding/steps/FinalStep";

export default function Onboarding() {
  const { profile, isLoading } = useUserProfile();
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
            data={data}
            isSubmitting={isSubmitting}
          />
        );
      case 6:
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
      case 6:
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
      showBack={canGoBack && currentStep < 6} // Hide back button on final step
      onNext={currentStep < 5 ? nextStep : undefined} // Hide next button from step 5 onwards
      onBack={canGoBack && currentStep < 6 ? previousStep : undefined}
      isNextDisabled={!canGoNext || isSubmitting}
      nextButtonText={getNextButtonText()}
    >
      <StepTransition isActive={true}>
        {renderCurrentStep()}
      </StepTransition>
    </OnboardingLayout>
  );
}