import { SignInForm } from "@/components/auth/SignInForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        
        <SignInForm />
        
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="underline hover:text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;