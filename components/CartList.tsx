"use client"

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Cart } from "@/types/api-type"
import { TYPE_PRODUCT } from "@/constants/type-product"
import { useCurrency } from "@/context/CurrencyContext"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/context/CartContext"

export function CartList() {

  const router = useRouter();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { currency } = useCurrency();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">Tu carrito está vacío</p>
          <p className="text-sm text-muted-foreground mt-2">Agrega algunos platos deliciosos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
            <p className="text-lg">Mi Pedido ({cart.length} items)</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {cart.map((item) => (
            <div
              key={item.idProduct}
              className="flex flex-col space-y-3 p-3 bg-muted/50 rounded-lg border border-border/50"
            >
              <div className="flex items-center gap-3 min-w-0">

                {/* Imagen */}
                <div className="w-20 h-20 shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-full h-full rounded-lg object-contain"
                  />
                </div>

                {/* Información */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground">
                    {item.name}
                  </h4>

                  <p className="text-base text-primary font-semibold">
                    {formatCurrency(item.price, currency!.code)}
                  </p>

                  {item.notes && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      Nota: {item.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {item.typeProduct?.id === TYPE_PRODUCT.SERVICE.id ? (
                    <span className="w-8 text-center text-foreground font-medium">
                      {item.quantity}
                    </span>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item.idProduct, item.quantity - 1)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>

                      <span className="w-8 text-center text-foreground font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item.idProduct, item.quantity + 1)
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFromCart(item.idProduct)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground">Total:</span>
            <p className="text-secondary-foreground text-lg font-semibold">
              {formatCurrency(total, currency!.code)}
            </p>
          </div>
          <Button
            onClick={() => {
              router.push("/checkout")
            }}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-3"
          >
            Proceder al Checkout
          </Button>
        </div>
      </CardContent>
    </Card>

  )
}
