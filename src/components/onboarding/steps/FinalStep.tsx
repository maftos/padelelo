
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from 'canvas-confetti';

export const FinalStep = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleComplete = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Complete onboarding with all user data
      const { error: completeError } = await supabase.rpc('complete_onboarding', {
        p_user_a_id: user.id,
        p_first_name: localStorage.getItem('onboarding_first_name') || '',
        p_last_name: localStorage.getItem('onboarding_last_name') || '',
        p_gender: localStorage.getItem('onboarding_gender') || '',
        p_nationality: localStorage.getItem('onboarding_nationality') || '',
        p_profile_photo: localStorage.getItem('onboarding_photo') || ''
      });

      if (completeError) throw completeError;

      // Clear onboarding data
      localStorage.removeItem('onboarding_first_name');
      localStorage.removeItem('onboarding_last_name');
      localStorage.removeItem('onboarding_gender');
      localStorage.removeItem('onboarding_nationality');
      localStorage.removeItem('onboarding_photo');

      // Show success animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast.success("Welcome to PadelELO!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error("Error completing onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout currentStep={6} totalSteps={6}>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">🎉</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">You're all set!</h1>
            <p className="text-muted-foreground text-lg">
              Ready to start your PadelELO journey?
            </p>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Setting up your profile..." : "Let's go! 🚀"}
        </Button>
      </div>
    </OnboardingLayout>
  );
};
