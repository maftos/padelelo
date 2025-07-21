import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";
import { useFormValidation } from "@/hooks/use-form-validation";
import { SignInFormData } from "@/types/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

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
  const { toast } = useToast();
  const navigate = useNavigate();
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
    if (cleaned.length <= 8) {
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
        
        toast({
          title: "Success!",
          description: "You have been successfully signed in",
        });
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

      toast({
        title: "WhatsApp Message Sent!",
        description: "Please check your WhatsApp for the verification code",
      });
      
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
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
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
          toast({
            title: "Code Expired",
            description: "The verification code has expired. Please request a new one.",
            variant: "destructive",
          });
          setIsVerificationStep(false);
          return;
        }
        
        throw verifyError;
      }

      // Clear stored data
      sessionStorage.removeItem('loginPhone');

      toast({
        title: "Success!",
        description: "You have been successfully signed in",
      });

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
            <Label htmlFor="otp-input" className="text-center block">Verification Code</Label>
            <div className="flex justify-center">
              <Input
                id="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                pattern="\d{6}"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                className="text-center text-lg tracking-[0.5em] font-mono w-48"
                disabled={passwordlessLoading}
                autoComplete="one-time-code"
              />
            </div>
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
            <Select 
              value={countryCode} 
              onValueChange={handleCountryCodeChange}
              disabled={loading || passwordlessLoading}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countries.map((country) => (
                  <SelectItem 
                    key={country.code} 
                    value={country.dial_code}
                  >
                    {country.flag} {country.dial_code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="tel"
              placeholder="Phone number"
              value={formatPhoneDisplay(phoneNumber)}
              onChange={handlePhoneChange}
              className="flex-1"
              disabled={loading || passwordlessLoading}
            />
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
