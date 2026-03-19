import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbWaQIN0AYUcD8N2HDKYztn2Qj9olt9Jw",
  authDomain: "ascendia-1b973.firebaseapp.com",
  projectId: "ascendia-1b973",
  storageBucket: "ascendia-1b973.firebasestorage.app",
  messagingSenderId: "196937817324",
  appId: "1:196937817324:web:99c6a9c7dd073fdfd9d9c9",
  measurementId: "G-FYNDG5P6ET"
};

// Initialize Firebase once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only if supported (browser environment)
let analytics = null;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, auth, db, analytics, googleProvider };
