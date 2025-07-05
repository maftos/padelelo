
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useSearchParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useReferrer } from "@/hooks/use-referrer";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/components/auth/useSignUp";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get('ref');
  const { data: referrer, isLoading: isLoadingReferrer } = useReferrer(referrerId);
  const { isVerificationStep } = useSignUp();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
            {referrerId && !isVerificationStep && (
              <div className="flex flex-col items-center gap-4 pb-6 border-b">
                {isLoadingReferrer ? (
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : referrer ? (
                  <>
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={referrer.profile_photo} />
                      <AvatarFallback>
                        {referrer.display_name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Invited by</p>
                      <p className="font-medium">{referrer.display_name}</p>
                    </div>
                  </>
                ) : null}
              </div>
            )}
            
            <SignUpForm />
            
            {!isVerificationStep && (
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
