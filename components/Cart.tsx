"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import type { CartItem } from "@/types"
import Image from "next/image"

interface CartProps {
  cart: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
}

export function Cart({ cart, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
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
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center font-display">
          <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
          Mi Pedido ({cart.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border border-border/50"
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                <p className="text-sm text-primary font-semibold">S/. {item.price.toFixed(2)}</p>
                {item.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Nota: {item.notes}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center text-foreground font-medium">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <Button size="sm" variant="destructive" onClick={() => onRemoveItem(item.id)} className="h-8 w-8 p-0">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground font-display">Total:</span>
            <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2 font-display font-semibold">
              S/. {total.toFixed(2)}
            </Badge>
          </div>
          <Button
            onClick={onCheckout}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
          >
            Proceder al Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
