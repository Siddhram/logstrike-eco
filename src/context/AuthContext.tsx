"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: UserWithRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

interface UserWithRole extends User {
  role?: 'admin' | 'user';
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role || 'user';
        setUser({ ...user, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Force refresh the token to get the latest custom claims
    await userCredential.user.getIdTokenResult(true);
    
    // Now get the token result with fresh claims
    const idTokenResult = await userCredential.user.getIdTokenResult();
    const role = idTokenResult.claims.role || 'user';
    
    console.log("User role from token:", role);
    setUser({ ...userCredential.user, role });
  };

  const register = async (email: string, password: string, role: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await fetch('/api/setRole', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await userCredential.user.getIdToken()}`
      },
      body: JSON.stringify({ 
        role,
        uid: userCredential.user.uid 
      })
    });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);