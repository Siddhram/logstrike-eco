import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC80b-Jnth6H9N72kgZ-qD2Vk-xWcAxneg",
  authDomain: "logstrike-362b7.firebaseapp.com",
  projectId: "logstrike-362b7",
  storageBucket: "logstrike-362b7.firebasestorage.app",
  messagingSenderId: "136606483960",
  appId: "1:136606483960:web:8f5e1dd94e10d28c71420d",
  measurementId: "G-S9V13231R0"
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