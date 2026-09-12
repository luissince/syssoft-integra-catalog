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
import { Clock, Package, Check, User, EyeOff, Eye, IdCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn, formatCurrency, formatDecimal, formatNumberWithZeros, formatTime, keyNumberInteger, keyNumberPhone } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Company, Order, Person, TypeDocument } from "@/types/api-type";
import Welcome from "./Welcome";
import { getCustomerById, updateCustomer } from "@/lib/api";
import { FormCustomer } from "@/types/form";
import { useAlert } from "@/hooks/use-alert";
import { TYPE_DELIVERY } from "@/constants/type-delivery";
import Container from "./Container";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { fetchAllOrder } from "@/data/data-rest";

interface AdminPanelProps {
  person: Person;
  initialOrders: { orders: Order[], count: number };
  listTypeDocument: TypeDocument[];
}

export function AdminPanel({
  person,
  initialOrders,
  listTypeDocument
}: AdminPanelProps) {
  const { update } = useAuth();
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState(initialOrders.orders);
  const [totalOrders, setTotalOrders] = useState(initialOrders.count);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [offset, setOffset] = useState(initialOrders.orders.length);

  const [formCustumer, setFormCustumer] = useState<{
    idPerson: string,
    idTypeDocument: string,
    document: string,
    information: string,
    phonerNumber: string,
    mobileNumber: string,
    email: string,
    password: string,
    address: string,
  }>({
    idPerson: person.idPerson || "",
    idTypeDocument: person.idTypeDocument || "",
    document: person.document || "",
    information: person.information || "",
    phonerNumber: person.phonerNumber || "",
    mobileNumber: person.mobileNumber || "",
    email: person.email || "",
    password: person.clave || "",
    address: person.address || "",
  });

  const refTypeDocument = React.useRef<HTMLButtonElement>(null);
  const alert = useAlert();

  const [showPassword, setShowPassword] = useState(false);

  const filterOrders = async (reset = true) => {
    try {
      setLoading(true);
      const { success, data } = await fetchAllOrder({
        opcion: 3,
        buscar: person.idPerson,
        posicionPagina: reset ? 0 : offset,
        filasPorPagina: itemsPerPage
      });

      if (!success || !data) {
        alert.warning({
          message: "No se pudo obtener los pedidos, intente nuevamente.",
        });
        return;
      }

      if (reset) {
        setOrders(data.orders);
        setOffset(data.orders.length);
      } else {
        setOrders(prev => [
          ...prev,
          ...data.orders
        ]);
        setOffset(prev => prev + data.orders.length);
      }
      setTotalOrders(data.count);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreItems = () => {
    filterOrders(false);
  };

  const getStatusColor = (status: Order["status"]): string => {
    switch (status) {
      case 1:
        return "bg-orange-100 text-orange-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-emerald-100 text-emerald-80";
      case 4:
        return "bg-sky-100 text-sky-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case 1:
        return "PENDIENTE";
      case 2:
        return "PREPARANDO";
      case 3:
        return "LISTO";
      case 4:
        return "ENTREGADO";
      default:
        return "CENCELADO";
    }
  };

  const handleUpdateCustumer = async () => {
    try {
      const body: FormCustomer = {
        idPersona: person.idPerson!,
        idTipoDocumento: formCustumer.idTypeDocument,
        documento: formCustumer.document,
        informacion: formCustumer.information,
        telefono: formCustumer.phonerNumber,
        celular: formCustumer.mobileNumber,
        email: formCustumer.email,
        clave: formCustumer.password,
        direccion: formCustumer.address
      }

      alert.loading({
        message: "Actualizando cliente...",
      });

      const responseUpdateCustomer = await updateCustomer(body);

      const responseGetCustomer = await getCustomerById(person.idPerson!) as Person;

      const newPerson: Person = {
        idPerson: person.idPerson!,
        idTypeDocument: responseGetCustomer.idTypeDocument,
        document: responseGetCustomer.document,
        information: responseGetCustomer.information,
        phonerNumber: responseGetCustomer.phonerNumber,
        mobileNumber: responseGetCustomer.mobileNumber,
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

  const pendingOrders = orders.filter((order) => order.status === 1).length;
  const completedOrders = orders.filter((order) => order.status === 4).length;

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
                    {totalOrders}
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
            <TabsTrigger value="information" className="data-[state=active]:bg-card">
              Información
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {
              orders.map((order: Order, index: number) => {
                return (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            PEDIDO: {order.receipt?.series} - {formatNumberWithZeros(order.receipt?.number!)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.date} {formatTime(order.time)}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} `}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* CLIENTE */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Cliente:</h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground flex items-center">
                              <IdCard className="w-4 h-4 mr-2" />
                              {order.person.typeDocument?.name} - {order.person.document}
                            </p>
                            <p className="text-muted-foreground flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              {order.person.information}
                            </p>
                          </div>
                        </div>
                        {/* ENTREGA */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Entrega:</h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground flex flex-col md:flex-row items-center">
                              {
                                Object.values(TYPE_DELIVERY).find(type => type.id === order.typeOrder?.idTypeOrder)?.icon
                              }

                              {
                                Object.values(TYPE_DELIVERY).find(type => type.id === order.typeOrder?.idTypeOrder)?.name
                              }

                              {
                                Object.values(TYPE_DELIVERY).find(type => type.id === order.typeOrder?.idTypeOrder)?.description && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({Object.values(TYPE_DELIVERY).find(type => type.id === order.typeOrder?.idTypeOrder)?.description})
                                  </span>
                                )
                              }
                            </p>

                            <p className="text-primary font-bold text-lg ">
                              {formatCurrency(order.total, order.currency.code)}
                            </p>
                          </div>
                        </div>

                        {/* <div className="space-y-3">
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
                        </div> */}
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-foreground">Items:</h4>
                        <div className="space-y-2">
                          {order.orderDetails.map((item) => {
                            return (
                              <div
                                key={item.id}
                                className={cn(
                                  "grid",
                                  " grid-cols-1",
                                  "gap-3",
                                  "py-3",
                                  "bg-muted/50 p-3 rounded-lg border border-border/50",
                                  "md:grid-cols-[1fr_25%_25%]",
                                  "md:items-center"
                                )}>

                                <div className="flex flex-col md:flex-row items-center gap-2">
                                  <Image
                                    src={item.product.image || "/placeholder.svg"}
                                    alt={item.product.name}
                                    width={60}
                                    height={60}
                                    className="object-cover rounded-lg"
                                  />
                                  <div className="flex flex-col gap-1">
                                    <p className="text-foreground text-sm">{item.product.code}</p>
                                    <p className="text-foreground font-medium">{item.product.name}</p>
                                    <p className="text-muted-foreground">
                                      {formatCurrency(item.price, order.currency.code)} x <small>{item.measure.name}</small>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-end">
                                  <span className="font-bold">
                                    {formatDecimal(item.quantity.toString(), 2)}
                                  </span>
                                </div>

                                <div className="flex items-center justify-end">
                                  <span className="text-primary font-semibold">
                                    {formatCurrency(item.price * item.quantity, order.currency.code)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-foreground">Notas sobre el pedido:</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground">
                          {order.notes}
                        </p>
                      </div>

                      {/* <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={() => { }} className="bg-red-500 hover:bg-red-600 text-white">
                          Anular Pedido
                        </Button>
                      </div> */}
                    </CardContent>
                  </Card>
                );
              })
            }

            {orders.length < totalOrders && (
              <Button
                onClick={loadMoreItems}
                className="mt-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Ver más
              </Button>
            )}
          </TabsContent>

          <TabsContent value="information" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className=" text-xl text-foreground">Editar Datos de Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
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

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">N° de documento *</Label>
                    <Input
                      type={isMobile ? "tel" : "text"}
                      value={formCustumer.document}
                      onChange={(e) => setFormCustumer({ ...formCustumer, document: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                      onKeyDown={!isMobile ? keyNumberInteger : undefined} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">{"Apellidos y Nombre / Razón Social"} *</Label>
                    <Input
                      value={formCustumer.information}
                      onChange={(e) => setFormCustumer({ ...formCustumer, information: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">N° de Celular *</Label>
                    <Input
                      type={isMobile ? "tel" : "text"}
                      value={formCustumer.phonerNumber}
                      onChange={(e) => setFormCustumer({ ...formCustumer, phonerNumber: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                      onKeyDown={!isMobile ? keyNumberPhone : undefined} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">WhatsApp * </Label>
                    <Input
                      type={isMobile ? "tel" : "text"}
                      value={formCustumer.mobileNumber}
                      onChange={(e) => setFormCustumer({ ...formCustumer, mobileNumber: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2"
                      onKeyDown={!isMobile ? keyNumberPhone : undefined} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Correo Electrónico *</Label>
                    <Input
                      value={formCustumer.email}
                      onChange={(e) => setFormCustumer({ ...formCustumer, email: e.target.value })}
                      className="bg-muted border-border text-foreground mt-2" />
                  </div>

                  <div className="space-y-2">
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

                <Button onClick={handleUpdateCustumer} className="w-full mt-6 bg-orange-500 hover:bg-orange-400 text-primary-foreground">
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
  initialOrders: { orders: Order[], count: number };
  person: Person;
}

export default function AdminComponent({ company, listTypeDocument, initialOrders, person }: AdminComponentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);


  if (isLoading) {
    return <Welcome />;
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
        person={person}
        initialOrders={initialOrders}
        listTypeDocument={listTypeDocument}
      />
    </Container>
  );


}
