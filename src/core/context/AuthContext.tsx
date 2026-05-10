"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  logout: () => void;
  setTokenAndFetch: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async (jwt: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) throw new Error("unauthorized");
      const data: AuthUser = await res.json();
      setUser(data);
      setToken(jwt);
      return true;
    } catch {
      localStorage.removeItem("admin_token");
      setUser(null);
      setToken(null);
      return false;
    }
  };

  const setTokenAndFetch = async (jwt: string) => {
    localStorage.setItem("admin_token", jwt);
    await fetchMe(jwt);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (stored) {
      fetchMe(stored).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, logout, setTokenAndFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
