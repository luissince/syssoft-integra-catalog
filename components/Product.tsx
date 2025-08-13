"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  Maximize2,
  ChevronRight as ChevronRightBreadcrumb,
  ArrowRight
} from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
// import { useWishlist } from "@/context/wishlist-context"
import Welcome from "@/components/Welcome"
import { NavSecondary } from "@/components/Nav"
import { Branch, Company, Product } from "@/types/api-type"
import { cn } from "@/lib/utils"
import { MenuCard } from "./MenuCard"

interface ProductImage {
  id: string
  name: string
  url: string
  width: number
  height: number
}

interface PropsProductComponent {
  company: Company
  branch: Branch
  product: Product
  relatedProducts: Product[]
  authEnabled?: boolean
}

interface PropsProductImageGallery {
  images: ProductImage[]
  productName: string
  outOfStock?: boolean
}

// Componente de galería de imágenes integrado
function ProductImageGallery({
  images,
  productName,
  outOfStock = false
}: PropsProductImageGallery) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const safeImages = images.length > 0 ? images : [{
    id: "1",
    name: "Vista principal",
    url: "/placeholder.svg",
    width: 600,
    height: 400
  }]

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setZoomLevel(1)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1))
  }

  return (
    <>
      {/* Imagen principal */}
      <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg mb-4 group">
        <Image
          src={safeImages[currentImageIndex].url || "/placeholder.svg"}
          alt={productName}
          fill
          className={cn("object-cover", outOfStock ? "opacity-70" : "")}
          priority
        />

        {/* Overlay para pantalla completa */}
        <button
          onClick={handleOpenModal}
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors"
          aria-label="Ver imagen en pantalla completa"
        >
          <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <Maximize2 className="h-4 w-4" />
            Ver en pantalla completa
          </span>
        </button>

        {/* Botones de navegación */}
        {safeImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Badges */}
        {/* <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Badge className="bg-primary text-primary-foreground">
            <Star className="w-4 h-4 mr-1 fill-current" />
            4.8
          </Badge>
        </div> */}
      </div>

      {/* Miniaturas */}
      {safeImages.length > 1 && (
        <div className="flex space-x-2">
          {safeImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                currentImageIndex === index ? "border-primary" : "border-border hover:border-gray-400"
              )}
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={currentImageIndex === index}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={`${productName} - vista ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal de pantalla completa */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex flex-col">
            {/* Controles superiores */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-black/50">
              <div className="text-white font-medium truncate max-w-[50%]">{productName}</div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-black/50 border-gray-600 hover:bg-black/70"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  aria-label="Acercar"
                >
                  <ZoomIn className="h-5 w-5 text-white" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-black/50 border-gray-600 hover:bg-black/70"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  aria-label="Alejar"
                >
                  <ZoomOut className="h-5 w-5 text-white" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-black/50 border-gray-600 hover:bg-black/70"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>

            {/* Contenedor de imagen principal */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <div className="transition-transform duration-100 ease-out" style={{ transform: `scale(${zoomLevel})` }}>
                <Image
                  src={safeImages[currentImageIndex].url || "/placeholder.svg"}
                  alt={`${productName} - imagen ${currentImageIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-h-[80vh] w-auto object-contain"
                  priority
                />
              </div>

              {/* Botones de navegación en modal */}
              {safeImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-12 w-12 rounded-full"
                    onClick={handlePrevious}
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-12 w-12 rounded-full"
                    onClick={handleNext}
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            {/* Miniaturas en modal */}
            {safeImages.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-black/50 overflow-x-auto">
                <div className="flex gap-2 justify-center">
                  {safeImages.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "relative h-16 w-16 rounded-md overflow-hidden border-2 transition-all",
                        currentImageIndex === index ? "border-primary" : "border-transparent hover:border-gray-400"
                      )}
                      onClick={() => handleThumbnailClick(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                      aria-current={currentImageIndex === index}
                    >
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function ProductComponent({ company, branch, product, relatedProducts, authEnabled }: PropsProductComponent) {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  //   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  //   const [isWishlisted, setIsWishlisted] = useState(isInWishlist?.(product.id) || false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!params.id) {
    router.push("/")
    return null
  }

  // Preparar imágenes para la galería
  const images: ProductImage[] = product.images?.map((img, index) => ({
    id: `${index + 1}`,
    name: `Vista ${index + 1}`,
    url: img.url || "/placeholder.svg",
    width: 600,
    height: 400
  })) || [{
    id: "1",
    name: "Vista principal",
    url: product.image || "/placeholder.svg",
    width: 600,
    height: 400
  }]

  // Determinar el estado de stock
  const isOutOfStock = !product.isService && product.stock === 0
  const isLowStock = !product.isService && product.stock > 0 && product.stock <= 5

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && (product.isService || newQuantity <= product.stock)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    // if (addToCart) {
    //   addToCart(product, quantity, notes)
    //   toast({
    //     title: "Plato agregado al carrito",
    //     description: `${quantity} x ${product.name} añadido a tu carrito${notes ? ` con notas: ${notes}` : ''}`,
    //   })
    // }
  }

  const handleBuyNow = () => {
    // if (addToCart) {
    //   addToCart(product, quantity, notes)
    //   router.push("/checkout")
    // }
  }

  const handleWishlistToggle = () => {
    // if (!addToWishlist || !removeFromWishlist) return

    // if (isWishlisted) {
    //   removeFromWishlist(product.id)
    //   setIsWishlisted(false)
    //   toast({
    //     title: "Eliminado de favoritos",
    //     description: `${product.name} ha sido eliminado de tus favoritos`,
    //   })
    // } else {
    //   addToWishlist(product)
    //   setIsWishlisted(true)
    //   toast({
    //     title: "Añadido a favoritos",
    //     description: `${product.name} ha sido añadido a tus favoritos`,
    //   })
    // }
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const text = `¡Mira este delicioso plato: ${product.name}!`

    switch (platform) {
      case "clipboard":
        try {
          await navigator.clipboard.writeText(url)
          toast({
            title: "Enlace copiado",
            description: "El enlace ha sido copiado al portapapeles",
          })
        } catch (err) {
          toast({
            title: "Error al copiar",
            description: "No se pudo copiar el enlace",
            variant: "destructive",
          })
        }
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank")
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank")
        break
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`, "_blank")
        break
    }
  }

  if (!isMounted) {
    return <Welcome company={company} branch={branch} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NavSecondary title="Detalle de producto" />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        {/* <div className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => router.push("/")} 
              className="inline-flex items-center text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al menú
            </button>
          </div>
        </div> */}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div>
            <ProductImageGallery
              images={images}
              productName={product.name}
              outOfStock={isOutOfStock}
            />
          </div>

          {/* Información del plato */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="text-muted-foreground">Producto</span>
                <ChevronRightBreadcrumb className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{product.category?.name}</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-base leading-relaxed">{product.description}</p>
            </div>

            {/* Precio */}
            <div className="flex items-center gap-3 py-2">
              <span className="text-blue-600 font-bold text-xl">
                S/. {product.price.toFixed(2)} x {product.measurement?.name}
              </span>
            </div>

            {/* Badges informativos */}
            {/* <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-muted text-foreground">
                <Clock className="w-4 h-4 mr-1" />
                15-20 min
              </Badge>
              <Badge variant="secondary" className="bg-muted text-foreground">
                <Users className="w-4 h-4 mr-1" />
                1-2 personas
              </Badge>
              <Badge variant="secondary" className="bg-muted text-foreground">
                <Flame className="w-4 h-4 mr-1" />
                Picante medio
              </Badge>
            </div> */}

            {/* Estado de disponibilidad */}
            <div className="py-4 border-t border-b space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32">Categoría:</span>
                <span>{product.category?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-32">Disponibilidad:</span>
                {product.isService ? (
                  <span className="text-blue-600 font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Siempre disponible
                  </span>
                ) : isOutOfStock ? (
                  <span className="text-destructive font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    No disponible
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-600 font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    ¡Últimas {product.stock} porciones!
                  </span>
                ) : (
                  <span className="text-green-600 font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Disponible
                  </span>
                )}
              </div>
            </div>

            {/* Selector de cantidad y notas */}
            <div className="space-y-6 pt-2">
              {/* Cantidad */}
              <div className="flex flex-col gap-3">
                {/* <div className="flex items-center justify-between">
                  <span className="font-medium">Cantidad:</span>
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(1)}
                      disabled={!product.isService && quantity >= product.stock}
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div> */}

                {/* Notas especiales */}
                {/* <div>
                  <Label htmlFor="notes" className="font-medium mb-2 block">
                    Notas especiales (opcional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Ej: Sin cebolla, término medio, extra salsa..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-muted border-border"
                    rows={3}
                  />
                </div> */}

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {/* <Button 
                    size="lg" 
                    className="w-full" 
                    disabled={isOutOfStock} 
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Añadir al carrito
                  </Button>
                  {authEnabled && (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full" 
                      disabled={isOutOfStock} 
                      onClick={handleBuyNow}
                    >
                      Pedir ahora
                    </Button>
                  )} */}

                  <div className="flex gap-2 mt-2 sm:mt-0">
                    {/* <Button
                      variant={isWishlisted ? "default" : "outline"}
                      size="icon"
                      className={`flex-shrink-0 ${isWishlisted ? "bg-red-500 hover:bg-red-600" : ""}`}
                      onClick={handleWishlistToggle}
                      aria-label={isWishlisted ? "Eliminar de favoritos" : "Añadir a favoritos"}
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? "fill-white text-white" : ""}`} />
                    </Button> */}

                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="flex-shrink-0">
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShare("clipboard")}>
                          Copiar enlace
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                          Compartir en WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("facebook")}>
                          Compartir en Facebook
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("twitter")}>
                          Compartir en Twitter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("email")}>
                          Compartir por email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                </div>
              </div>

              {/* Total */}
              {/* <div className="flex flex-col md:flex-row md:justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-start">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold text-primary font-display">
                    S/. {(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Tabs de información adicional */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="details">Detalles</TabsTrigger>
              {/* <TabsTrigger value="nutrition">Información Nutricional</TabsTrigger> */}
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="max-w-none">
                <p className="text-base leading-relaxed">
                  {product.descriptionLong || product.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="max-w-none">
                {product.details ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.details.map((detail, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-base">
                          <span className="font-semibold">{detail.name}:</span> {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Información de ingredientes no disponible.</p>
                )}
              </div>
            </TabsContent>

            {/* <TabsContent value="nutrition" className="mt-6">
              <div className="max-w-none">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">350</div>
                    <div className="text-xs text-muted-foreground">Calorías</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">25g</div>
                    <div className="text-xs text-muted-foreground">Proteínas</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">15g</div>
                    <div className="text-xs text-muted-foreground">Grasas</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">30g</div>
                    <div className="text-xs text-muted-foreground">Carbohidratos</div>
                  </div>
                </div>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>

        {/* Platos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold font-display">También te puede gustar</h2>
              <button
                onClick={() => router.push("/")}
                className="flex items-center text-primary text-sm font-medium hover:underline"
              >
                Ver más
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((item, index) => (
                <MenuCard
                  key={index}
                  item={item}
                />
                // <Card
                //   key={item.id}
                //   className="group bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                //   onClick={() => router.push(`/plato/${item.id}`)}
                // >
                //   <CardContent className="p-0">
                //     <div className="relative overflow-hidden">
                //       <Image
                //         src={item.image || "/placeholder.svg"}
                //         alt={item.name}
                //         width={300}
                //         height={200}
                //         className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                //       />
                //       <div className="absolute top-3 right-3">
                //         <Badge className="bg-primary text-primary-foreground">
                //           <Star className="w-3 h-3 mr-1 fill-current" />
                //           4.8
                //         </Badge>
                //       </div>
                //     </div>
                //     <div className="p-4">
                //       <h3 className="font-semibold text-lg text-foreground mb-2 font-display">{item.name}</h3>
                //       <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                //       <div className="text-primary font-bold text-xl font-display">S/. {item.price.toFixed(2)}</div>
                //     </div>
                //   </CardContent>
                // </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}