import { NextResponse } from 'next/server';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const productsCollection = collection(db, 'products');
    let query = productsCollection;
    
    if (category && category !== 'All') {
      query = query(productsCollection, where('category', '==', category));
    }

    const productsSnapshot = await getDocs(query);
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || 
        !productData.image || !productData.category || !productData.stock) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const productsCollection = collection(db, 'products');
    const docRef = await addDoc(productsCollection, {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      image: productData.image,
      category: productData.category,
      stock: parseInt(productData.stock),
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}