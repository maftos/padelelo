import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { countries, countryNames } from "@/lib/countries";
import { useFormValidation } from "@/hooks/use-form-validation";
import { SignInFormData } from "@/types/auth";
import { OTPInput } from "@/components/ui/otp-input";
import { CountryCodeBottomDrawer } from "./CountryCodeBottomDrawer";
import { CountryCodeModal } from "./CountryCodeModal";
import { useIsMobile } from "@/hooks/use-mobile";


interface SignInFormProps {
  onVerificationStepChange?: (isVerification: boolean) => void;
}

export const SignInForm = ({ onVerificationStepChange }: SignInFormProps = {}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+230");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordlessLoading, setPasswordlessLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { validatePhoneNumber, validatePassword, validateVerificationCode } = useFormValidation();

  // Load cached phone number and country code on component mount
  useEffect(() => {
    const cachedPhone = localStorage.getItem('padel_cached_phone');
    const cachedCountryCode = localStorage.getItem('padel_cached_country_code');
    
    if (cachedPhone) {
      setPhoneNumber(cachedPhone);
    }
    if (cachedCountryCode) {
      setCountryCode(cachedCountryCode);
    }
  }, []);

  // Notify parent component when verification step changes
  useEffect(() => {
    onVerificationStepChange?.(isVerificationStep);
  }, [isVerificationStep, onVerificationStepChange]);

  // Save phone number and country code to localStorage whenever they change
  const saveToCache = (phone: string, country: string) => {
    if (phone.trim()) {
      localStorage.setItem('padel_cached_phone', phone);
    }
    if (country) {
      localStorage.setItem('padel_cached_country_code', country);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    if (cleaned.length <= 15) { // Allow up to 15 digits (international standard)
      setPhoneNumber(cleaned);
      // Cache the phone number as user types (but only if it's valid length)
      if (cleaned.length >= 3) {
        saveToCache(cleaned, countryCode);
      }
    }
  };

  const handleCountryCodeChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    // Cache the country code immediately
    saveToCache(phoneNumber, newCountryCode);
  };

  const formatPhoneDisplay = (phone: string) => {
    if (phone.length <= 1) return phone;
    if (phone.length <= 4) return phone.replace(/(\d{1})(\d{0,3})/, '$1 $2').trim();
    return phone.replace(/(\d{1})(\d{3})(\d{0,4})/, '$1 $2 $3').trim();
  };

  const getSelectedCountryInfo = () => {
    const country = countries.find(c => c.dial_code === countryCode);
    if (!country) return countryCode;
    return `${country.flag} ${country.dial_code}`;
  };

  const handleAuthError = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("Phone number format is invalid")) {
            return "Please enter a valid phone number with country code";
          }
          if (error.message === "Invalid login credentials") {
            return "Invalid phone number or password. Please check your credentials.";
          }
          return error.message;
        case 422:
          return "Invalid phone number format.";
        case 429:
          return "Too many attempts. Please try again later.";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const fullPhoneNumber = countryCode + phoneNumber;

      if (!validatePhoneNumber(phoneNumber)) {
        setError("Please enter a valid phone number");
        return;
      }

      if (!validatePassword(password)) {
        setError("Password must be at least 6 characters long");
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        phone: fullPhoneNumber,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError(handleAuthError(signInError));
        return;
      }

      if (data.session) {
        // Cache the successful login phone number and country code
        saveToCache(phoneNumber, countryCode);
        
        toast.success("You have been successfully signed in");
        navigate('/');
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordlessSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setPasswordlessLoading(true);
      setError(null);

      const fullPhoneNumber = countryCode + phoneNumber;

      if (!validatePhoneNumber(phoneNumber)) {
        setError("Please enter a valid phone number");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
        options: {
          channel: 'whatsapp'
        }
      });

      if (signInError) {
        console.error("Passwordless sign in error:", signInError);
        setError(handleAuthError(signInError));
        return;
      }

      // Store the phone number for verification
      sessionStorage.setItem('loginPhone', fullPhoneNumber);
      
      // Cache the phone number and country code for future logins
      saveToCache(phoneNumber, countryCode);

      toast.success("WhatsApp message sent! Please check your WhatsApp for the verification code");
      
      setIsVerificationStep(true);

    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setPasswordlessLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanCode = verificationCode.trim();
    
    if (!validateVerificationCode(cleanCode)) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setPasswordlessLoading(true);
    setError(null);
    
    try {
      const storedPhone = sessionStorage.getItem('loginPhone');
      if (!storedPhone) {
        throw new Error("Phone number not found. Please try signing in again.");
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

      // Clear stored data
      sessionStorage.removeItem('loginPhone');

      toast.success("You have been successfully signed in");

      navigate('/');
      
    } catch (error: any) {
      console.error('Verification process error:', error);
      setError(error.message);
      toast.error(`Verification Failed: ${error.message}`);
    } finally {
      setPasswordlessLoading(false);
    }
  };

  // If we're in verification step, show OTP input
  if (isVerificationStep) {
    return (
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Verify your WhatsApp</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to {countryCode}{formatPhoneDisplay(phoneNumber)}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-center block text-sm font-medium">Verification Code</Label>
            <OTPInput
              length={6}
              value={verificationCode}
              onChange={setVerificationCode}
              disabled={passwordlessLoading}
              className="px-4"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={passwordlessLoading || verificationCode.length !== 6}
          >
            {passwordlessLoading ? "Verifying..." : "Verify & Sign In"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setIsVerificationStep(false);
              setVerificationCode("");
              setError(null);
            }}
            disabled={passwordlessLoading}
          >
            Back to Phone Number
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Password Login Form */}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label>WhatsApp Number</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-w-[80px] justify-center"
              onClick={() => isMobile ? setDrawerOpen(true) : setModalOpen(true)}
              disabled={loading || passwordlessLoading}
            >
              {getSelectedCountryInfo()}
            </Button>
            
            <Input
              type="tel"
              placeholder="Phone number"
              value={formatPhoneDisplay(phoneNumber)}
              onChange={handlePhoneChange}
              className="flex-1"
              disabled={loading || passwordlessLoading}
            />
            
            {isMobile ? (
              <CountryCodeBottomDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                onSelect={handleCountryCodeChange}
                selectedCode={countryCode}
              />
            ) : (
              <CountryCodeModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSelect={handleCountryCodeChange}
                selectedCode={countryCode}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || passwordlessLoading}
            minLength={6}
          />
        </div>

        <Button 
          type="submit"
          disabled={loading || passwordlessLoading || !phoneNumber || !password}
          className="w-full"
        >
          {loading ? "Signing in..." : "Sign In with Password"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      {/* Passwordless Login Form */}
      <form onSubmit={handlePasswordlessSignIn} className="space-y-4">
        <Button 
          type="submit"
          disabled={loading || passwordlessLoading || !phoneNumber}
          className="w-full"
          variant="outline"
        >
          {passwordlessLoading ? "Sending WhatsApp..." : "Sign In via WhatsApp"}
        </Button>
      </form>
    </div>
  );
};
