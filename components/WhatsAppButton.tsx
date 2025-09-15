"use client"

import { Button } from "@/components/ui/button"
import { Whatsapp } from "@/types/api-type"
import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa"

interface WhatsAppButtonProps {
  whatsapp: Whatsapp,
}

export default function WhatsAppButton({whatsapp}:WhatsAppButtonProps) {
  // Número de WhatsApp (reemplazar con el número real)
  const whatsappNumber = whatsapp.number

  // Mensaje predeterminado (opcional)
  const message = whatsapp.message

  // URL de WhatsApp con el número y mensaje
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <Button
      asChild
      className="fixed bottom-32 right-[8%] z-50 rounded-full h-14 w-14 shadow-lg bg-[#25D366] hover:bg-[#128C7E] p-0 flex items-center justify-center"
    >
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <FaWhatsapp className="h-6 w-6" />
        <span className="sr-only">Contactar por WhatsApp</span>
      </Link>
    </Button>
  )
}
