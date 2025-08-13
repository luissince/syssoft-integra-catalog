"use client"
import { Customer } from '@/types';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import customers from "@/data/customer.json";

interface AuthContextType {
  user: Customer | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (username: string, password: string) => boolean;
  register: (customer: Customer) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la aplicación
    const savedAuth = localStorage.getItem("isAuthenticated");
    const userAuth = localStorage.getItem("user");
    if (savedAuth && userAuth) {
      setUser(JSON.parse(userAuth));
      setIsAuthenticated(JSON.parse(savedAuth));
      setAuthLoading(false);
    }
  }, []);

  const login = (email: string, password: string) => {
    const customer = customers.list.find(customer => customer.email === email && customer.password === password);
    if (!customer) {
      return false;
    }

    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", JSON.stringify(true));

    localStorage.setItem("user", JSON.stringify(customer));
    setUser(user);
    return true;
  };

  const register = (customer: Customer) => {

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authLoading ,login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
