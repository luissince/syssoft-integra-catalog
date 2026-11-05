"use client";

import { Whatsapp } from "@/types/api-type";
import { createContext, useContext, ReactNode, useState } from "react";

interface WhatsAppContextType {
  whatsapp: Whatsapp;
  setWhatsapp: (whatsapp: Whatsapp) => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export function WhatsAppProvider({ children, initialWhatsapp }: { children: ReactNode,  initialWhatsapp: Whatsapp; }) {
  const [whatsapp, setWhatsapp] = useState<Whatsapp>(initialWhatsapp);

  return (
    <WhatsAppContext.Provider value={{ whatsapp, setWhatsapp }}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp debe usarse dentro de un WhatsAppProvider");
  }
  return context;
}
