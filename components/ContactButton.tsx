"use client"

import { Button } from "@/components/ui/button"
import { MessageSquareMore } from "lucide-react"
import { useRouter } from "next/navigation";
import React from "react";

export default function ContactButton() {
  const router = useRouter();

  return (
    <Button
      asChild
      className="fixed bottom-12 right-[8%] z-50 rounded-full h-14 w-14 shadow-lg bg-gray-400 hover:bg-gray-500 p-0 hidden md:flex items-center justify-center cursor-pointer"
      onClick={() => router.push("/contact")}
    >
      <div>
        <MessageSquareMore className="h-6 w-6" />
        <span className="sr-only">Contáctanos</span>
      </div>
    </Button>
  )
}
