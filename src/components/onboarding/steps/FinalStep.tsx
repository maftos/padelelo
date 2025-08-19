import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from 'canvas-confetti';
import { OnboardingData } from "@/hooks/use-onboarding-state";

interface FinalStepProps {
  data: OnboardingData;
  onComplete: () => void;
  isSubmitting: boolean;
}

export const FinalStep = ({ data, onComplete, isSubmitting }: FinalStepProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleComplete = async () => {
    if (!user) return;
    
    try {
      // Complete onboarding with all user data
      const { error: completeError } = await supabase.rpc('complete_onboarding', {
        p_user_a_id: user.id,
        p_first_name: data.firstName,
        p_last_name: data.lastName,
        p_gender: data.gender || '',
        p_nationality: data.nationality,
        p_profile_photo: data.profilePhoto || ''
      });

      if (completeError) throw completeError;

      // Show success animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      toast.success("Welcome to PadelELO!");
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error("Error completing onboarding");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8">
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
      
      <div className="flex justify-center">
        <Button 
          onClick={handleComplete}
          disabled={isSubmitting}
          className="h-12 px-8 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-40"
        >
          {isSubmitting ? "Setting up your profile..." : "Let's go! 🚀"}
        </Button>
      </div>
    </div>
  );
};