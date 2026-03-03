"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/SafeImage"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { formatCurrency } from "@/lib/utils"
import { useCurrency } from "@/context/CurrencyContext"
import { useRouter } from "next/navigation"

interface ShoppingCartProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function ShoppingCartSidebar({
  isOpen,
  setIsOpen
}: ShoppingCartProps) {

  // Obtiene el carrito del contexto
  const router = useRouter()
  const { currency } = useCurrency();
  const { cart, getCartTotal, getCartItemsCount, updateQuantity, removeFromCart, clearCart } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-primary flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Tu Carrito
            </SheetTitle>
            <Badge variant="outline" className="bg-primary text-white border-secondary">
              {getCartItemsCount()} {getCartItemsCount() === 1 ? "producto" : "productos"}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-primary mb-2">Tu carrito está vacío</h3>
              <p className="text-stone-500 mb-6">Añade algunos de nuestros productos para continuar</p>
              <Button variant="outline" className="border-primary text-black" onClick={() => setIsOpen(false)}>
                Explorar productos
              </Button>
            </div>
          ) : (
            <div className="py-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border-b">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    {/* {item.product.images && item.product.images.length > 0 && (
                      <SafeImage
                        src={item.product.images[0].url}
                        alt={item.product.images[0].alt || item.product.name}
                        fill
                        className="object-cover"
                      />
                    )} */}
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-black truncate">{item.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-muted-foreground font-medium">{formatCurrency(item.price, currency!.code)}</span>
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none text-primary hover:bg-amber-50"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="w-8 text-center">{item.quantity}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none text-primary hover:bg-amber-50"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-stone-500">
                        {formatCurrency(item.price * item.quantity, currency!.code)} €
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center font-medium">
              <span className="text-stone-600">Subtotal</span>
              <span className="text-muted-foreground">{formatCurrency(getCartTotal(), currency!.code)}</span>
            </div>
            {/* <div className="flex justify-between items-center text-sm">
              <span className="text-stone-500">{t.cart.shipping}</span>
              <span className="text-stone-600">{t.cart.shippingValue}</span>
            </div> */}
            <div className="flex justify-between items-center font-bold">
              <span className="text-black">Total</span>
              <span className="text-xl text-primary">{formatCurrency(getCartTotal(), currency!.code)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Seguir comprando
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  router.push("/checkout")
                }}
              >
                Finalizar compra
              </Button>
            </div>
            <Button variant="ghost" className="w-full text-stone-500 hover:text-red-600 mt-2" onClick={clearCart}>
              <Trash2 className="h-4 w-4 mr-2" />
              Vaciar carrito
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
