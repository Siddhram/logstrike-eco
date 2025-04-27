import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDiV4gZZHVfEOQrYfLWZCA3bwyfdnGtE04",
  authDomain: "cartlog-a15f7.firebaseapp.com",
  projectId: "cartlog-a15f7",
  storageBucket: "cartlog-a15f7.firebasestorage.app",
  messagingSenderId: "1090009888535",
  appId: "1:1090009888535:web:fb5d2bb86fa2ef1a336952",
  measurementId: "G-JF3HGE8RWB"
};

const app = initializeApp(firebaseConfig);
let analytics;

// Initialize analytics only in browser environment
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };