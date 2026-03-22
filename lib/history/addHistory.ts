import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { de } from "date-fns/locale";
// import { ActivityLogInput } from "@/types/activity";

export async function addHistory(
    action: string, actionBy: string, description: string, type: string
) {
  try {
    const ref = collection(db, "history");

    await addDoc(ref, {
      action,
      actionBy,
      description,
      type,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error adding history:", error);

    return {
      success: false,
      message: error.message,
    };
  }
}