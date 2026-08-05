"use client";

import { fetchRegisterConsumer } from '@/data/data-rest';
import { loginCustomer } from '@/lib/api';
import { Person } from '@/types/api-type';
import { FormCustomer } from '@/types/form';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface AuthContextType {
  user: Person | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (username: string, password: string) => Promise<Person | string>;
  register: (person: FormCustomer) => Promise<boolean>;
  update: (person: Person) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    const userAuth = localStorage.getItem("user");
    if (savedAuth && userAuth) {
      setUser(JSON.parse(userAuth));
      setIsAuthenticated(JSON.parse(savedAuth));
    }

    setAuthLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<Person | string> => {
    const customer = await loginCustomer({ email, password });

    if (typeof customer === "string") {
      return customer;
    }

    localStorage.setItem("isAuthenticated", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify(customer));

    setIsAuthenticated(true);
    setUser(customer);
    return customer;
  };

  const update = (person: Person) => {
    setUser(person);
    localStorage.setItem("user", JSON.stringify(person));
  };

  const register =  async (body: FormCustomer) => {
    const { success } = await fetchRegisterConsumer(body);

    if (!success) {
      return false;
    }

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authLoading, login, register, update, logout }}>
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
