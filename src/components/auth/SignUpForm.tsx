import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PhoneStep } from "./PhoneStep";
import { useSignUp } from "./useSignUp";

export const SignUpForm = () => {
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get('ref');
  const {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    password,
    setPassword,
    loading,
    error,
    handleNext,
  } = useSignUp();

  useEffect(() => {
    if (referrerId) {
      sessionStorage.setItem('referrerId', referrerId);
      console.log('Saved referrerId to session storage:', referrerId);
    }
  }, [referrerId]);

  return (
    <div className="space-y-4">
      <PhoneStep
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        password={password}
        setPassword={setPassword}
        onNext={handleNext}
        error={error}
        loading={loading}
      />
    </div>
  );
};