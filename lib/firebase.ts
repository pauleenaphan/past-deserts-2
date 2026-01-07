// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "past-desert.firebaseapp.com",
  projectId: "past-desert",
  storageBucket: "past-desert.firebasestorage.app",
  messagingSenderId: "717040673386",
  appId: "1:717040673386:web:7d19067a0353ff7634e013",
  measurementId: "G-K90LH6N6S7"
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

