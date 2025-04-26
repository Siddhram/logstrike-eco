import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin'
import serviceAccount from '../../../../serviceacc.json';

// Initialize Firebase Admin SDK if not already initialized
let app;
try {
  app = admin.app();
} catch {
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

// Get Auth instance
const auth = admin.auth();

export async function POST(request: Request) {
  try {
    const { uid, role } = await request.json();

    if (!uid || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Set custom user claims
    await auth.setCustomUserClaims(uid, { role });

    return NextResponse.json(
      { success: true, message: `User role set to ${role}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting user role:', error);
    return NextResponse.json(
      { error: 'Failed to set user role' },
      { status: 500 }
    );
  }
}