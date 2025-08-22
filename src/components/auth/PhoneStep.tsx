
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries, countryNames } from "@/lib/countries";
import { SignUpFormData } from "@/types/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CountryCodeBottomDrawer } from "./CountryCodeBottomDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

import { useState } from "react";

interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  password: string;
  setPassword: (password: string) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isVerificationStep: boolean;
  onNext: () => void;
  onVerify: () => void;
  error: string | null;
  loading: boolean;
}

export const PhoneStep = ({ 
  phoneNumber, 
  setPhoneNumber, 
  countryCode,
  setCountryCode,
  password,
  setPassword,
  verificationCode,
  setVerificationCode,
  isVerificationStep,
  onNext, 
  onVerify,
  error, 
  loading
}: PhoneStepProps) => {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  const formatPhoneDisplay = (phone: string) => {
    if (phone.length <= 1) return phone;
    if (phone.length <= 4) return phone.replace(/(\d{1})(\d{0,3})/, '$1 $2').trim();
    return phone.replace(/(\d{1})(\d{3})(\d{0,4})/, '$1 $2 $3').trim();
  };

  const getSelectedCountryInfo = () => {
    const country = countries.find(c => c.dial_code === countryCode);
    if (!country) return countryCode;
    const countryName = countryNames[country.code] || country.code;
    return `${country.flag} ${country.dial_code} ${country.code}`;
  };

  if (isVerificationStep) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); onVerify(); }} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Verify your WhatsApp</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to {countryCode}{phoneNumber}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            pattern="\d{6}"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="text-center text-lg tracking-widest"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label>WhatsApp Number</Label>
        <div className="flex gap-2">
          {isMobile ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="min-w-[140px] justify-start"
                onClick={() => setDrawerOpen(true)}
                disabled={loading}
              >
                {getSelectedCountryInfo()}
              </Button>
              <CountryCodeBottomDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                onSelect={setCountryCode}
                selectedCode={countryCode}
              />
            </>
          ) : (
            <Select 
              value={countryCode} 
              onValueChange={setCountryCode}
              disabled={loading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] z-50 bg-popover">
                {countries.map((country) => {
                  const countryName = countryNames[country.code] || country.code;
                  return (
                    <SelectItem 
                      key={`${country.code}-${country.dial_code}`}
                      value={country.dial_code}
                    >
                      {country.flag} {country.dial_code} {country.code}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
          
          <Input
            type="tel"
            placeholder="Phone number"
            value={formatPhoneDisplay(phoneNumber)}
            onChange={handlePhoneChange}
            className="flex-1"
            disabled={loading}
          />
        </div>
      </div>

      <Button 
        type="submit"
        disabled={loading || !phoneNumber}
        className="w-full"
      >
        {loading ? "Processing..." : "Sign Up"}
      </Button>
    </form>
  );
};
