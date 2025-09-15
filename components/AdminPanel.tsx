"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Phone, MapPin, Package, Check, Calendar, User, MapPinHouse, Blinds, House, EyeOff, Eye } from "lucide-react";
import type { MenuItem } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/context/AuthContext";
import { FaWhatsapp } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { CgOptions } from "react-icons/cg";
import { FaAmazonPay } from "react-icons/fa6";
import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency, formatTime, keyNumberInteger, keyNumberPhone } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Branch, Category, Company, Order, Person, TypeDocument } from "@/types/api-type";
import { NavSecondary } from "./Nav";
import Welcome from "./Welcome";
import { getCustomerById, updateCustomer } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormCustomer } from "@/types/form";
import { useAlert } from "@/hooks/use-alert";
import { TYPE_DELIVERY } from "@/constants/type-delivery";

interface AdminPanelProps {
  orders: Order[];
  listTypeDocument: TypeDocument[];
  onAddMenuItem: (item: Omit<MenuItem, "id">) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onToggleItemAvailability: (itemId: string) => void;
}

export function AdminPanel({
  orders,
  listTypeDocument,
  onAddMenuItem,
  onUpdateMenuItem,
  onToggleItemAvailability,
}: AdminPanelProps) {
  const { user, update } = useAuth();
  const { currency } = useCurrency();
  const isMobile = useIsMobile()

  const [formCustumer, setFormCustumer] = useState<{
    idPerson: string,
    idTypeDocument: string,
    document: string,
    information: string,
    cellular: string,
    phone: string,
    email: string,
    password: string,
    address: string,
  }>({
    idPerson: user?.idPerson || "",
    idTypeDocument: user?.idTypeDocument || "",
    document: user?.document || "",
    information: user?.information || "",
    cellular: user?.cellular || "",
    phone: user?.phone || "",
    email: user?.email || "",
    password: user?.clave || "",
    address: user?.address || "",
  });

  const refTypeDocument = React.useRef<HTMLButtonElement>(null);
  const alert = useAlert();

  const [showPassword, setShowPassword] = useState(false);
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

  const handleUpdateCustumer = async () => {
    try {
      const body: FormCustomer = {
        idPersona: user?.idPerson!,
        idTipoDocumento: formCustumer.idTypeDocument,
        documento: formCustumer.document,
        informacion: formCustumer.information,
        celular: formCustumer.cellular,
        telefono: formCustumer.phone,
        email: formCustumer.email,
        clave: formCustumer.password,
        direccion: formCustumer.address
      }

      alert.loading({
        message: "Actualizando cliente...",
      });

      const responseUpdateCustomer = await updateCustomer(body);

      const responseGetCustomer = await getCustomerById(user?.idPerson!) as Person;

      const newPerson: Person = {
        idPerson: user?.idPerson!,
        idTypeDocument: responseGetCustomer.idTypeDocument,
        document: responseGetCustomer.document,
        information: responseGetCustomer.information,
        cellular: responseGetCustomer.cellular,
        phone: responseGetCustomer.phone,
        email: responseGetCustomer.email,
        address: responseGetCustomer.address,
      }

      update(newPerson);

      alert.success({
        message: responseUpdateCustomer,
      });
    } catch (error) {
      alert.error({
        message: (error as Error).message,
      });
    }
  };

  // const totalRevenue = orders.filter((order) => order.status !== "cancelled").length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const completedOrders = orders.filter((order) => order.status === "delivered").length;
  // const cancelledOrders = orders.filter((order) => order.status === "cancelled").length;
  // const completedOrCancelledOrders = orders.filter(
  //   (order) => order.status === "delivered" || order.status === "cancelled"
  // );

  // const filteredMenuItems = menuItems.filter(item =>
  //   item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   item.description.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);
  // const currentItems = filteredMenuItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display text-primary mb-2">
            Panel de Cliente
          </h1>
          <p className="text-muted-foreground">
            Gestiona pedidos
          </p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pedidos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {orders.length}
                  </p>
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
        </div>
        {/* {user?.role === "admin" && (
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
                      {formatCurrency(totalRevenue, currency!.code)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card> 
          </div>
        )} */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="orders" className="data-[state=active]:bg-card">
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-card">
              Completados
            </TabsTrigger>
            <TabsTrigger value="information" className="data-[state=active]:bg-card">
              Información
            </TabsTrigger>
            {/* <TabsTrigger value="orders" className="data-[state=active]:bg-card">
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
            )} */}
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {
              orders.map((order, index) => {
                const total = order.orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
                return (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            Pedido {order.series}-{order.numbering}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.date} {formatTime(order.time)}
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
                              {order.person.information}
                            </p>
                            <p className="text-muted-foreground flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {order.person.cellular}
                            </p>
                            <p className="text-muted-foreground flex items-center">
                              <FaWhatsapp className="w-4 h-4 mr-2" />
                              {order.person.phone}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Entrega:</h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground flex items-center">
                              {
                                Object.values(TYPE_DELIVERY).find(type => type.id === order.idTypeDelivery)?.icon
                              }
                              {
                                Object.values(TYPE_DELIVERY).find(type => type.id === order.idTypeDelivery)?.name
                              }
                              {
                                Object.values(TYPE_DELIVERY).find(type => type.id === order.idTypeDelivery)?.description && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({Object.values(TYPE_DELIVERY).find(type => type.id === order.idTypeDelivery)?.description})
                                  </span>
                                )
                              }
                            </p>

                            {
                              Object.values(TYPE_DELIVERY).find(type => type.id === order.idTypeDelivery)?.isScheduled && (
                                <p className="text-muted-foreground flex items-center">
                                  <Blinds className="w-4 h-4 mr-2" />
                                  <span>
                                    {
                                      order.scheduledDate
                                    }
                                  </span> -
                                  <span>
                                    {
                                      formatTime(order.scheduledTime)
                                    }
                                  </span>
                                </p>
                              )
                            }

                            <p className="text-muted-foreground flex items-center">
                              <FaAmazonPay className="w-4 h-4 mr-2" /> Pago:
                            </p>

                            <p className="text-primary font-bold text-lg font-display">
                              {formatCurrency(total, order.currency.code)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Referencia:</h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground flex items-center">
                              <House className="w-4 h-4 mr-2" />
                              {
                                order.person.address
                              }
                            </p>
                            <p className="text-muted-foreground flex items-center">
                              <MapPinHouse className="w-4 h-4 mr-2" />
                              zona
                            </p>
                          </div>
                        </div>

                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-foreground">Items:</h4>
                        <div className="space-y-2">
                          {order.orderDetails.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border border-border/50">
                              <div>
                                <div className="flex items-center gap-2">
                                  <img src={item.product.image || "/placeholder.svg"} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg" />
                                  <span className="font-medium text-foreground">{item.product.name}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                <span className="text-primary font-semibold">
                                  {formatCurrency(item.price * item.quantity, currency!.code)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-foreground">Notas sobre el pedido:</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground">
                          {order.notes}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-foreground">Instrucciones de Entrega:</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground">
                          {order.instructions}
                        </p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={() => { }} className="bg-red-500 hover:bg-red-600 text-white">
                          Anular Pedido
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            }
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground font-display">
                      Pedido #
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                  <Badge className={` text-white border-0`}>
                    status
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Cliente:</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        datos
                      </p>
                      <p className="text-muted-foreground flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        telefono
                      </p>
                      <p className="text-muted-foreground flex items-center">
                        <FaWhatsapp className="w-4 h-4 mr-2" />
                        whatsapp
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Entrega:</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground flex items-center">
                        <CgOptions className="w-4 h-4 mr-2" />
                        Entrega ahora
                      </p>
                      <p className="text-muted-foreground flex items-center">

                        <MdDeliveryDining className="w-4 h-4 mr-2" /> Delivery
                      </p>
                      <p className="text-muted-foreground flex items-center">

                        <Calendar className="w-4 h-4 mr-2" />


                        <Calendar className="w-4 h-4 mr-2" /> 10 Mínutos máximo de prepación



                        <Calendar className="w-4 h-4 mr-2" /> 10 Mínutos máximo de prepación

                      </p>
                      <p className="text-muted-foreground flex items-center"><FaAmazonPay className="w-4 h-4 mr-2" /> Pago: </p>
                      <p className="text-primary font-bold text-lg font-display">
                        {formatCurrency(0, currency!.code)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Referencia:</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        direccion
                      </p>
                      <p className="text-muted-foreground flex items-center">
                        <MapPinHouse className="w-4 h-4 mr-2" />
                        zona
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-foreground">Items:</h4>
                  <div className="space-y-2">
                    {/* {order.items.map((item) => (
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
                                  <span className="text-primary font-semibold">
                                    {formatCurrency(item.price * item.quantity, currency!.code)}
                                  </span>
                                </div>
                              </div>
                            ))} */}
                  </div>
                </div>


                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-foreground">Notas sobre el pedido:</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground"></p>
                </div>


                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-foreground">Instrucciones de Entrega:</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground"></p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="information" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl text-foreground">Editar Datos de Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Label className="text-foreground font-medium">Tipo de Documento *</Label>
                    <Select
                      value={formCustumer.idTypeDocument}
                      onValueChange={(value) => setFormCustumer({ ...formCustumer, idTypeDocument: value })}
                    >
                      <SelectTrigger
                        ref={refTypeDocument}
                        className="bg-muted border-border text-foreground mt-2">
                        <SelectValue placeholder="Selecciona el tipo de documento" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {listTypeDocument.map((typeDoc) => (
                          <SelectItem key={typeDoc.id} value={typeDoc.id} className="text-foreground">
                            {typeDoc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">N° de documento *</Label>
                    <Input
                      type={isMobile ? "tel" : "text"}
                      value={formCustumer.document}
                      onChange={(e) => setFormCustumer({ ...formCustumer, document: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                      onKeyDown={!isMobile ? keyNumberInteger : undefined} />
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">{"Apellidos y Nombre / Razón Social"} *</Label>
                    <Input
                      value={formCustumer.information}
                      onChange={(e) => setFormCustumer({ ...formCustumer, information: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2" />
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">N° de Celular *</Label>
                    <Input
                      type={isMobile ? "tel" : "text"}
                      value={formCustumer.cellular}
                      onChange={(e) => setFormCustumer({ ...formCustumer, cellular: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                      onKeyDown={!isMobile ? keyNumberPhone : undefined} />
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">WhatsApp * </Label>
                    <Input
                      type={isMobile ? "tel" : "text"}
                      value={formCustumer.phone}
                      onChange={(e) => setFormCustumer({ ...formCustumer, phone: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                      onKeyDown={!isMobile ? keyNumberPhone : undefined} />
                  </div>
                  <div>
                    <Label className="text-foreground font-medium">Correo Electrónico *</Label>
                    <Input
                      value={formCustumer.email}
                      onChange={(e) => setFormCustumer({ ...formCustumer, email: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2" />
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">Contraseña de la cuenta *</Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formCustumer.password}
                        onChange={(e) => setFormCustumer({ ...formCustumer, password: e.target.value })}
                        className="bg-muted border-border text-foreground pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">Dirección *</Label>
                    <Input
                      value={formCustumer.address}
                      onChange={(e) => setFormCustumer({ ...formCustumer, address: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2" />
                  </div>
                </div>
                <Button onClick={handleUpdateCustumer} className="mt-6 bg-orange-500 hover:bg-orange-400 text-primary-foreground">
                  Editar Información
                </Button>
              </CardContent>
            </Card>
            <div className="grid gap-4">
              {/* {currentItems.map((item) => (
                <Card key={item.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-foreground font-display">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-primary font-bold text-lg font-display">
                          {formatCurrency(item.price, currency!.code)}
                        </p>
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
              ))} */}
            </div>
            <div className="flex justify-center mt-4">
              {/* <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="mr-2">Anterior</Button>
              <span className="mx-2">Página {currentPage} de {totalPages}</span>
              <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="ml-2">Siguiente</Button> */}
            </div>
          </TabsContent>

          {/* {user?.role === "admin" && (
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
                                  Total: {formatCurrency(order.payment.total, currency!.code)}
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
                                    <span className="text-primary font-semibold">
                                      {formatCurrency(item.price * item.quantity, currency!.code)}
                                    </span>
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
          )} */}

          {/* {user?.role === "admin" && (
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
                                  Total: {formatCurrency(order.payment.total, currency!.code)}
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
                                    <span className="text-primary font-semibold">
                                      {formatCurrency(item.price * item.quantity, currency!.code)}
                                    </span>
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
          )} */}

          {/* {user?.role === "admin" && (
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
                          <p className="text-primary font-bold text-lg font-display">
                            {formatCurrency(item.price, currency!.code)}
                          </p>
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
          )} */}
        </Tabs>
      </div>
    </div>
  );
}

interface AdminComponentProps {
  company: Company;
  branch: Branch;
  categories: Category[];
  listTypeDocument: TypeDocument[];
  orders: Order[];
  authEnabled: boolean;
}

export default function AdminComponent({ company, branch, categories, listTypeDocument, orders, authEnabled }: AdminComponentProps) {
  const router = useRouter()
  const { isAuthenticated, authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) {
      if (!isAuthenticated) {
        router.push("/");
      }
    }
  }, [authLoading]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  // useEffect(() => { 
  //   if (!user) return;

  //   const loadOrders = async () => { 
  //     const resultPerson = await getCustomerById(user.idPerson);
  //     console.log(resultPerson);
  //   };

  //   loadOrders();
  // }, []);

  const handleAddMenuItem = (newItem: Omit<MenuItem, "id">) => {
    // const item: MenuItem = {
    //   ...newItem,
    //   id: Date.now().toString(),
    // };
    // setData((prev) => ({
    //   ...prev,
    //   menuItems: [...prev.menuItems, item],
    // }));
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    // setData((prev) => ({
    //   ...prev,
    //   menuItems: prev.menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    // }));
  };

  const handleToggleItemAvailability = (itemId: string) => {
    // setData((prev) => ({
    //   ...prev,
    //   menuItems: prev.menuItems.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item)),
    // }));
  };

  if (!isMounted || isLoading) {
    return <Welcome company={company} branch={branch} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NavSecondary title="Panel de Administración" authEnabled={authEnabled} />

      {/* Body */}
      <AdminPanel
        orders={orders}
        // menuItems={data.menuItems}
        listTypeDocument={listTypeDocument}
        onAddMenuItem={handleAddMenuItem}
        onUpdateMenuItem={handleUpdateMenuItem}
        onToggleItemAvailability={handleToggleItemAvailability}
      />
    </div>
  );


}
