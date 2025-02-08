
export interface AuthError {
  message: string;
}

export interface SignUpFormData {
  phoneNumber: string;
  countryCode: string;
  password: string;
}

export interface SignInFormData {
  phoneNumber: string;
  countryCode: string;
  password: string;
}

export interface VerificationFormData {
  code: string;
  phone: string;
}
