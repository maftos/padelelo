
import { SignInForm } from "@/components/auth/SignInForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
            <Alert className="bg-accent">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                PadelELO is currently invite-only. You need an invitation link to create an account.
              </AlertDescription>
            </Alert>
            
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
