"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Phone, MapPin, Package, Users, TrendingUp } from "lucide-react"
import type { Order, MenuItem, Category } from "@/types"

interface AdminPanelProps {
  orders: Order[]
  menuItems: MenuItem[]
  categories: Category[]
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void
  onAddMenuItem: (item: Omit<MenuItem, "id">) => void
  onUpdateMenuItem: (item: MenuItem) => void
  onToggleItemAvailability: (itemId: string) => void
}

export function AdminPanel({
  orders,
  menuItems,
  categories,
  onUpdateOrderStatus,
  onAddMenuItem,
  onUpdateMenuItem,
  onToggleItemAvailability,
}: AdminPanelProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    rating: 4.5,
    available: true,
    preparationTime: 20,
  })

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "preparing":
        return "bg-blue-500 hover:bg-blue-600"
      case "ready":
        return "bg-green-500 hover:bg-green-600"
      case "delivered":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "preparing":
        return "Preparando"
      case "ready":
        return "Listo"
      case "delivered":
        return "Entregado"
      default:
        return status
    }
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.category) {
      onAddMenuItem(newItem)
      setNewItem({
        name: "",
        description: "",
        price: 0,
        image: "",
        category: "",
        rating: 4.5,
        available: true,
        preparationTime: 20,
      })
    }
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.payment.total, 0)
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const completedOrders = orders.filter((order) => order.status === "delivered").length

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display text-primary mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona pedidos y menú desde aquí</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pedidos</p>
                  <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-500">{pendingOrders}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completados</p>
                  <p className="text-2xl font-bold text-green-500">{completedOrders}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                  <p className="text-2xl font-bold text-primary">S/. {totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="orders" className="data-[state=active]:bg-card">
              Pedidos ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-card">
              Menú ({menuItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-foreground font-display">Pedido #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Cliente:</h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-foreground font-medium">{order.customer.name}</p>
                          <p className="text-muted-foreground flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {order.customer.phone}
                          </p>
                          <p className="text-muted-foreground flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {order.customer.address}
                          </p>
                          {order.customer.reference && (
                            <p className="text-muted-foreground">Ref: {order.customer.reference}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Entrega:</h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {order.delivery.time}
                          </p>
                          <p className="text-muted-foreground">Pago: {order.payment.method}</p>
                          <p className="text-primary font-bold text-lg font-display">
                            Total: S/. {order.payment.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-foreground">Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border border-border/50"
                          >
                            <div>
                              <span className="font-medium text-foreground">{item.name}</span>
                              <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                              {item.notes && <p className="text-xs text-primary mt-1">Nota: {item.notes}</p>}
                            </div>
                            <span className="text-primary font-semibold">
                              S/. {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-foreground">Notas:</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateOrderStatus(order.id, "preparing")}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Marcar como Preparando
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateOrderStatus(order.id, "ready")}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Marcar como Listo
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateOrderStatus(order.id, "delivered")}
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Marcar como Entregado
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl text-foreground">Agregar Nuevo Plato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground font-medium">Nombre</Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">Precio</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })}
                      className="bg-muted border-border text-foreground mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">Categoría</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger className="bg-muted border-border text-foreground mt-2">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-foreground">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">Tiempo de preparación (min)</Label>
                    <Input
                      type="number"
                      value={newItem.preparationTime}
                      onChange={(e) => setNewItem({ ...newItem, preparationTime: Number.parseInt(e.target.value) })}
                      className="bg-muted border-border text-foreground mt-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-foreground font-medium">Descripción</Label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-foreground font-medium">URL de imagen</Label>
                    <Input
                      value={newItem.image}
                      onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                      placeholder="/placeholder.svg?height=200&width=300&text=Nombre+del+plato"
                    />
                  </div>
                </div>
                <Button onClick={handleAddItem} className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Agregar Plato
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {menuItems.map((item) => (
                <Card key={item.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-foreground font-display">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-primary font-bold text-lg font-display">S/. {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={item.available ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                        >
                          {item.available ? "Disponible" : "No disponible"}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={item.available ? "destructive" : "default"}
                          onClick={() => onToggleItemAvailability(item.id)}
                        >
                          {item.available ? "Ocultar" : "Mostrar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
