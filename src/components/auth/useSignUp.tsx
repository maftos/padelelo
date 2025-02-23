
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

      if (data?.user && referrerId) {
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

      // Store the phone number for verification
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
    setError(null);
    
    try {
      const storedPhone = sessionStorage.getItem('signupPhone');
      if (!storedPhone) {
        throw new Error("Phone number not found. Please try signing up again.");
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: storedPhone,
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
          // Return to phone input step to request a new code
          setIsVerificationStep(false);
          return;
        }
        
        throw error;
      }

      // After successful verification, check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Failed to establish session after verification");
      }

      // Clear any stored temporary data
      sessionStorage.removeItem('signupPhone');
      sessionStorage.removeItem('referrerId');

      toast({
        title: "Success!",
        description: "Your phone number has been verified. Welcome!",
      });

      // Only navigate after confirming we have a valid session
      navigate('/');
      
    } catch (error: any) {
      console.error('Verification process error:', error);
      setError(error.message);
      toast({
        title: "Verification Failed",
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

