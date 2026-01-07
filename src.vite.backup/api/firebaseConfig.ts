// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "past-desert.firebaseapp.com",
  projectId: "past-desert",
  storageBucket: "past-desert.firebasestorage.app",
  messagingSenderId: "717040673386",
  appId: "1:717040673386:web:7d19067a0353ff7634e013",
  measurementId: "G-K90LH6N6S7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);