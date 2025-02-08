
export const useFormValidation = () => {
  const validatePhoneNumber = (phone: string) => {
    return phone.length > 0;
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateVerificationCode = (code: string) => {
    return /^\d{6}$/.test(code);
  };

  return {
    validatePhoneNumber,
    validatePassword,
    validateVerificationCode,
  };
};
