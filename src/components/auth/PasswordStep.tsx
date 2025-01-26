import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Input
          type="email"
          value={email}
          disabled={true}
          className="w-full bg-muted"
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Button 
          onClick={onBack}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          Back
        </Button>
        <Button 
          onClick={onSignUp}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </div>
    </div>
  );
};