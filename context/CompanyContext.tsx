"use client";

import { Company } from "@/types/api-type";
import { createContext, useContext, ReactNode, useState } from "react";

interface CompanyContextType {
  company: Company;
  setCompany: (company: Company) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children, initialCompany }: { children: ReactNode,  initialCompany: Company; }) {
  const [company, setCompany] = useState<Company>(initialCompany);

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany debe usarse dentro de un CompanyProvider");
  }
  return context;
}
