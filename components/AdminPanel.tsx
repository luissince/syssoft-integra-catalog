import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Phone, MapPin, Package, TrendingUp, ListOrderedIcon, Check, Search, Calendar, User, MapPinHouse } from "lucide-react";
import type { Order, MenuItem, Category } from "@/types";
import { IngredientList } from "./IngredientList";
import { NutritionalInfoList } from "./NutritionalInfoList";
import customers from "@/data/customer.json";
import { useAuth } from "@/context/AuthContext";
import { FaWhatsapp } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { MdOutlineHouse } from "react-icons/md";
import { CgOptions } from "react-icons/cg";
import { FaAmazonPay } from "react-icons/fa6";

interface AdminPanelProps {
  orders: Order[];
  menuItems: MenuItem[];
  categories: Category[];
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void;
  onAddMenuItem: (item: Omit<MenuItem, "id">) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onToggleItemAvailability: (itemId: string) => void;
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
  const { user } = useAuth();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    images: [],
    category: "",
    rating: 4.5,
    available: true,
    preparationTime: 20,
    ingredients: [],
    nutritionalInfo: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "preparing":
        return "bg-blue-500 hover:bg-blue-600";
      case "ready":
        return "bg-green-500 hover:bg-green-600";
      case "delivered":
        return "bg-gray-500 hover:bg-gray-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "preparing":
        return "Preparando";
      case "ready":
        return "Listo";
      case "delivered":
        return "Entregado";
      case "cancelled":
        return "Anulado";
      default:
        return status;
    }
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.category) {
      onAddMenuItem(newItem);
      setNewItem({
        name: "",
        description: "",
        price: 0,
        images: [],
        category: "",
        rating: 4.5,
        available: true,
        preparationTime: 20,
        ingredients: [],
        nutritionalInfo: [],
      });
    }
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      onUpdateMenuItem(editingItem);
      setEditingItem(null);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== "cancelled" ? order.payment.total : 0), 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const completedOrders = orders.filter((order) => order.status === "delivered").length;
  const cancelledOrders = orders.filter((order) => order.status === "cancelled").length;
  const completedOrCancelledOrders = orders.filter(
    (order) => order.status === "delivered" || order.status === "cancelled"
  );

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);
  const currentItems = filteredMenuItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display text-primary mb-2">
            {user?.role === "admin" && <span>Panel de Administración</span>}
            {user?.role === "customer" && <span>Panel de Cliente</span>}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === "admin" && "Gestiona pedidos y menú desde aquí"}
            {user?.role === "customer" && "Gestiona pedidos"}
          </p>
        </div>
        {/* Stats Cards */}
        {user?.role === "admin" && (
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
                    <p className="text-sm text-muted-foreground">Completados</p>
                    <p className="text-2xl font-bold text-green-500">
                      {completedOrders}
                    </p>
                  </div>
                  <Check className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {pendingOrders}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Anulados</p>
                    <p className="text-2xl font-bold text-red-500">
                      {cancelledOrders}
                    </p>
                  </div>
                  <ListOrderedIcon className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos</p>
                    <p className="text-2xl font-bold text-primary">
                      S/. {totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="orders" className="data-[state=active]:bg-card">
              Pedidos ({pendingOrders})
            </TabsTrigger>
            {user?.role === "admin" && (
              <>
                <TabsTrigger value="completed" className="data-[state=active]:bg-card">
                  Completados ({completedOrders})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="data-[state=active]:bg-card">
                  Anulados ({cancelledOrders})
                </TabsTrigger>
                <TabsTrigger value="menu" className="data-[state=active]:bg-card">
                  Menú ({menuItems.length})
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="grid gap-4">
              {orders
                .filter((order) => order.status !== "delivered" && order.status !== "cancelled")
                .map((order) => {
                  const customer = customers.list.find((customer) => customer.id === order.customerId);
                  return (
                    <Card key={order.id} className="bg-card border-border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-foreground font-display">
                              Pedido #{order.id}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-foreground">Cliente:</h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-muted-foreground flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {customer?.document}, {customer?.name}
                              </p>
                              <p className="text-muted-foreground flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                {customer?.phone}
                              </p>
                              <p className="text-muted-foreground flex items-center">
                                <FaWhatsapp className="w-4 h-4 mr-2" />
                                {customer?.whatsapp}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-foreground">Entrega:</h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-muted-foreground flex items-center">
                                <CgOptions className="w-4 h-4 mr-2" />
                                {order.delivery?.orderType === "scheduled" ? "Entrega programada" : "Entrega ahora"}
                              </p>
                              <p className="text-muted-foreground flex items-center">

                                {order.delivery?.type === "delivery" ? <><MdDeliveryDining className="w-4 h-4 mr-2" /> Delivery</> : <> <MdOutlineHouse className="w-4 h-4 mr-2" /> Local</>}
                              </p>
                              <p className="text-muted-foreground flex items-center">
                                {
                                  order.delivery?.orderType === "scheduled" && (
                                    <>
                                      <Calendar className="w-4 h-4 mr-2" /> {new Date(order.delivery.scheduledDate!).toLocaleDateString()} - <Clock className="ml-1 w-4 h-4 mr-2" />{order.delivery.scheduledTime}
                                    </>
                                  )
                                }

                                {
                                  order.delivery?.orderType === "now" && order.delivery?.type === "delivery" && (
                                    <>
                                      <Calendar className="w-4 h-4 mr-2" /> 10 Mínutos máximo de prepación
                                    </>
                                  )
                                }


                                {
                                  order.delivery?.orderType === "now" && order.delivery?.type === "local" && (
                                    <>
                                      <Calendar className="w-4 h-4 mr-2" /> 10 Mínutos máximo de prepación
                                    </>
                                  )
                                }

                              </p>
                              <p className="text-muted-foreground flex items-center"><FaAmazonPay className="w-4 h-4 mr-2" /> Pago: {order.payment.method}</p>
                              {order.payment.discount > 0 && (
                                <div className="flex justify-between text-foreground">
                                  <span>Descuento -{order.payment.discount}%:</span>
                                </div>
                              )}
                              {order.payment.deliveryFee > 0 && (
                                <div className="flex justify-between text-foreground">
                                  <span>Delivery +{order.payment.deliveryFee}:</span>
                                </div>
                              )}
                              <p className="text-primary font-bold text-lg font-display">
                                Total: S/. {order.payment.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          {
                            order.delivery?.type === "delivery" && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-foreground">Referencia:</h4>
                                <div className="space-y-2 text-sm">
                                  <p className="text-muted-foreground flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {order.delivery?.address?.address || 'N/A'}
                                  </p>
                                  <p className="text-muted-foreground flex items-center">
                                    <MapPinHouse className="w-4 h-4 mr-2" />
                                    {order.delivery?.zone?.name || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            )
                          }
                        </div>

                        <div className="mb-6">
                          <h4 className="font-semibold mb-3 text-foreground">Items:</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border border-border/50">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <img src={item.images[0].url || "/placeholder.svg"} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                                    <span className="font-medium text-foreground">{item.name}</span>
                                  </div>
                                  {item.notes && <p className="text-xs text-primary mt-1">Nota: {item.notes}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                  <span className="text-primary font-semibold">S/. {(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.orderNotes && (
                          <div className="mb-6">
                            <h4 className="font-semibold mb-2 text-foreground">Notas sobre el pedido:</h4>
                            <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground">{order.orderNotes}</p>
                          </div>
                        )}

                        {order.notes && (
                          <div className="mb-6">
                            <h4 className="font-semibold mb-2 text-foreground">Instrucciones de Entrega:</h4>
                            <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground">{order.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          {order.status === "pending" && (
                            <>
                              <Button size="sm" onClick={() => onUpdateOrderStatus(order.id, "preparing")} className="bg-blue-500 hover:bg-blue-600 text-white">
                                Marcar como Preparando
                              </Button>
                              <Button size="sm" onClick={() => onUpdateOrderStatus(order.id, "cancelled")} className="bg-red-500 hover:bg-red-600 text-white">
                                Anular Pedido
                              </Button>
                            </>
                          )}
                          {order.status === "preparing" && (
                            <Button size="sm" onClick={() => onUpdateOrderStatus(order.id, "ready")} className="bg-green-500 hover:bg-green-600 text-white">
                              Marcar como Listo
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <Button size="sm" onClick={() => onUpdateOrderStatus(order.id, "delivered")} className="bg-gray-500 hover:bg-gray-600 text-white">
                              Marcar como Entregado
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>

          {user?.role === "admin" && (
            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-4">
                {completedOrCancelledOrders
                  .filter((order) => order.status === "delivered")
                  .map((order) => {
                    const customer = customers.list.find((customer) => customer.id === order.customerId);
                    return (
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
                                <p className="text-muted-foreground flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  {customer?.document}, {customer?.name}
                                </p>
                                <p className="text-muted-foreground flex items-center">
                                  <Phone className="w-4 h-4 mr-2" />
                                  {customer?.phone}
                                </p>
                                <p className="text-muted-foreground flex items-center">
                                  <FaWhatsapp className="w-4 h-4 mr-2" />
                                  {customer?.whatsapp}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-semibold text-foreground">Entrega:</h4>
                              <div className="space-y-2 text-sm">
                                <p className="text-muted-foreground flex items-center">
                                  <CgOptions className="w-4 h-4 mr-2" />
                                  {order.delivery?.orderType === "scheduled" ? "Entrega programada" : "Entrega ahora"}
                                </p>
                                <p className="text-muted-foreground flex items-center">

                                  {order.delivery?.type === "delivery" ? <><MdDeliveryDining className="w-4 h-4 mr-2" /> Delivery</> : <> <MdOutlineHouse className="w-4 h-4 mr-2" /> Local</>}
                                </p>
                                <p className="text-muted-foreground flex items-center">
                                  {
                                    order.delivery?.orderType === "scheduled" && (
                                      <>
                                        <Calendar className="w-4 h-4 mr-2" /> {new Date(order.delivery.scheduledDate!).toLocaleDateString()} - <Clock className="ml-1 w-4 h-4 mr-2" />{order.delivery.scheduledTime}
                                      </>
                                    )
                                  }

                                  {
                                    order.delivery?.orderType === "now" && order.delivery?.type === "delivery" && (
                                      <>
                                        <Calendar className="w-4 h-4 mr-2" /> 10 Mínutos máximo de prepación
                                      </>
                                    )
                                  }


                                  {
                                    order.delivery?.orderType === "now" && order.delivery?.type === "local" && (
                                      <>
                                        <Calendar className="w-4 h-4 mr-2" /> 10 Mínutos máximo de prepación
                                      </>
                                    )
                                  }

                                </p>
                                <p className="text-muted-foreground flex items-center"><FaAmazonPay className="w-4 h-4 mr-2" /> Pago: {order.payment.method}</p>
                                {order.payment.discount > 0 && (
                                  <div className="flex justify-between text-foreground">
                                    <span>Descuento -{order.payment.discount}%:</span>
                                  </div>
                                )}
                                {order.payment.deliveryFee > 0 && (
                                  <div className="flex justify-between text-foreground">
                                    <span>Delivery +{order.payment.deliveryFee}:</span>
                                  </div>
                                )}
                                <p className="text-primary font-bold text-lg font-display">
                                  Total: S/. {order.payment.total.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {
                              order.delivery?.type === "delivery" && (
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-foreground">Referencia:</h4>
                                  <div className="space-y-2 text-sm">
                                    <p className="text-muted-foreground flex items-center">
                                      <MapPin className="w-4 h-4 mr-2" />
                                      {order.delivery?.address?.address || 'N/A'}
                                    </p>
                                    <p className="text-muted-foreground flex items-center">
                                      <MapPinHouse className="w-4 h-4 mr-2" />
                                      {order.delivery?.zone?.name || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              )
                            }
                          </div>

                          <div className="mb-6">
                            <h4 className="font-semibold mb-3 text-foreground">Items:</h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border border-border/50">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <img src={item.images[0].url || "/placeholder.svg"} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                                      <span className="font-medium text-foreground">{item.name}</span>
                                    </div>
                                    {item.notes && <p className="text-xs text-primary mt-1">Nota: {item.notes}</p>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                    <span className="text-primary font-semibold">S/. {(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          )}

          {user?.role === "admin" && (
            <TabsContent value="cancelled" className="space-y-4">
              <div className="grid gap-4">
                {completedOrCancelledOrders
                  .filter((order) => order.status === "cancelled")
                  .map((order) => {
                    const customer = customers.list.find((customer) => customer.id === order.customerId);
                    return (
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
                                <p className="text-muted-foreground flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  {customer?.document}, {customer?.name}
                                </p>
                                <p className="text-muted-foreground flex items-center">
                                  <Phone className="w-4 h-4 mr-2" />
                                  {customer?.phone}
                                </p>
                                <p className="text-muted-foreground flex items-center">
                                  <FaWhatsapp className="w-4 h-4 mr-2" />
                                  {customer?.whatsapp}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-semibold text-foreground">Entrega:</h4>
                              <div className="space-y-2 text-sm">
                                <p className="text-muted-foreground flex items-center">
                                  <CgOptions className="w-4 h-4 mr-2" />
                                  {order.delivery?.orderType === "scheduled" ? "Entrega programada" : "Entrega ahora"}
                                </p>
                                <p className="text-muted-foreground flex items-center">

                                  {order.delivery?.type === "delivery" ? <><MdDeliveryDining className="w-4 h-4 mr-2" /> Delivery</> : <> <MdOutlineHouse className="w-4 h-4 mr-2" /> Local</>}
                                </p>
                                <p className="text-muted-foreground flex items-center">
                                  {
                                    order.delivery?.orderType === "scheduled" && (
                                      <>
                                        <Calendar className="w-4 h-4 mr-2" /> {new Date(order.delivery.scheduledDate!).toLocaleDateString()} - <Clock className="ml-1 w-4 h-4 mr-2" />{order.delivery.scheduledTime}
                                      </>
                                    )
                                  }

                                  {
                                    order.delivery?.orderType === "now" && order.delivery?.type === "delivery" && (
                                      <>
                                        <Calendar className="w-4 h-4 mr-2" /> 10 Mínutos máximo de prepación
                                      </>
                                    )
                                  }


                                  {
                                    order.delivery?.orderType === "now" && order.delivery?.type === "local" && (
                                      <>
                                        <Calendar className="w-4 h-4 mr-2" /> 10 Mínutos máximo de prepación
                                      </>
                                    )
                                  }

                                </p>
                                <p className="text-muted-foreground flex items-center"><FaAmazonPay className="w-4 h-4 mr-2" /> Pago: {order.payment.method}</p>
                                {order.payment.discount > 0 && (
                                  <div className="flex justify-between text-foreground">
                                    <span>Descuento -{order.payment.discount}%:</span>
                                  </div>
                                )}
                                {order.payment.deliveryFee > 0 && (
                                  <div className="flex justify-between text-foreground">
                                    <span>Delivery +{order.payment.deliveryFee}:</span>
                                  </div>
                                )}
                                <p className="text-primary font-bold text-lg font-display">
                                  Total: S/. {order.payment.total.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {
                              order.delivery?.type === "delivery" && (
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-foreground">Referencia:</h4>
                                  <div className="space-y-2 text-sm">
                                    <p className="text-muted-foreground flex items-center">
                                      <MapPin className="w-4 h-4 mr-2" />
                                      {order.delivery?.address?.address || 'N/A'}
                                    </p>
                                    <p className="text-muted-foreground flex items-center">
                                      <MapPinHouse className="w-4 h-4 mr-2" />
                                      {order.delivery?.zone?.name || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              )
                            }
                          </div>

                          <div className="mb-6">
                            <h4 className="font-semibold mb-3 text-foreground">Items:</h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border border-border/50">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <img src={item.images[0].url || "/placeholder.svg"} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                                      <span className="font-medium text-foreground">{item.name}</span>
                                    </div>
                                    {item.notes && <p className="text-xs text-primary mt-1">Nota: {item.notes}</p>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                    <span className="text-primary font-semibold">S/. {(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          )}

          {user?.role === "admin" && (
            <TabsContent value="menu" className="space-y-6">
              {editingItem ? (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-display text-xl text-foreground">Editar Plato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-foreground font-medium">Nombre</Label>
                        <Input value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="bg-muted border-border text-foreground mt-2" />
                      </div>
                      <div>
                        <Label className="text-foreground font-medium">Precio</Label>
                        <Input type="number" step="0.01" value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: Number.parseFloat(e.target.value) })} className="bg-muted border-border text-foreground mt-2" />
                      </div>
                      <div>
                        <Label className="text-foreground font-medium">Categoría</Label>
                        <Select value={editingItem.category} onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}>
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
                        <Input type="number" value={editingItem.preparationTime} onChange={(e) => setEditingItem({ ...editingItem, preparationTime: Number.parseInt(e.target.value) })} className="bg-muted border-border text-foreground mt-2" />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-foreground font-medium">Descripción</Label>
                        <Textarea value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className="bg-muted border-border text-foreground mt-2" />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-foreground font-medium">URL de imagen</Label>
                        <Input value={editingItem.images[0].url} onChange={(e) => setEditingItem({ ...editingItem, images: [{ ...editingItem.images[0], url: e.target.value }] })} className="bg-muted border-border text-foreground mt-2" placeholder="/placeholder.svg?height=200&width=300&text=Nombre+del+plato" />
                      </div>
                      <div className="md:col-span-2">
                        <IngredientList ingredients={editingItem.ingredients} onAddIngredient={(ingredient) => setEditingItem({ ...editingItem, ingredients: [...editingItem.ingredients, ingredient] })} onRemoveIngredient={(index) => {
                          const updatedIngredients = [...editingItem.ingredients];
                          updatedIngredients.splice(index, 1);
                          setEditingItem({ ...editingItem, ingredients: updatedIngredients });
                        }} />
                      </div>
                      <div className="md:col-span-2">
                        <NutritionalInfoList nutritionalInfo={editingItem.nutritionalInfo} onAddNutritionalInfo={(info) => setEditingItem({ ...editingItem, nutritionalInfo: [...editingItem.nutritionalInfo, info] })} onRemoveNutritionalInfo={(index) => {
                          const updatedNutritionalInfo = [...editingItem.nutritionalInfo];
                          updatedNutritionalInfo.splice(index, 1);
                          setEditingItem({ ...editingItem, nutritionalInfo: updatedNutritionalInfo });
                        }} />
                      </div>
                    </div>
                    <Button onClick={handleUpdateItem} className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Actualizar Plato
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-display text-xl text-foreground">Agregar Nuevo Plato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-foreground font-medium">Nombre</Label>
                        <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="bg-muted border-border text-foreground mt-2" />
                      </div>
                      <div>
                        <Label className="text-foreground font-medium">Precio</Label>
                        <Input type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })} className="bg-muted border-border text-foreground mt-2" />
                      </div>
                      <div>
                        <Label className="text-foreground font-medium">Categoría</Label>
                        <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
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
                        <Input type="number" value={newItem.preparationTime} onChange={(e) => setNewItem({ ...newItem, preparationTime: Number.parseInt(e.target.value) })} className="bg-muted border-border text-foreground mt-2" />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-foreground font-medium">Descripción</Label>
                        <Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="bg-muted border-border text-foreground mt-2" />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-foreground font-medium">URL de imagen</Label>
                        <Input value={newItem.images[0].url} onChange={(e) => setNewItem({ ...newItem, images: [{ ...newItem.images[0], url: e.target.value }] })} className="bg-muted border-border text-foreground mt-2" placeholder="/placeholder.svg?height=200&width=300&text=Nombre+del+plato" />
                      </div>
                      <div className="md:col-span-2">
                        <IngredientList ingredients={newItem.ingredients} onAddIngredient={(ingredient) => setNewItem({ ...newItem, ingredients: [...newItem.ingredients, ingredient] })} onRemoveIngredient={(index) => {
                          const updatedIngredients = [...newItem.ingredients];
                          updatedIngredients.splice(index, 1);
                          setNewItem({ ...newItem, ingredients: updatedIngredients });
                        }} />
                      </div>
                      <div className="md:col-span-2">
                        <NutritionalInfoList nutritionalInfo={newItem.nutritionalInfo} onAddNutritionalInfo={(info) => setNewItem({ ...newItem, nutritionalInfo: [...newItem.nutritionalInfo, info] })} onRemoveNutritionalInfo={(index) => {
                          const updatedNutritionalInfo = [...newItem.nutritionalInfo];
                          updatedNutritionalInfo.splice(index, 1);
                          setNewItem({ ...newItem, nutritionalInfo: updatedNutritionalInfo });
                        }} />
                      </div>
                    </div>
                    <Button onClick={handleAddItem} className="mt-6 bg-blue-500 hover:bg-blue-400 text-primary-foreground">
                      Agregar Plato
                    </Button>
                  </CardContent>
                </Card>
              )}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="Buscar platos..." className="pl-8 bg-muted border-border text-foreground" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                </div>
              </div>
              <div className="grid gap-4">
                {currentItems.map((item) => (
                  <Card key={item.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-foreground font-display">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-primary font-bold text-lg font-display">S/. {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={item.available ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                            {item.available ? "Disponible" : "No disponible"}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>Editar</Button>
                          <Button size="sm" variant={item.available ? "destructive" : "default"} onClick={() => onToggleItemAvailability(item.id)}>
                            {item.available ? "Ocultar" : "Mostrar"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="mr-2">Anterior</Button>
                <span className="mx-2">Página {currentPage} de {totalPages}</span>
                <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="ml-2">Siguiente</Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
