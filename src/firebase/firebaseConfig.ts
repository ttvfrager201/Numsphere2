import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if all required environment variables are present
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that all required environment variables are present
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `VITE_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.error(
    `Missing Firebase environment variables: ${missingVars.join(", ")}\n` +
      "Please check your environment variables in the Tempo project settings.",
  );
}

// Use environment variables or fallback to demo config for development
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || "AIzaSyDemo-Key-For-Development-Only",
  authDomain: requiredEnvVars.authDomain || "numsphere-demo.firebaseapp.com",
  projectId: requiredEnvVars.projectId || "numsphere-demo",
  storageBucket: requiredEnvVars.storageBucket || "numsphere-demo.appspot.com",
  messagingSenderId: requiredEnvVars.messagingSenderId || "123456789",
  appId: requiredEnvVars.appId || "1:123456789:web:abcdef123456",
};

// Log configuration status (without sensitive data)
console.log("Firebase Configuration Status:", {
  hasApiKey:
    !!firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "AIzaSyDemo-Key-For-Development-Only",
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId:
    !!firebaseConfig.projectId && firebaseConfig.projectId !== "numsphere-demo",
  usingDemoConfig: firebaseConfig.projectId === "numsphere-demo",
});

let app;
let auth;
let db;
let storage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);

  // Create mock services for development if Firebase fails
  console.warn("Using mock Firebase services for development");
}

export { auth, db, storage };
export default app;
