"use client"

import type React from "react"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Plus, Minus, Clock, Eye } from "lucide-react"
import type { MenuItem } from "@/types"
import { useState } from "react"

interface MenuCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, quantity: number, notes?: string) => void
  isAdmin?: boolean
  onEdit?: (item: MenuItem) => void
  onToggleAvailability?: (itemId: string) => void
}

export function MenuCard({ item, onAddToCart, isAdmin, onEdit, onToggleAvailability }: MenuCardProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddToCart = () => {
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
    if (!isAdmin) {
      router.push(`/plato/${item.id}`)
    }
  }

  return (
    <Card className="group bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer">
      <CardContent className="p-0" onClick={handleCardClick}>
        <div className="relative overflow-hidden">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground shadow-lg">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {item.rating}
            </Badge>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              {item.preparationTime} min
            </Badge>
          </div>
          {!isAdmin && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button variant="secondary" size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                <Eye className="w-4 h-4 mr-2" />
                Ver detalles
              </Button>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-5">
          <h3 className="font-display font-semibold text-xl mb-2 text-foreground leading-tight">{item.name}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold text-xl font-display">S/. {item.price.toFixed(2)}</span>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {isAdmin ? (
                <>
                  <Button size="sm" variant="outline" onClick={() => onEdit?.(item)} className="text-xs">
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant={item.available ? "destructive" : "default"}
                    onClick={() => onToggleAvailability?.(item.id)}
                    className="text-xs"
                  >
                    {item.available ? "Ocultar" : "Mostrar"}
                  </Button>
                </>
              ) : (
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
                      <DialogTitle className="font-display text-xl">{item.name}</DialogTitle>
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
                        <span className="text-xl font-bold font-display text-foreground">
                          Total: <span className="text-primary">S/. {(item.price * quantity).toFixed(2)}</span>
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
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
