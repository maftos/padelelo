import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get("ref");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referrer, setReferrer] = useState<{ display_name: string } | null>(null);

  useEffect(() => {
    const validateReferrer = async () => {
      if (!referrerId) {
        setError("Invalid referral link. Please ask an existing member for a valid referral link.");
        return;
      }

      try {
        const { data: referrerData, error: referrerError } = await supabase
          .from("users")
          .select("display_name")
          .eq("id", referrerId)
          .single();

        if (referrerError || !referrerData) {
          setError("Invalid referral link. Please ask an existing member for a valid referral link.");
          return;
        }

        setReferrer(referrerData);
      } catch (err) {
        console.error("Error validating referrer:", err);
        setError("An error occurred while validating the referral link.");
      }
    };

    validateReferrer();
  }, [referrerId]);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!referrerId || !referrer) {
        setError("Invalid referral link. Please ask an existing member for a valid referral link.");
        return;
      }

      // Create referral record
      const { error: referralError } = await supabase
        .from("referrals")
        .insert([
          {
            referrer_id: referrerId,
            referred_email: email,
            status: "PENDING"
          }
        ]);

      if (referralError) {
        console.error("Referral error:", referralError);
        if (referralError.message.includes("duplicate key")) {
          setError("You have already been referred by this member. Please use a different referral link or contact support.");
        } else {
          setError("An error occurred while processing your referral.");
        }
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        setError(signUpError.message);
        return;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account",
      });
      
      navigate("/");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Create your account</h1>
        {referrer && (
          <p className="text-muted-foreground">
            Invited by {referrer.display_name}
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || !referrer}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading || !referrer}
        />
        <Button 
          className="w-full" 
          onClick={handleSignUp}
          disabled={loading || !referrer}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </div>
    </div>
  );
};