// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCA6FYjFLBl6my9iGOmhnMmHi5UnFy5_Es",
  authDomain: "elf-app-81657.firebaseapp.com",
  projectId: "elf-app-81657",
  storageBucket: "elf-app-81657.firebasestorage.app",
  messagingSenderId: "448202369450",
  appId: "1:448202369450:web:87a449f6999487d29f63d3",
  measurementId: "G-3Y0VEHSP2N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;