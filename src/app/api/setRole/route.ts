import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import jsonfile from '../../../../serviceacc.json';

// Initialize Firebase Admin SDK if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(jsonfile as any),
  });
} else {
  app = getApps()[0];
}

export async function POST(request: Request) {
  try {
    const { role, uid } = await request.json();
    
    if (!uid || !role) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const auth = getAuth();
    
    // Set custom claims
    console.log(`Setting role ${role} for user ${uid}`);
    
    await auth.setCustomUserClaims(uid, { role });
    
    // Optionally update the user document in Firestore
    // This is useful for querying users by role
    
    return NextResponse.json({ 
      success: true,
      message: `User ${uid} has been assigned the ${role} role`
    });
  } catch (error) {
    console.error('Error setting role:', error);
    return NextResponse.json(
      { 
        error: 'Failed to set role',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}