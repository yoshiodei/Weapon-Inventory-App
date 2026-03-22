export type LoginValidationResult = {
  valid: boolean;
  message?: string;
};

export function validateLogin(email: string, password: string): LoginValidationResult {
  // check empty
  if (!email || !password) {
    return {
      valid: false,
      message: "All fields are required",
    };
  }

  // email format check
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: "Invalid email format",
    };
  }

  // password length
  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters",
    };
  }

  return {
    valid: true,
  };
}