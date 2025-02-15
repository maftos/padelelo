
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { GenderStep } from "@/components/onboarding/steps/GenderStep";
import { NameStep } from "@/components/onboarding/steps/NameStep";
import { NationalityStep } from "@/components/onboarding/steps/NationalityStep";
import { PhotoStep } from "@/components/onboarding/steps/PhotoStep";
import { AboutStep } from "@/components/onboarding/steps/AboutStep";
import { FinalStep } from "@/components/onboarding/steps/FinalStep";

export default function Onboarding() {
  const { profile, isLoading } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // Add logging for debugging
    console.log("Onboarding.tsx - profile:", profile);
    
    if (!isLoading && profile?.is_onboarded) {
      console.log("User is already onboarded, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    console.log("Onboarding.tsx - Loading...");
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<GenderStep />} />
      <Route path="/step-2" element={<NameStep />} />
      <Route path="/step-3" element={<NationalityStep />} />
      <Route path="/step-4" element={<PhotoStep />} />
      <Route path="/step-5" element={<AboutStep />} />
      <Route path="/final" element={<FinalStep />} />
    </Routes>
  );
}
