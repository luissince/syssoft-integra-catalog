"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Star, Clock, Plus, Minus, ShoppingCart, Users, Flame } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useCart } from "@/hooks/useCart"
import type { MenuItem, RestaurantData } from "@/types"
import restaurantData from "@/data/restaurant-data.json"

export default function PlatoDetalle() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [data] = useState<RestaurantData>(restaurantData as RestaurantData)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)

  const plato = data.menuItems.find((item) => item.id === params.id) as MenuItem

  if (!plato) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Plato no encontrado</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            Volver al menú
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(plato, quantity, notes)
    router.push("/")
  }

  // Simular múltiples imágenes del plato
  const platoImages = [
    plato.image,
    plato.image?.replace("text=", "text=Vista+2+"),
    plato.image?.replace("text=", "text=Vista+3+"),
  ]

  // Información nutricional simulada
  const nutritionalInfo = {
    calories: Math.floor(Math.random() * 300) + 400,
    protein: Math.floor(Math.random() * 20) + 25,
    carbs: Math.floor(Math.random() * 30) + 20,
    fat: Math.floor(Math.random() * 15) + 10,
  }

  // Ingredientes simulados
  const ingredients = [
    "Pollo fresco de granja",
    "Papas amarillas peruanas",
    "Ensalada fresca",
    "Ají amarillo",
    "Especias secretas",
    "Aceite de oliva",
  ]

  // Platos relacionados
  const relatedPlatos = data.menuItems
    .filter((item) => item.category === plato.category && item.id !== plato.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button onClick={() => router.push("/")} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al menú
            </Button>
            <div className="text-xl font-bold font-display">
              <span className="text-primary">Delicious</span> <span className="text-foreground">Pollos</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Imágenes del plato */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={platoImages[selectedImage] || "/placeholder.svg"}
                alt={plato.name}
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {plato.rating}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              {platoImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-border"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${plato.name} vista ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del plato */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold font-display text-foreground mb-2">{plato.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{plato.description}</p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-3xl font-bold text-primary font-display">S/. {plato.price.toFixed(2)}</div>
              <Badge variant="secondary" className="bg-muted text-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {plato.preparationTime} min
              </Badge>
              <Badge variant="secondary" className="bg-muted text-foreground">
                <Users className="w-4 h-4 mr-1" />
                1-2 personas
              </Badge>
              <Badge variant="secondary" className="bg-muted text-foreground">
                <Flame className="w-4 h-4 mr-1" />
                Picante medio
              </Badge>
            </div>

            <Separator />

            {/* Ingredientes */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3 font-display">Ingredientes</h3>
              <div className="grid grid-cols-2 gap-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-muted-foreground text-sm">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Información nutricional */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3 font-display">Información Nutricional</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{nutritionalInfo.calories}</div>
                  <div className="text-xs text-muted-foreground">Calorías</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{nutritionalInfo.protein}g</div>
                  <div className="text-xs text-muted-foreground">Proteína</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{nutritionalInfo.carbs}g</div>
                  <div className="text-xs text-muted-foreground">Carbohidratos</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{nutritionalInfo.fat}g</div>
                  <div className="text-xs text-muted-foreground">Grasas</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Selector de cantidad y notas */}
            <div className="space-y-4">
              <div>
                <Label className="text-foreground font-medium">Cantidad</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg text-foreground">{quantity}</span>
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
                  placeholder="Ej: Sin cebolla, término medio, extra salsa..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  rows={3}
                />
              </div>
            </div>

            {/* Botón de agregar al carrito */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
              <div>
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-bold text-primary font-display">
                  S/. {(plato.price * quantity).toFixed(2)}
                </div>
              </div>
              <Button onClick={handleAddToCart} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Agregar al carrito
              </Button>
            </div>
          </div>
        </div>

        {/* Platos relacionados */}
        {relatedPlatos.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 font-display">También te puede gustar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPlatos.map((item) => (
                <Card
                  key={item.id}
                  className="group bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/plato/${item.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {item.rating}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-foreground mb-2 font-display">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="text-primary font-bold text-xl font-display">S/. {item.price.toFixed(2)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
