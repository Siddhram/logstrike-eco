import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, orderBy, limit, DocumentData } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC80b-Jnth6H9N72kgZ-qD2Vk-xWcAxneg",
  authDomain: "logstrike-362b7.firebaseapp.com",
  projectId: "logstrike-362b7",
  storageBucket: "logstrike-362b7.firebasestorage.app",
  messagingSenderId: "136606483960",
  appId: "1:136606483960:web:8f5e1dd94e10d28c71420d",
  measurementId: "G-S9V13231R0"
};

const app = initializeApp(firebaseConfig);
let analytics;

// Initialize analytics only in browser environment
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

const auth = getAuth(app);
const db = getFirestore(app);

// Product interface based on your Firestore collection
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
}

// Function to fetch all products from Firestore
export async function fetchProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const productsSnapshot = await getDocs(productsRef);
    
    return productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        stock: data.stock || 0,
        image: data.image || "",
        createdAt: data.createdAt || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Function to search products
export async function searchProducts(searchQuery: string): Promise<Product[]> {
  try {
    // Fetch all products first (Firestore doesn't support full-text search natively)
    const products = await fetchProducts();
    
    // If no search query, return all products
    if (!searchQuery.trim()) return products;
    
    // Filter products based on search query
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

export { auth, db };