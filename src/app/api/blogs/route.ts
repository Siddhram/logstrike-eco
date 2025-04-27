import { NextResponse } from 'next/server';
import { addDoc, collection, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

// Get all blogs
export async function GET() {
  try {
    const blogsCollection = collection(db, 'blogs');
    const blogsSnapshot = await getDocs(blogsCollection);
    
    const blogs = blogsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// Create new blog
export async function POST(request: Request) {
  try {
    // In the POST handler
    const { userId, title, content, imageUrl } = await request.json();
    
    // Update the blogData object
    const blogData = {
      title,
      description:content, // Changed from description to content
      imageUrl: imageUrl || '',
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [] // Initialize as empty array instead of 0
    };

    // Add to global blogs collection
    const blogRef = await addDoc(collection(db, 'blogs'), blogData);
    
    // Add to user's personal blogs collection
    await addDoc(collection(db, `users/${userId}/blogs`), blogData);

    return NextResponse.json({ id: blogRef.id });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

// Add like to blog
export async function PUT(request: Request) {
  try {
    const { blogId, userId } = await request.json();
    
    if (!blogId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const blogRef = doc(db, 'blogs', blogId);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const blogData = blogSnap.data();
    const likes = blogData.likes || []; // Ensure likes is an array

    // Check if user already liked the post
    if (likes.includes(userId)) {
      return NextResponse.json(
        { error: 'User already liked this post' },
        { status: 400 }
      );
    }

    // Add user to likes array
    await updateDoc(blogRef, {
      likes: [...likes, userId]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking blog:", error);
    return NextResponse.json(
      { error: 'Failed to like blog' },
      { status: 500 }
    );
  }
}

// Delete blog (admin only)
export async function DELETE(request: Request) {
  try {
    const { blogId } = await request.json();
    
    if (!blogId) {
      return NextResponse.json(
        { error: 'Missing blog ID' },
        { status: 400 }
      );
    }

    const blogRef = doc(db, 'blogs', blogId);
    await deleteDoc(blogRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}