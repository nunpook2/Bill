
// นำเข้า Firebase โดยใช้ Direct URL เพื่อป้องกันปัญหา "Service not available" จากการ Mapping ที่ผิดพลาด
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// ใช้ Firebase API Key ดั้งเดิมที่ระบุมาในโปรเจกต์ bill-9acbc
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

// ฟังก์ชันเริ่มต้น Analytics แบบปลอดภัย
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

// บันทึกข้อมูลบิลลง Firestore
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

// ดึงข้อมูลบิลล่าสุด
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
