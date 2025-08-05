"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, MapPin, Clock, ShoppingCart, Settings } from "lucide-react"
import { MenuCard } from "@/components/MenuCard"
import { Cart } from "@/components/Cart"
import { CheckoutForm } from "@/components/CheckoutForm"
import { AdminPanel } from "@/components/AdminPanel"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useCart } from "@/hooks/useCart"
import type { RestaurantData, Order, MenuItem } from "@/types"
import restaurantData from "@/data/restaurant-data.json"

type ViewMode = "menu" | "checkout" | "admin"

export default function Component() {
  const [data, setData] = useState<RestaurantData>(restaurantData as RestaurantData)
  const [currentView, setCurrentView] = useState<ViewMode>("menu")
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedCategory, setSelectedCategory] = useState("promos")

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount } = useCart()

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  const handleSubmitOrder = (orderData: Order) => {
    setOrders((prev) => [orderData, ...prev])
    clearCart()
    alert("¡Pedido enviado exitosamente! Te contactaremos pronto.")
    setCurrentView("menu")
  }

  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  const handleAddMenuItem = (newItem: Omit<MenuItem, "id">) => {
    const item: MenuItem = {
      ...newItem,
      id: Date.now().toString(),
    }
    setData((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, item],
    }))
  }

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    }))
  }

  const handleToggleItemAvailability = (itemId: string) => {
    setData((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item)),
    }))
  }

  // Filter items: only show available items for customers, all items for admin
  const filteredItems = data.menuItems.filter(
    (item) => item.category === selectedCategory && (currentView === "admin" || item.available),
  )
  const cartItemsCount = getCartItemsCount()

  if (currentView === "admin") {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border p-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <Button onClick={() => setCurrentView("menu")} variant="outline">
              ← Volver al Menú
            </Button>
            <ThemeToggle />
          </div>
        </div>
        <AdminPanel
          orders={orders}
          menuItems={data.menuItems}
          categories={data.categories}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAddMenuItem={handleAddMenuItem}
          onUpdateMenuItem={handleUpdateMenuItem}
          onToggleItemAvailability={handleToggleItemAvailability}
        />
      </div>
    )
  }

  if (currentView === "checkout") {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border p-4 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <Button onClick={() => setCurrentView("menu")} variant="outline">
              ← Volver al Menú
            </Button>
            <h1 className="text-2xl font-bold font-display text-primary">Finalizar Pedido</h1>
            <ThemeToggle />
          </div>
        </div>
        <div className="container mx-auto p-4">
          <CheckoutForm
            cart={cart}
            paymentMethods={data.paymentMethods}
            deliveryZones={data.deliveryZones}
            onSubmitOrder={handleSubmitOrder}
            onBack={() => setCurrentView("menu")}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold font-display">
                <span className="text-primary">Delicious</span> <span className="text-foreground">Pollos</span>
                <div className="text-sm text-primary/80">& Parrillas</div>
              </div>
              <nav className="hidden md:flex space-x-2">
                {data.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{data.restaurant.hours}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{data.restaurant.address.split(",")[0]}</span>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar
                </Button>
              </div>
              <ThemeToggle />
              <Button onClick={() => setCurrentView("admin")} variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-muted w-full">
                {data.categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex-1 text-xs">
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-8 md:py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display">
                <span className="text-primary">Delicious</span>
                <br />
                <span className="text-foreground">Pollos</span>
                <br />
                <span className="text-primary/80">& Parrillas</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Los mejores pollos a la brasa y parrillas de la ciudad
              </p>
              <div className="flex gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 font-medium">
                  Ver menú completo
                </Button>
                {cartItemsCount > 0 && (
                  <Button
                    onClick={() => setCurrentView("checkout")}
                    variant="outline"
                    className="px-6 py-3 font-medium"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Carrito ({cartItemsCount})
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Image
                  src="/placeholder.svg?height=200&width=200&text=Pollo+a+la+brasa"
                  alt="Pollo a la brasa"
                  width={200}
                  height={200}
                  className="rounded-xl object-cover shadow-lg"
                />
                <Image
                  src="/placeholder.svg?height=200&width=200&text=Parrilla+mixta"
                  alt="Parrilla mixta"
                  width={200}
                  height={200}
                  className="rounded-xl object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Fixed Layout */}
      <div className="flex-1 flex">
        <div className="container mx-auto px-4 py-8 flex gap-8 h-full">
          {/* Menu Items - Scrollable */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground font-display">
                {data.categories.find((cat) => cat.id === selectedCategory)?.name}
              </h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {filteredItems.length} platos disponibles
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
              {filteredItems.map((item) => (
                <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
              ))}
            </div>
          </div>

          {/* Fixed Cart Sidebar */}
          <div className="w-80 hidden lg:block">
            <div className="sticky top-24">
              <Cart
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={() => setCurrentView("checkout")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-card border-t border-border py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Restaurant Info */}
            <div className="md:col-span-2">
              <div className="text-2xl font-bold font-display mb-4">
                <span className="text-primary">Delicious</span>{" "}
                <span className="text-foreground">Pollos & Parrillas</span>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Los mejores pollos a la brasa y parrillas de la ciudad. Sabor auténtico, ingredientes frescos y el mejor
                servicio de delivery.
              </p>
              <div className="flex items-center space-x-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Phone className="w-4 h-4 mr-2" />
                  {data.restaurant.phone}
                </Button>
                <Button variant="outline">WhatsApp: {data.restaurant.whatsapp}</Button>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-display">Contacto</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{data.restaurant.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{data.restaurant.hours}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{data.restaurant.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-display">Menú</h3>
              <div className="space-y-2 text-sm">
                {data.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-foreground mb-2">Métodos de Pago</h4>
                <div className="flex space-x-2">
                  {data.paymentMethods
                    .filter((method) => method.available)
                    .map((method) => (
                      <span key={method.id} className="text-lg" title={method.name}>
                        {method.icon}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 Delicious Pollos & Parrillas. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">Powered by</div>
              <div className="text-lg font-bold text-foreground">seren</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Cart Button (Mobile) */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-4 right-4 lg:hidden z-50">
          <Button
            onClick={() => setCurrentView("checkout")}
            className="bg-primary hover:bg-primary/90 rounded-full w-16 h-16 shadow-lg"
          >
            <div className="text-center">
              <ShoppingCart className="w-6 h-6 mx-auto" />
              <span className="text-xs font-bold">{cartItemsCount}</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
