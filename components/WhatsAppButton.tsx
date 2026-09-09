"use client"

import { Button } from "@/components/ui/button"
import { useWhatsApp } from "@/context/WhatsAppContext"
import { useContact } from "@/lib/contact"
import { Company, Whatsapp } from "@/types/api-type"
import { FaWhatsapp } from "react-icons/fa"

interface WhatsAppButtonProps {
  company: Company;
}

export default function WhatsAppButton({ company }: WhatsAppButtonProps) {
  const { handleWhatsapp, getDefaultMessage } = useContact();
  const { whatsapp } = useWhatsApp();

  const handleWhatsAppClick = () => {
    // const message = getDefaultMessage(restaurantData.restaurant.name);
    const message = getDefaultMessage(company.name);
    // handleWhatsapp(restaurantData.restaurant.whatsapp, message);
    handleWhatsapp(whatsapp.number, message);
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-32 right-[8%] z-50 rounded-full h-14 w-14 shadow-lg bg-[#25D366] hover:bg-[#128C7E] p-0 flex items-center justify-center"
    >
      <FaWhatsapp className="h-6 w-6" />
      <span className="sr-only">Contactar por WhatsApp</span>
    </Button>
  )
}
