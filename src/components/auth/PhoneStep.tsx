
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";
import { SignUpFormData } from "@/types/auth";

interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onNext: () => void;
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
  onNext, 
  error, 
  loading
}: PhoneStepProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  const formatPhoneDisplay = (phone: string) => {
    return phone.replace(/(\d{3})(?=\d)/g, '$1 ');
  };

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
          <Select 
            value={countryCode} 
            onValueChange={setCountryCode}
            disabled={loading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Country Code" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {countries.map((country) => (
                <SelectItem 
                  key={country.code} 
                  value={country.dial_code}
                >
                  {country.flag} {country.dial_code} ({country.code})
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
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          minLength={6}
        />
      </div>

      <Button 
        type="submit"
        disabled={loading || !phoneNumber || !password}
        className="w-full"
      >
        {loading ? "Processing..." : "Sign Up"}
      </Button>
    </form>
  );
};
