export function getFirebaseAuthErrorMessage(error: any): string {
  const code = error?.code || "";

  switch (code) {
    case "auth/invalid-email":
      return "The email address is not valid.";

    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/invalid-credential":
      return "Invalid email or password.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";

    case "auth/internal-error":
      return "Something went wrong. Please try again.";

    case "auth/missing-password":
      return "Please enter your password.";

    case "auth/missing-email":
      return "Please enter your email.";

    default:
      return "Login failed. Please try again.";
  }
}