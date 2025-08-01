
import { useState } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [isVerificationStep, setIsVerificationStep] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your WhatsApp number to sign in to your account
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-xl backdrop-blur-sm space-y-6">
            <SignInForm onVerificationStepChange={setIsVerificationStep} />
            
            {/* Only show the "Don't have an account" section when NOT in verification step */}
            {!isVerificationStep && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Don't have an account?
                </p>
                <Link 
                  to="/signup" 
                  className="text-sm text-primary hover:underline underline-offset-4"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
