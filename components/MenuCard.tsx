"use client"

import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Currency, Product } from "@/types/api-type"
import { TYPE_PRODUCT } from "@/constants/type-product"
import { formatCurrency } from "@/lib/utils"

interface MenuCardProps {
  item: Product;
  onAddToCart: (item: Product, quantity: number, notes?: string) => void;
  currency: Currency;
  authEnabled: boolean;
}

export function MenuCard({ item, onAddToCart, currency, authEnabled }: MenuCardProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = () => {
    toast({
      title: "Producto agregado al carrito",
      description: item.name,
      variant: "default",
    })
    onAddToCart(item, quantity, notes)
    setQuantity(1)
    setNotes("")
    setIsDialogOpen(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Evitar navegación si se hace click en botones
    if ((e.target as HTMLElement).closest("button")) {
      return
    }

    router.push(`/product/${item.id}`)
  }

  return (
    <Card className="group bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full" onClick={handleCardClick}>
        {/* Contenedor de la imagen (altura fija) */}
        <div className={`relative overflow-hidden h-48 ${item.image ? "" : "bg-[#eaeaea]"}`}>
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={300}
            height={200}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground shadow-lg">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {item.category?.name || "Categoría"}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Contenedor del contenido (flex-1 para ocupar el espacio restante) */}
        <div className="p-5 flex flex-col flex-1">
          {/* Título (altura fija y line-clamp) */}
          <h3 className="font-semibold text-xl mb-2 text-foreground leading-tight line-clamp-2 h-12">
            {item.name}
          </h3>

          {/* Descripción (altura fija y line-clamp) */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
            {item.description}
          </p>

          {/* Stock/Badge (altura fija) */}
          <div className="w-full flex items-center justify-between gap-2 mb-4 min-h-[2rem]">
            {item.typeProduct?.id === TYPE_PRODUCT.SERVICE.id ? (
              <Badge variant="secondary" className="bg-green-500 text-white border-green-600">
                Servicio
              </Badge>
            ) : item.stock > 0 ? (
              <Badge variant="secondary" className="bg-green-500 text-white border-green-600">
                {item.stock} en stock
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-500 border-red-200 text-white">
                No disponible
              </Badge>
            )}

            {
              !authEnabled && (
                <div className="text-blue-600 font-bold text-base">
                  {formatCurrency(item.price, currency.code)}
                  {item.measurement?.name && <small className="text-xs"> x {item.measurement.name}</small>}
                </div>
              )
            }
          </div>

          {/* Precio y botón (altura fija) */}
          {authEnabled && (
            <div className="flex items-center justify-between gap-2 mt-auto">
              <div className="text-blue-600 font-bold text-base">
                {formatCurrency(item.price, currency.code)}
                {item.measurement?.name && <small className="text-xs"> x {item.measurement.name}</small>}
              </div>
              <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4"
                    >
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card text-card-foreground border-border max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl">{item.name}</DialogTitle>
                      <DialogDescription>
                        {item.description}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <Label className="text-foreground font-medium">Cantidad</Label>
                        <div className="flex items-center space-x-3 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="h-10 w-10 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setQuantity(quantity + 1)}
                            className="h-10 w-10 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notes" className="text-foreground font-medium">
                          Notas especiales (opcional)
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Ej: Sin cebolla, término medio, etc."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="mt-3 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <span className="text-xl font-bold text-foreground">
                          Total: <span className="text-primary">{formatCurrency(item.price * quantity, currency.code)}</span>
                        </span>
                        <Button
                          onClick={handleAddToCart}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                        >
                          Agregar al carrito
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

  )
}
