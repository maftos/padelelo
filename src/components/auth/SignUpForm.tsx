import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PhoneStep } from "./PhoneStep";
import { PasswordStep } from "./PasswordStep";
import { useSignUp } from "./useSignUp";

export const SignUpForm = () => {
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get('ref');
  const {
    phoneNumber,
    setPhoneNumber,
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
        <PhoneStep
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onNext={handleNext}
          error={error}
          loading={loading}
        />
      ) : (
        <PasswordStep
          email={phoneNumber}
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