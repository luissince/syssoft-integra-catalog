// components/AdminPanel.tsx
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
import { useAuth } from "@/context/AuthContext";
import { FaWhatsapp } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { CgOptions } from "react-icons/cg";
import { FaAmazonPay } from "react-icons/fa6";
import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency, formatTime, keyNumberInteger, keyNumberPhone } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Branch, Category, Company, Order, Person, TypeDocument } from "@/types/api-type";
import Welcome from "./Welcome";
import { getCustomerById, updateCustomer } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormCustomer } from "@/types/form";
import { useAlert } from "@/hooks/use-alert";
import { TYPE_DELIVERY } from "@/constants/type-delivery";
import Container from "./Container";
import { PageBreadcrumb } from "./PageBreadcrumb";

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
          <h1 className="text-4xl font-bold  text-primary mb-2">
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

                            <p className="text-muted-foreground flex items-center">
                              <FaAmazonPay className="w-4 h-4 mr-2" /> Pago:
                            </p>

                            <p className="text-primary font-bold text-lg ">
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
                    <h3 className="font-bold text-lg text-foreground ">
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
                      <p className="text-primary font-bold text-lg ">
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
                <CardTitle className=" text-xl text-foreground">Editar Datos de Cliente</CardTitle>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface AdminComponentProps {
  company: Company;
  listTypeDocument: TypeDocument[];
  orders: Order[];
}

export default function AdminComponent({ company, listTypeDocument, orders }: AdminComponentProps) {
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
    return <Welcome company={company} />;
  }

  return (
    <Container>
      {/* Breadcrumb */}
      <PageBreadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Panel de Administración" },
        ]}
      />

      {/* Body */}
      <AdminPanel
        orders={orders}
        // menuItems={data.menuItems}
        listTypeDocument={listTypeDocument}
        onAddMenuItem={handleAddMenuItem}
        onUpdateMenuItem={handleUpdateMenuItem}
        onToggleItemAvailability={handleToggleItemAvailability}
      />
    </Container>
  );


}
