import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from '../../serviceacc.json';

let adminAuth;

try {
  // Check if Firebase app is already initialized
  if (getApps().length === 0) {
    const adminApp = initializeApp({
      credential: cert(serviceAccount as any)
    });
    
    adminAuth = getAuth(adminApp);
    console.log("Firebase Admin SDK initialized successfully");
  } else {
    // Use existing app
    adminAuth = getAuth(getApps()[0]);
  }
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  throw error;
}

export { adminAuth };