
export const useFormValidation = () => {
  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15; // International standard
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
