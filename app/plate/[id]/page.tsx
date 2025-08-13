"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Star, Clock, Plus, Minus, ShoppingCart, Users, Flame } from "lucide-react"
import type { MenuItem, RestaurantData } from "@/types"
import restaurantData from "@/data/restaurant-data.json"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import Welcome from "@/components/Welcome"
import { NavSecondary } from "@/components/Nav"

const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true" ? true : false;

export default function PlateDetalle() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast()
  const [data] = useState<RestaurantData>(restaurantData as RestaurantData)
  const [item, setItem] = useState<MenuItem>({} as MenuItem);
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true);

  if (!params.id) {
    router.push("/");
    return;
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const item = data.menuItems.find((item) => item.id === params.id) as MenuItem
        setItem(item);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddToCart = () => {
    toast({
      title: "Producto agregado al carrito",
      description: item.name,
      variant: "default",
    })
    addToCart(item, quantity, notes)
    router.push("/")
  }

  // Platos relacionados
  const relatedPlatos = data.menuItems
    .filter((item) => item.category === item.category && item.id !== item.id)
    .slice(0, 3);

  if (isLoading) {
    return <Welcome />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NavSecondary title="Plato" />

      {/* Body */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Imágenes del plato */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={item.images[selectedImage].url || "/placeholder.svg"}
                alt={item.name}
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {item.rating}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-border"
                    }`}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`${item.name} vista ${index + 1}`}
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
              <h1 className="text-4xl font-bold font-display text-foreground mb-2">{item.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="text-3xl font-bold text-primary font-display">S/. {item.price.toFixed(2)}</div>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
                <Badge variant="secondary" className="w-fit md:w-auto bg-muted text-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.preparationTime} min
                </Badge>
                <Badge variant="secondary" className="w-fit md:w-auto bg-muted text-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  1-2 personas
                </Badge>
                <Badge variant="secondary" className="w-fit md:w-auto bg-muted text-foreground">
                  <Flame className="w-4 h-4 mr-1" />
                  Picante medio
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Ingredientes */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3 font-display">Ingredientes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.ingredients.map((ingredient, index) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {item.nutritionalInfo.map((info, index) => (
                  <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">{info.value}g</div>
                    <div className="text-xs text-muted-foreground">{info.name}</div>
                  </div>
                ))}
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
            <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-start">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-bold text-primary font-display">
                  S/. {(item.price * quantity).toFixed(2)}
                </div>
              </div>
              {
                authEnabled && (
                  <Button onClick={handleAddToCart} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar al carrito
                  </Button>
                )
              }
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
                        src={item.images[0].url || "/placeholder.svg"}
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
