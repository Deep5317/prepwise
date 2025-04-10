// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNK8KwsOaVVGZsoa3GSk9WeX7EbSdn5rc",
  authDomain: "prepwise-179fb.firebaseapp.com",
  projectId: "prepwise-179fb",
  storageBucket: "prepwise-179fb.firebasestorage.app",
  messagingSenderId: "253762093213",
  appId: "1:253762093213:web:b31c9e3e3a38f68bfe9474",
  measurementId: "G-VFYDXQ8BE5"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
