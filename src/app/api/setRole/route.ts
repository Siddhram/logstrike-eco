import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert } from 'firebase-admin/app';
import jsonfile from '../../../../serviceacc.json'
// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: cert(jsonfile as any),
});

export async function POST(request: Request) {
  try {
    const { role, uid } = await request.json();
    const auth = getAuth();
    
    // Verify and set custom claims
    await auth.setCustomUserClaims(uid, { role });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting role:', error);
    return NextResponse.json(
      { error: 'Failed to set role' },
      { status: 500 }
    );
  }
}