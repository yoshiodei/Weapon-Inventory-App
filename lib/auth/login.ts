import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { getFirebaseAuthErrorMessage } from "./firebaseErrorMessages";
import { addHistory } from "../history/addHistory";


export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    addHistory(
      "Login",
      email,
      `User ${email} logged in`,
      "login"
    );

    return {
      success: true,
      user,
    };
  } catch (error: any) {

    const errorMessage = getFirebaseAuthErrorMessage(error.code);

    return {
      success: false,
      message: errorMessage,
    };
  }
}