import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from 'canvas-confetti';
import { OnboardingData } from "@/hooks/use-onboarding-state";

interface PasswordStepProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onNext: () => void;
  canGoNext: boolean;
  data: OnboardingData;
  isSubmitting: boolean;
}

export const PasswordStep = ({ password, onPasswordChange, onNext, canGoNext, data, isSubmitting }: PasswordStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleComplete = async () => {
    if (!user || !canGoNext) return;
    
    try {
      // First, set the password in the auth system
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      });

      if (passwordError) throw passwordError;

      // Then complete onboarding with all user data
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
      onNext(); // Move to final step
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error("Error completing onboarding");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Set your password</h1>
        <p className="text-muted-foreground">Keep your account secure</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-medium">
            Choose a secure password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter your password"
              className="h-12 text-base pr-12"
              autoFocus
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleComplete}
          disabled={!canGoNext || isSubmitting}
          className="h-12 px-8 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-40"
        >
          {isSubmitting ? "Setting up your profile..." : "Complete"}
        </Button>
      </div>
    </div>
  );
};