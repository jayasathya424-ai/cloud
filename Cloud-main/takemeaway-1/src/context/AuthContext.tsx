import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, provider, login as firebaseLogin } from "../firebaseConfig";
import {
  onAuthStateChanged,
  signOut,
  User,
  getRedirectResult,
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen for login state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Handle redirect login results (if popup failed previously)
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        if (error) console.warn("Redirect login error:", error);
      });

    return () => unsubscribe();
  }, []);

  // ✅ Safe login with fallback (uses firebaseLogin from firebaseConfig)
  const login = async () => {
    try {
      await firebaseLogin(); // will try popup → redirect fallback automatically
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook for easier context use
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
