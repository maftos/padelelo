import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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

      setLoading(true);
      setError(null);

      const fullPhoneNumber = getFullPhoneNumber();
      const referrerId = sessionStorage.getItem('referrerId');
      
      // For signup, we use passwordless auth (OTP only)
      const { data, error: signUpError } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
        options: {
          data: {
            phone: fullPhoneNumber
          },
          channel: 'whatsapp'
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        setError(handleAuthError(signUpError));
        return;
      }

      // Referral functionality removed

      // Store the phone number for verification
      sessionStorage.setItem('signupPhone', fullPhoneNumber);

      toast.success("Verification code sent! Please check your WhatsApp");
      
      setIsVerificationStep(true);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndGetSession = async (maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) return { session, error: null };
        if (i < maxRetries - 1) await new Promise(resolve => setTimeout(resolve, delay));
      } catch (err) {
        if (i === maxRetries - 1) return { session: null, error: err };
      }
    }
    return { session: null, error: new Error("Failed to establish session after multiple attempts") };
  };

  const handleVerify = async () => {
    const cleanCode = verificationCode.trim();
    
    if (!validateVerificationCode(cleanCode)) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const storedPhone = sessionStorage.getItem('signupPhone');
      if (!storedPhone) {
        throw new Error("Phone number not found. Please try signing up again.");
      }

      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: storedPhone,
        token: cleanCode,
        type: 'sms'
      });

      if (verifyError) {
        console.error('Verification error:', verifyError);
        
        if (verifyError.message.toLowerCase().includes('expired')) {
          toast.error("The verification code has expired. Please request a new one.");
          setIsVerificationStep(false);
          return;
        }
        
        throw verifyError;
      }

      // Implement retry mechanism for session establishment
      const { session, error: sessionError } = await verifyAndGetSession();
      
      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        throw new Error("Failed to establish session. Please try logging in.");
      }

      // Clear any stored temporary data
      sessionStorage.removeItem('signupPhone');
      sessionStorage.removeItem('referrerId');

      toast.success("Your phone number has been verified. Welcome!");

      // Only navigate after confirming we have a valid session
      navigate('/');
      
    } catch (error: any) {
      console.error('Verification process error:', error);
      setError(error.message);
      toast.error(`Verification Failed: ${error.message}`);
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
