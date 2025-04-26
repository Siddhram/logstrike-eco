import { NextResponse } from 'next/server';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let productsSnapshot;
    if (category && category !== 'All') {
      // Query products from the specific category's subcollection
      const categoryRef = collection(db, 'categories');
      const categoryQuery = query(categoryRef, where('name', '==', category));
      const categoryDocs = await getDocs(categoryQuery);
      
      if (categoryDocs.empty) {
        return NextResponse.json([]);
      }
      
      const categoryId = categoryDocs.docs[0].id;
      const productsCollection = collection(db, `categories/${categoryId}/products`);
      productsSnapshot = await getDocs(productsCollection);
    } else {
      // Get all products across all categories
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const allProducts = [];
      
      for (const categoryDoc of categoriesSnapshot.docs) {
        const productsCollection = collection(db, `categories/${categoryDoc.id}/products`);
        const productsSnapshot = await getDocs(productsCollection);
        productsSnapshot.forEach(doc => {
          allProducts.push({
            id: doc.id,
            ...doc.data(),
            category: categoryDoc.data().name
          });
        });
      }
      
      return NextResponse.json(allProducts);
    }

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

    // Check if category exists, if not create it
    const categoryRef = collection(db, 'categories');
    const categoryQuery = query(categoryRef, where('name', '==', productData.category));
    const categoryDocs = await getDocs(categoryQuery);
    
    let categoryId;
    if (categoryDocs.empty) {
      // Create new category
      const newCategoryRef = await addDoc(categoryRef, {
        name: productData.category,
        createdAt: new Date().toISOString()
      });
      categoryId = newCategoryRef.id;
    } else {
      categoryId = categoryDocs.docs[0].id;
    }
    
    // Add product to the category's products subcollection
    const productsCollection = collection(db, `categories/${categoryId}/products`);
    
    const docRef = await addDoc(productsCollection, {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      image: productData.image,
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