import { SignUpForm } from "@/components/auth/SignUpForm";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        
        <SignUpForm />
        
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;