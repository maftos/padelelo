
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
      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({
          display_name: localStorage.getItem('onboarding_name'),
          gender: localStorage.getItem('onboarding_gender'),
          nationality: localStorage.getItem('onboarding_nationality'),
          profile_photo: localStorage.getItem('onboarding_photo') || null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Complete onboarding
      const { error: completeError } = await supabase
        .rpc('complete_onboarding', { user_a_id: user.id });

      if (completeError) throw completeError;

      // Clear onboarding data
      localStorage.removeItem('onboarding_name');
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
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">You're all set!</h1>
          <p className="text-muted-foreground">
            Ready to start your PadelELO journey?
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Setting up your profile..." : "Let's go!"}
        </Button>
      </div>
    </OnboardingLayout>
  );
};
