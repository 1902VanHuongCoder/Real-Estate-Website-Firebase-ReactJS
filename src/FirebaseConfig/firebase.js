// 📦 Importing necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔑 Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBvAXiEJPdniO3XeZP3KrdWrOCQp1Kryx8", // 🔑 API Key
  authDomain: "real-estate-website-faaab.firebaseapp.com", // 🌐 Auth Domain
  projectId: "real-estate-website-faaab", // 📁 Project ID
  storageBucket: "real-estate-website-faaab.appspot.com", // 🗄️ Storage Bucket
  messagingSenderId: "962859692737", // 📲 Messaging Sender ID
  appId: "1:962859692737:web:ac0e8095ee1ee7696cda40", // 🆔 App ID
  measurementId: "G-7S9LRTGCYR", // 📏 Measurement ID
};

// 🚀 Initializing Firebase app
export const app = initializeApp(firebaseConfig);

// 🔥 Initializing Firestore database
export const db = getFirestore(app);

// 🗄️ Initializing Firebase storage
export const storage = getStorage(app);
