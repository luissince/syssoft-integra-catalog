"use client"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"

interface CartButtonProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}
export default function CartButton({ isOpen, setIsOpen }: CartButtonProps) {
  // Obtiene el carrito del contexto
  const { cart } = useCart()

  // Calcula la cantidad total de productos en el carrito
  const itemCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <Button
      asChild
      className="fixed bottom-6 right-[8%] z-50 rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 p-0 flex items-center justify-center cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div>
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-primary">
            {itemCount}
          </span>
        )}
      </div>
    </Button>
  )
}
