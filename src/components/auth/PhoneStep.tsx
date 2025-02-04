import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PhoneStepProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  onNext: () => void;
  error: string | null;
  loading: boolean;
}

export const PhoneStep = ({ phoneNumber, setPhoneNumber, onNext, error, loading }: PhoneStepProps) => {
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Input
          type="tel"
          placeholder="WhatsApp number (e.g. +1234567890)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full"
          disabled={loading}
        />
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