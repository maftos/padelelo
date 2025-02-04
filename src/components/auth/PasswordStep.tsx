import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

interface PasswordStepProps {
  email: string;
  password: string;
  setPassword: (password: string) => void;
  onBack: () => void;
  onSignUp: () => void;
  error: string | null;
  loading: boolean;
}

export const PasswordStep = ({ 
  email,
  password, 
  setPassword, 
  onBack, 
  onSignUp,
  error,
  loading 
}: PasswordStepProps) => {
  // Format the phone number for display
  const formatPhoneDisplay = (phone: string) => {
    const [countryCode, ...rest] = phone.split(' ');
    const number = rest.join('').replace(/(\d{3})(?=\d)/g, '$1 ');
    return `${countryCode} ${number}`;
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>WhatsApp Number</Label>
        <div className="h-10 px-3 py-2 rounded-md border bg-muted text-muted-foreground">
          {formatPhoneDisplay(email)}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="w-full"
        >
          Back
        </Button>
        <Button 
          onClick={onSignUp}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Processing..." : "Sign Up"}
        </Button>
      </div>
    </div>
  );
};