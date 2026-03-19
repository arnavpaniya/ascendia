import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const defaultFirebaseConfig = {
  apiKey: "AIzaSyAbWaQIN0AYUcD8N2HDKYztn2Qj9olt9Jw",
  authDomain: "ascendia-1b973.firebaseapp.com",
  projectId: "ascendia-1b973",
  storageBucket: "ascendia-1b973.firebasestorage.app",
  messagingSenderId: "196937817324",
  appId: "1:196937817324:web:99c6a9c7dd073fdfd9d9c9",
  measurementId: "G-FYNDG5P6ET",
} as const;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? defaultFirebaseConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? defaultFirebaseConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? defaultFirebaseConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? defaultFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? defaultFirebaseConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? defaultFirebaseConfig.measurementId,
};

const missingConfigKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfigKeys.length > 0) {
  throw new Error(
    `Missing Firebase environment variables: ${missingConfigKeys.join(", ")}. ` +
      "Add them to your local .env file before starting the app.",
  );
}

if (typeof window !== "undefined") {
  const missingEnvKeys = Object.entries(defaultFirebaseConfig)
    .filter(([key]) => !process.env[`NEXT_PUBLIC_FIREBASE_${key.replace(/[A-Z]/g, (match) => `_${match}`).toUpperCase()}`])
    .map(([key]) => key);

  if (missingEnvKeys.length > 0) {
    console.warn(
      `Firebase env vars are missing for: ${missingEnvKeys.join(", ")}. Falling back to the bundled Ascendia Firebase config.`,
    );
  }
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  void isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics, googleProvider };
