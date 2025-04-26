import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET() {
  try {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    const userRecords = await adminAuth.listUsers(1000);
    
    const usersData = userRecords.users.map(user => ({
      uid: user.uid,
      email: user.email || 'No email',
      displayName: user.displayName || 'No name',
      createdAt: user.metadata.creationTime,
      lastSignIn: user.metadata.lastSignInTime
    }));

    return NextResponse.json(usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}