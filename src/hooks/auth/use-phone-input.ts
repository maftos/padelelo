
import { useState } from "react";
import { useFormValidation } from "@/hooks/use-form-validation";

export const usePhoneInput = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+230"); // Default to Mauritius
  const { validatePhoneNumber } = useFormValidation();

  const isPhoneValid = () => validatePhoneNumber(phoneNumber);

  const getFullPhoneNumber = () => countryCode + phoneNumber;

  return {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    isPhoneValid,
    getFullPhoneNumber,
  };
};
