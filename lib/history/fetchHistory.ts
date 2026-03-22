import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Timestamp } from 'firebase/firestore';

interface ActivityLog {
  id: string;
  type: 'login' | 'logout' | 'create' | 'delete' | 'edit';
  action: string;
  actionBy: string;
  description: string;
  createdAt: Timestamp;
}

export async function fetchHistory() {
  try {
    const ref = collection(db, "history");

    // optional: order by time if you have timestamp field
    const q = query(ref, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    const list: ActivityLog[] = [];

    snapshot.forEach((doc) => {
      list.push({
       id: doc.id,
       ...(doc.data() as Omit<ActivityLog, "id">),
      });
    });

    return {
      success: true,
      data: list,
    };
  } catch (error: any) {
    console.error("Error fetching history:", error);

    return {
      success: false,
      message: error.message,
    };
  }
}