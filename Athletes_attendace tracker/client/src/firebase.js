import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCx7xHvfI5SsDQxkkfHiB4BOet-wA14ono",
  authDomain: "attendencetracker-42c6d.firebaseapp.com",
  projectId: "attendencetracker-42c6d",
  storageBucket: "attendencetracker-42c6d.firebasestorage.app",
  messagingSenderId: "276913458101",
  appId: "1:276913458101:web:8d324d1eaf549e672fa7fc"
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// Enable offline persistence
if (db) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("Multiple tabs open, persistence disabled");
    } else if (err.code === "unimplemented") {
      console.warn("Browser doesn't support offline persistence");
    }
  });
}

// A helper to verify if we can actually reach Firebase Services
export async function checkFirebaseConnection() {
  if (!isFirebaseConfigured) return false;
  
  // Use standard browser navigator state to avoid CORS blocking policies on raw HTTP requests
  if (typeof window !== "undefined" && window.navigator) {
    return window.navigator.onLine;
  }
  
  return true;
}

