import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    const blogsQuery = query(
      collection(db, 'blogs'),
      where('userId', '==', userId)
    );
    
    const blogsSnapshot = await getDocs(blogsQuery);
    const blogs = blogsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    return NextResponse.json(
      { error: 'Failed to fetch user blogs' },
      { status: 500 }
    );
  }
}