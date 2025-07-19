// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDmMouLmlzPGyUAcrecoHH1mRTqnX5gctw",
  authDomain: "crud-7e23e.firebaseapp.com",
  databaseURL: "https://crud-7e23e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crud-7e23e",
  storageBucket: "crud-7e23e.firebasestorage.app",
  messagingSenderId: "890167662217",
  appId: "1:890167662217:web:2570fe2b8f29f809829858",
  measurementId: "G-Y0RZQVBLNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const db = getFirestore(app);
