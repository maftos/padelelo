
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { handleAuthError } from "@/utils/auth-error-handler";
import { usePhoneInput } from "@/hooks/auth/use-phone-input";
import { usePasswordInput } from "@/hooks/auth/use-password-input";
import { useFormValidation } from "@/hooks/use-form-validation";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    isPhoneValid,
    getFullPhoneNumber,
  } = usePhoneInput();

  const {
    password,
    setPassword,
    isPasswordValid,
  } = usePasswordInput();

  const { validateVerificationCode } = useFormValidation();

  const handleNext = async () => {
    try {
      if (!isPhoneValid()) {
        setError("Please enter a valid phone number");
        return;
      }

      if (!isPasswordValid()) {
        setError("Password must be at least 6 characters long");
        return;
      }
      
      setLoading(true);
      setError(null);

      const fullPhoneNumber = getFullPhoneNumber();
      const referrerId = sessionStorage.getItem('referrerId');
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        phone: fullPhoneNumber,
        password,
        options: {
          channel: 'whatsapp'
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        setError(handleAuthError(signUpError));
        return;
      }

      // If we have a referrer ID and the signup was successful, insert the referral
      if (data?.user && referrerId) {
        // Remove the '+' sign from the phone number for the referral
        const phoneWithoutPlus = fullPhoneNumber.replace('+', '');
        
        const { error: referralError } = await supabase
          .rpc('insert_referral_temp', {
            p_referrer_id: referrerId,
            p_referred_user_whatsapp: phoneWithoutPlus
          });

        if (referralError) {
          console.error("Error inserting referral:", referralError);
          toast({
            title: "Warning",
            description: "Your account was created but there was an issue with the referral.",
            variant: "destructive",
          });
        }
      }

      sessionStorage.setItem('signupPhone', fullPhoneNumber);

      toast({
        title: "Verification code sent!",
        description: "Please check your WhatsApp for the verification code",
      });
      
      setIsVerificationStep(true);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    // Clean and validate the verification code
    const cleanCode = verificationCode.trim();
    
    if (!validateVerificationCode(cleanCode)) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const fullPhoneNumber = getFullPhoneNumber();
    console.log('Attempting verification with:', { phone: fullPhoneNumber, code: cleanCode });

    try {
      // Check current session first
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session state:', session);

      const { error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: cleanCode,
        type: 'sms'
      });

      if (error) {
        console.error('Verification error:', error);
        
        if (error.message.toLowerCase().includes('expired')) {
          toast({
            title: "Code Expired",
            description: "The verification code has expired. Please request a new one.",
            variant: "destructive",
          });
          setIsVerificationStep(false);
          return;
        }
        
        throw error;
      }

      // Verify the session was updated
      const { data: { session: newSession } } = await supabase.auth.getSession();
      console.log('New session state after verification:', newSession);

      if (!newSession) {
        throw new Error("Failed to establish session after verification");
      }

      toast({
        title: "Success!",
        description: "Your phone number has been verified.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Verification process error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    password,
    setPassword,
    loading,
    error,
    handleNext,
    verificationCode,
    setVerificationCode,
    isVerificationStep,
    handleVerify,
  };
};
