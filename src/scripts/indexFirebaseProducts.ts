const { MeiliSearch } = require('meilisearch');
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Define interfaces for better type safety
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
  category?: string; // Added category field
}

// Initialize Firebase Admin SDK with proper path resolution
const serviceAccountPath = path.resolve(__dirname, '../../serviceacc.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Check if Firebase app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function indexFirebaseProducts(): Promise<void> {
  try {
    // Initialize MeiliSearch client
    const client = new MeiliSearch({
      host: 'https://ms-dee76a5e346f-22280.sgp.meilisearch.io',
      apiKey: 'd378a3197171c336dd3d1e88aad1f2308b8a8d29c69d55b568b4a0a40a2a4fa4',
    });

    // Get products from Firestore - using the same approach as your API route
    const db = admin.firestore();
    console.log('Fetching products from categories in Firestore...');
    
    // Get all categories
    const categoriesSnapshot = await db.collection('categories').get();
    
    if (categoriesSnapshot.empty) {
      console.log('No categories found in Firestore');
      return;
    }
    
    // Transform Firestore documents to array of products
    const products: Product[] = [];
    
    // Loop through each category
    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      const categoryName = categoryData.name;
      
      // Get products from this category's subcollection
      const productsCollection = db.collection(`categories/${categoryDoc.id}/products`);
      const productsSnapshot = await productsCollection.get();
      
      console.log(`Found ${productsSnapshot.size} products in category "${categoryName}"`);
      
      // Add each product to our array
      productsSnapshot.forEach((doc: any) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          stock: data.stock || 0,
          image: data.image || "",
          createdAt: data.createdAt || new Date().toISOString(),
          category: categoryName // Add the category name
        });
      });
    }

    console.log(`Found ${products.length} total products across all categories`);

    // Create or update the products index
    const index = client.index('products');
    
    // Update index settings
    console.log('Updating index settings...');
    await index.updateSettings({
      searchableAttributes: [
        'name',
        'description',
        'category' // Added category as searchable
      ],
      filterableAttributes: [
        'price',
        'stock',
        'category' // Added category as filterable
      ],
      sortableAttributes: [
        'price',
        'createdAt'
      ],
    });

    // Add documents to the index
    console.log('Adding products to MeiliSearch index...');
    const response = await index.addDocuments(products);
    console.log('Products indexed successfully:', response);

  } catch (error: unknown) {
    console.error('Error indexing products:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
  } finally {
    try {
      // Terminate the Firebase Admin app
      if (admin.apps.length) {
        await admin.app().delete();
      }
    } catch (err) {
      console.error('Error terminating Firebase app:', err);
    }
  }
}

// Run the indexing function
indexFirebaseProducts().then(() => {
  console.log('Indexing process completed');
}).catch(err => {
  console.error('Fatal error in indexing process:', err);
  process.exit(1);
});