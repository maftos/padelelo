
import { useState } from "react";
import { useFormValidation } from "@/hooks/use-form-validation";

export const usePasswordInput = () => {
  const [password, setPassword] = useState("");
  const { validatePassword } = useFormValidation();

  const isPasswordValid = () => validatePassword(password);

  return {
    password,
    setPassword,
    isPasswordValid,
  };
};
