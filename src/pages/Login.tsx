
import { useState } from "react";
import { Helmet } from "react-helmet";
import { SignInForm } from "@/components/auth/SignInForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [isVerificationStep, setIsVerificationStep] = useState(false);

  return (
    <>
      <Helmet>
        <title>Sign In - PadelELO</title>
        <meta name="description" content="Sign in to your PadelELO account to track matches, view rankings, and connect with the padel community in Mauritius." />
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Sign In - PadelELO" />
        <meta property="og:description" content="Sign in to your PadelELO account" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://padelelo.com/login" />
        <meta property="og:image" content="https://padelelo.com/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" />
        <meta property="og:locale" content="en_MU" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Sign In - PadelELO" />
        <meta name="twitter:description" content="Sign in to your PadelELO account" />
        <meta name="twitter:site" content="@padelelo" />
        <meta name="twitter:creator" content="@padelelo" />
        
        <link rel="canonical" href="https://padelelo.com/login" />
      </Helmet>
      
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
    </>
  );
};

export default Login;
