
// Use @firebase namespaced packages to resolve named export type errors
import { initializeApp } from "@firebase/app";
import { getAnalytics, isSupported } from "@firebase/analytics";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs 
} from "firebase/firestore";

// Firebase configuration for bill-9acbc
const firebaseConfig = {
  apiKey: "AIzaSyDEMVfonG8Yxr5-5xY4qOqSG58KTu50uUM",
  authDomain: "bill-9acbc.firebaseapp.com",
  projectId: "bill-9acbc",
  storageBucket: "bill-9acbc.firebasestorage.app",
  messagingSenderId: "447184863635",
  appId: "1:447184863635:web:3f74e476608701a9f4e866",
  measurementId: "G-1Y03G64E95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore Instance
export const db = getFirestore(app);

// Safe Analytics initialization
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    try {
      return getAnalytics(app);
    } catch (e) {
      console.warn("Firebase Analytics could not be initialized:", e);
      return null;
    }
  }
  return null;
};

// Log bill to Firestore
export const logBill = async (type: string, number: number) => {
  try {
    return await addDoc(collection(db, "bills"), {
      type,
      number,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Get recent bills
export const getRecentBills = async (count: number = 5) => {
  try {
    const q = query(
      collection(db, "bills"),
      orderBy("timestamp", "desc"),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Error fetching bills: ", e);
    return [];
  }
};
