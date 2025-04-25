import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const userRecords = await adminAuth.listUsers(1000);
    console.log(userRecords);
    
    const usersData = userRecords.users.map(user => ({
      uid: user.uid,
      email: user.email || 'No email'
    }));

    return NextResponse.json(usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
