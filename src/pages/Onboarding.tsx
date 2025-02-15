
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
    if (!isLoading && profile?.is_onboarded) {
      navigate("/dashboard");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) return null;

  return (
    <Routes>
      <Route path="/" element={<GenderStep />} />
      <Route path="/step2" element={<NameStep />} />
      <Route path="/step3" element={<NationalityStep />} />
      <Route path="/step4" element={<PhotoStep />} />
      <Route path="/step5" element={<AboutStep />} />
      <Route path="/final" element={<FinalStep />} />
    </Routes>
  );
}
