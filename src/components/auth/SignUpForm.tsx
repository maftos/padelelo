import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { EmailStep } from "./EmailStep";
import { PasswordStep } from "./PasswordStep";
import { useSignUp } from "./useSignUp";

export const SignUpForm = () => {
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get('ref');
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    step,
    handleNext,
    handleBack,
    handleSignUp,
  } = useSignUp();

  useEffect(() => {
    if (referrerId) {
      sessionStorage.setItem('referrerId', referrerId);
      console.log('Saved referrerId to session storage:', referrerId);
    }
  }, [referrerId]);

  return (
    <div className="space-y-4">
      {step === 1 ? (
        <EmailStep
          email={email}
          setEmail={setEmail}
          onNext={handleNext}
          error={error}
          loading={loading}
        />
      ) : (
        <PasswordStep
          email={email}
          password={password}
          setPassword={setPassword}
          onBack={handleBack}
          onSignUp={handleSignUp}
          error={error}
          loading={loading}
        />
      )}
    </div>
  );
};