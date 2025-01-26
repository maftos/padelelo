import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  onNext: () => void;
  error: string | null;
  loading: boolean;
}

export const EmailStep = ({ email, setEmail, onNext, error, loading }: EmailStepProps) => {
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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