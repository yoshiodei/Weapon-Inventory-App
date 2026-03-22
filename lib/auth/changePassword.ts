import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { showToast } from "@/contexts/ShowToast";


export async function changeUserPassword(
  email: string,
  oldPassword: string,
  newPassword: string
) {
  try {
    // ✅ sign in user first (ensures currentUser exists)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      oldPassword
    );

    const user = userCredential.user;

    if (!user || !user.email) {
      showToast("User not found", "error");  
      return {
        success: false,
        message: "User not found",
      };
    }

    // ✅ create credential
    const credential = EmailAuthProvider.credential(
      user.email,
      oldPassword
    );

    // ✅ reauthenticate
    await reauthenticateWithCredential(user, credential);

    // ✅ update password
    await updatePassword(user, newPassword);

    showToast("Password changed successfully!", "success");

    return {
      success: true,
    };

  } catch (error: any) {
    showToast(getPasswordErrorMessage(error), "error");

    return {
      success: false,
      message: getPasswordErrorMessage(error),
    };
  }
}


function getPasswordErrorMessage(error: any): string {
  const code = error?.code;

  switch (code) {
    case "auth/wrong-password":
      return "Old password is incorrect";

    case "auth/weak-password":
      return "New password is too weak";

    case "auth/user-not-found":
      return "User not found";

    case "auth/too-many-requests":
      return "Too many attempts. Try again later";

    case "auth/network-request-failed":
      return "Network error";

    default:
      return "Failed to change password";
  }
}