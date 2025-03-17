// 📦 Importing necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔑 Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // 🔑 API Key
  authDomain: "real-estate-website-faaab.firebaseapp.com", // 🌐 Auth Domain
  projectId: "real-estate-website-faaab", // 📁 Project ID
  storageBucket: "real-estate-website-faaab.appspot.com", // 🗄️ Storage Bucket
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, // 📲 Messaging Sender ID
  appId: process.env.REACT_APP_FIREBASE_APP_ID, // 🆔 App ID
  measurementId: "G-7S9LRTGCYR", // 📏 Measurement ID
};

// 🚀 Initializing Firebase app
export const app = initializeApp(firebaseConfig);

// 🔥 Initializing Firestore database
export const db = getFirestore(app);

// 🗄️ Initializing Firebase storage
export const storage = getStorage(app);
