import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  onNext: () => void;
  error: string | null;
  loading: boolean;
}

export const PhoneStep = ({ 
  phoneNumber, 
  setPhoneNumber, 
  countryCode,
  setCountryCode,
  onNext, 
  error, 
  loading 
}: PhoneStepProps) => {
  return (
    <div className="space-y-4">
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
            <SelectContent>
              <SelectItem value="+230">🇲🇺 +230 (MU)</SelectItem>
              {/* Add more countries as needed */}
            </SelectContent>
          </Select>
          
          <Input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
        </div>
      </div>

      <Button 
        onClick={onNext}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Processing..." : "Next"}
      </Button>
    </div>
  );
};