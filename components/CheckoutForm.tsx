import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PaymentMethod } from "@/types";
import { Branch, Cart, Currency, Tax, TypeDocument } from "@/types/api-type";
import {
  TYPE_DELIVERY,
} from "@/constants/type-delivery";
import {
  currentDate,
  formatCurrency,
  isValidEmail,
  keyNumberInteger,
  keyNumberPhone,
  timeSlots,
} from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { getPaymentReceipts } from "@/lib/api";
import { useAlert } from "@/hooks/use-alert";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { FormOrder } from "@/types/form";

interface CheckoutFormProps {
  listTypeDocument: TypeDocument[];
  branches: Branch[];
  tax: Tax;
  currency: Currency;
  cart: Cart[];
  paymentMethods: PaymentMethod[];
  onSubmitOrder: (orderData: FormOrder) => void;
  onBack: () => void;
}

export function CheckoutForm({
  listTypeDocument,
  branches,
  tax,
  currency,
  cart,
  paymentMethods,
  onSubmitOrder,
  onBack,
}: CheckoutFormProps) {
  const isMobile = useIsMobile();
  const alert = useAlert();
  const { user } = useAuth();

  const [formData, setFormData] = useState<{
    idTypeDelivery: string;
    idTypeDocument: string;
    document: string;
    name: string;
    phone: string;
    whatsapp: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    reference: string;
    email: string;
    password: string;
    validationPassword: string;
    idBranch: string;
    paymentMethodReference: string;
    orderNotes: string;
    instructions: string;
  }>({
    idTypeDelivery: TYPE_DELIVERY.DELIVERY_NOW.id,
    idTypeDocument: "",
    document: user?.document || "",
    name: user?.information || "",
    phone: user?.cellular || "",
    whatsapp: user?.phone || "",
    scheduledDate: currentDate(),
    scheduledTime: "",
    address: user?.address || "",
    reference: "",
    email: user?.email || "",
    password: "",
    validationPassword: "",
    idBranch: "",
    paymentMethodReference: "",
    orderNotes: "",
    instructions: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showValidationPassword, setShowValidationPassword] = useState(false);

  const refTypeDocument = React.useRef<HTMLButtonElement>(null);
  const refDocument = React.useRef<HTMLInputElement>(null);
  const refName = React.useRef<HTMLInputElement>(null);
  const refPhone = React.useRef<HTMLInputElement>(null);
  const refEmail = React.useRef<HTMLInputElement>(null);
  const refPassword = React.useRef<HTMLInputElement>(null);
  const refValidationPassword = React.useRef<HTMLInputElement>(null);
  const refWhastapp = React.useRef<HTMLInputElement>(null);
  const refAddress = React.useRef<HTMLInputElement>(null);
  const refBranch = React.useRef<HTMLButtonElement>(null);
  const refScheduledDate = React.useRef<HTMLInputElement>(null);
  const refScheduledTime = React.useRef<HTMLButtonElement>(null);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      document: user?.document || "",
      name: user?.information || "",
      phone: user?.cellular || "",
      whatsapp: user?.phone || "",
      address: user?.address || "",
      email: user?.email || "",
    }));
  }, [user]);

  useEffect(() => {
    if (branches.length === 1) {
      setFormData((prev) => ({
        ...prev,
        idBranch: branches[0].id,
      }));
    }
  }, [branches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentReceipts = await getPaymentReceipts(formData.idBranch);

    const paymentReceipt = paymentReceipts.find(
      (paymentReceipt) => paymentReceipt.prefered === true
    );

    if (!paymentReceipt) {
      alert.warning(
        {
          message:
            "No se encontró un comprobante preferido para la sucursal seleccionada.",
        },
        () => {}
      );
      return;
    }

    if (
      Object.values(TYPE_DELIVERY).find((t) => t.id === formData.idTypeDelivery)
        ?.isScheduled &&
      formData.scheduledDate === ""
    ) {
      alert.warning(
        {
          message: "Por favor, introduce la fecha de programación.",
        },
        () => {
          refScheduledDate.current?.focus();
        }
      );
      return;
    }

    if (
      Object.values(TYPE_DELIVERY).find((t) => t.id === formData.idTypeDelivery)
        ?.isScheduled &&
      formData.scheduledTime === ""
    ) {
      alert.warning(
        {
          message: "Por favor, introduce la hora de programación.",
        },
        () => {
          refScheduledTime.current?.focus();
        }
      );
      return;
    }

    if (formData.idTypeDocument === "") {
      alert.warning(
        {
          message: "Por favor, selecciona el tipo de documento.",
        },
        () => {
          refTypeDocument.current?.focus();
        }
      );
      return;
    }

    if (formData.document === "") {
      alert.warning(
        {
          message: "Por favor, introduce el número de documento.",
        },
        () => {
          refDocument.current?.focus();
        }
      );
      return;
    }

    if (formData.name === "") {
      alert.warning(
        {
          message: "Por favor, introduce el nombre.",
        },
        () => {
          refName.current?.focus();
        }
      );
      return;
    }

    if (formData.phone === "") {
      alert.warning(
        {
          message: "Por favor, introduce el número de teléfono.",
        },
        () => {
          refPhone.current?.focus();
        }
      );
      return;
    }

    if (formData.whatsapp === "") {
      alert.warning(
        {
          message: "Por favor, introduce el número de WhatsApp.",
        },
        () => {
          refWhastapp.current?.focus();
        }
      );
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert.warning(
        {
          message: "Por favor, introduce el correo electrónico.",
        },
        () => {
          refEmail.current?.focus();
        }
      );
      return;
    }

    if (formData.password === "") {
      alert.warning(
        {
          message: "Por favor, introduce la contraseña.",
        },
        () => {
          refPassword.current?.focus();
        }
      );
      return;
    }

    if (formData.password !== formData.validationPassword) {
      alert.warning(
        {
          message: "Las contraseñas no coinciden.",
        },
        () => {
          refPassword.current?.focus();
        }
      );
      return;
    }

    if (
      (formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_NOW.id ||
        formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_SCHEDULED.id) &&
      formData.address === ""
    ) {
      alert.warning(
        {
          message: "Por favor, introduce la dirección.",
        },
        () => {
          refAddress.current?.focus();
        }
      );
      return;
    }

    if (formData.idBranch === "") {
      alert.warning(
        {
          message: "Por favor, selecciona una sucursal.",
        },
        () => {
          refBranch.current?.focus();
        }
      );
      return;
    }

    if (currency === null) {
      alert.warning({
        message: "No se puedo obtener información de la moneda seleccionada.",
      });
      return;
    }

    const orderData: FormOrder = {
      cliente: {
        idTipoDocumento: formData.idTypeDocument,
        documento: formData.document,
        informacion: formData.name,
        telefono: formData.phone,
        celular: formData.whatsapp,
        email: formData.email,
        clave: formData.password,
        direccion: formData.address,
      },

      idComprobante: paymentReceipt.idPaymentReceipt,
      idMoneda: currency?.idCurrency!,
      idSucursal: formData.idBranch,
      idUsuario: "US0001",
      nota: formData.orderNotes,
      observacion: "",
      instruccion: formData.instructions,

      idTipoEntrega: formData.idTypeDelivery,
      idTipoPedido: Object.values(TYPE_DELIVERY).find(
        (t) => t.id === formData.idTypeDelivery
      )?.isScheduled
        ? "TP0002"
        : "TP0001",
      fechaPedido: formData.scheduledDate,
      horaPedido: formData.scheduledTime,

      entrega:
        formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_NOW.id ||
        formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_SCHEDULED.id
          ? {
              email: formData.email,
              telefono: formData.phone,
              celular: formData.whatsapp,
              direccion: formData.address,
              referencia: formData.reference,
            }
          : null,

      detalles: cart.map((item) => ({
        cantidad: item.quantity,
        codigo: item.code,
        id: item.id,
        idImpuesto: tax.idTax!,
        idMedida: item.measurement?.id!,
        idProducto: item.id,
        imagen: item.image,
        nombre: item.name,
        nombreImpuesto: "",
        nombreMedida: "",
        porcentajeImpuesto: 0,
        precio: item.price,
      })),
    };

    onSubmitOrder(orderData);
  };

  // const isFormValid =
  //   formData.document &&
  //   formData.name &&
  //   formData.phone &&
  //   formData.whatsapp &&
  //   (formData.deliveryType === TYPE_DELIVERY.DELIVERY.id ? formData.address && formData.deliveryZone : true) &&
  //   formData.paymentMethod &&
  //   (formData.orderType === "now" || (formData.scheduledDate && formData.scheduledTime))

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground font-display text-xl">
            Información de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cómo quieres recibir tu pedido */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">
                ¿Cómo quieres recibir tu pedido?
              </h3>

              <RadioGroup
                value={formData.idTypeDelivery}
                onValueChange={(value) => {
                  setFormData({ ...formData, idTypeDelivery: value });
                }}
                className="space-y-3"
              >
                {/* Entrega Inmediata */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Entrega Inmediata
                  </h4>

                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={TYPE_DELIVERY.DELIVERY_NOW.id}
                      id="delivery-now"
                    />
                    <Label
                      htmlFor="delivery-now"
                      className="text-foreground flex items-center cursor-pointer"
                    >
                      {TYPE_DELIVERY.DELIVERY_NOW.icon}
                      <div>
                        <span className="font-medium">
                          {TYPE_DELIVERY.DELIVERY_NOW.name}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {TYPE_DELIVERY.DELIVERY_NOW.description}
                        </span>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={TYPE_DELIVERY.PICKUP_NOW.id}
                      id="pickup-now"
                    />
                    <Label
                      htmlFor="pickup-now"
                      className="text-foreground flex items-center cursor-pointer"
                    >
                      {TYPE_DELIVERY.PICKUP_NOW.icon}
                      <div>
                        <span className="font-medium">
                          {TYPE_DELIVERY.PICKUP_NOW.name}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {TYPE_DELIVERY.PICKUP_NOW.description}
                        </span>
                      </div>
                    </Label>
                  </div>
                </div>

                {/* Entrega Programada */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Entrega Programada
                  </h4>

                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={TYPE_DELIVERY.DELIVERY_SCHEDULED.id}
                      id="delivery-scheduled"
                    />
                    <Label
                      htmlFor="delivery-scheduled"
                      className="text-foreground flex items-center cursor-pointer"
                    >
                      {TYPE_DELIVERY.DELIVERY_SCHEDULED.icon}
                      <div>
                        <span className="font-medium">
                          {TYPE_DELIVERY.DELIVERY_SCHEDULED.name}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {TYPE_DELIVERY.DELIVERY_SCHEDULED.description}
                        </span>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={TYPE_DELIVERY.PICKUP_SCHEDULED.id}
                      id="pickup-scheduled"
                    />
                    <Label
                      htmlFor="pickup-scheduled"
                      className="text-foreground flex items-center cursor-pointer"
                    >
                      {TYPE_DELIVERY.PICKUP_SCHEDULED.icon}
                      <div>
                        <span className="font-medium">
                          {TYPE_DELIVERY.PICKUP_SCHEDULED.name}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {TYPE_DELIVERY.PICKUP_SCHEDULED.description}
                        </span>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {/* Campos de fecha y hora para pedidos programados */}
              {Object.values(TYPE_DELIVERY).find(
                (t) => t.id === formData.idTypeDelivery
              )?.isScheduled && (
                <div className="bg-muted/50 p-4 rounded-lg border border-border/50 ml-6">
                  <h5 className="font-medium text-foreground mb-3">
                    Programar para:
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="scheduledDate"
                        className="text-foreground font-medium text-sm"
                      >
                        Fecha *
                      </Label>
                      <Input
                        id="scheduledDate"
                        ref={refScheduledDate}
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scheduledDate: e.target.value,
                          })
                        }
                        className="bg-background border-border text-foreground mt-2"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="scheduledTime"
                        className="text-foreground font-medium text-sm"
                      >
                        Hora *
                      </Label>
                      <Select
                        value={formData.scheduledTime}
                        onValueChange={(value) =>
                          setFormData({ ...formData, scheduledTime: value })
                        }
                      >
                        <SelectTrigger
                          ref={refScheduledTime}
                          className="bg-background border-border text-foreground mt-2"
                        >
                          <SelectValue placeholder="Seleccionar hora" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border max-h-48">
                          {timeSlots().map((time) => (
                            <SelectItem
                              key={time}
                              value={time}
                              className="text-foreground"
                            >
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Información del cliente */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">
                Datos del Cliente
              </h3>

              <div className="space-y-4">
                <Label className="text-foreground font-medium">
                  Tipo de Documento *
                </Label>
                <Select
                  value={formData.idTypeDocument}
                  onValueChange={(value) =>
                    setFormData({ ...formData, idTypeDocument: value })
                  }
                >
                  <SelectTrigger
                    ref={refTypeDocument}
                    className="bg-muted border-border text-foreground mt-2"
                  >
                    <SelectValue placeholder="Selecciona el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {listTypeDocument.map((typeDoc) => (
                      <SelectItem
                        key={typeDoc.id}
                        value={typeDoc.id}
                        className="text-foreground"
                      >
                        {typeDoc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name" className="text-foreground font-medium">
                  N° de Documento *
                </Label>
                <Input
                  id="document"
                  ref={refDocument}
                  type={isMobile ? "tel" : "text"}
                  value={formData.document}
                  onChange={(e) =>
                    setFormData({ ...formData, document: e.target.value })
                  }
                  onKeyDown={!isMobile ? keyNumberInteger : undefined}
                  className="bg-muted border-border text-foreground mt-2"
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-foreground font-medium">
                  Nombre completo *
                </Label>
                <Input
                  id="name"
                  ref={refName}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-muted border-border text-foreground mt-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-foreground font-medium"
                  >
                    Número de celular *
                  </Label>
                  <Input
                    id="phone"
                    ref={refPhone}
                    type={isMobile ? "tel" : "text"}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    onKeyDown={!isMobile ? keyNumberPhone : undefined}
                    className="bg-muted border-border text-foreground mt-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="whatsapp"
                    className="text-foreground font-medium"
                  >
                    WhatsApp *
                  </Label>
                  <Input
                    id="whatsapp"
                    ref={refWhastapp}
                    type={isMobile ? "tel" : "text"}
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    onKeyDown={!isMobile ? keyNumberPhone : undefined}
                    className="bg-muted border-border text-foreground mt-2"
                    placeholder="Ej: +51999888777"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground font-medium">
                  Correo Electrónico *
                </Label>
                <Input
                  id="email"
                  ref={refEmail}
                  type={isMobile ? "email" : "text"}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-muted border-border text-foreground mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium"
                >
                  Contraseña de la cuenta *
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    ref={refPassword}
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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
                <Label
                  htmlFor="validationPassword"
                  className="text-foreground font-medium"
                >
                  Validar contraseña *
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="validationPassword"
                    ref={refValidationPassword}
                    type={showValidationPassword ? "text" : "password"}
                    value={formData.validationPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validationPassword: e.target.value,
                      })
                    }
                    className="bg-muted border-border text-foreground pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() =>
                      setShowValidationPassword(!showValidationPassword)
                    }
                  >
                    {showValidationPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Dirección de entrega */}
            {(formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_NOW.id ||
              formData.idTypeDelivery ===
                TYPE_DELIVERY.DELIVERY_SCHEDULED.id) && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground font-display">
                  Dirección de Entrega
                </h3>
                <div>
                  <Label
                    htmlFor="address"
                    className="text-foreground font-medium"
                  >
                    Dirección *
                  </Label>
                  <Input
                    id="address"
                    ref={refAddress}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="bg-muted border-border text-foreground mt-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="reference"
                    className="text-foreground font-medium"
                  >
                    Referencia
                  </Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) =>
                      setFormData({ ...formData, reference: e.target.value })
                    }
                    className="bg-muted border-border text-foreground mt-2"
                    placeholder="Ej: Casa azul, portón negro"
                  />
                </div>
                {/* <div>
                  <Label className="text-foreground font-medium">Sucursal *</Label>
                  <Select
                    value={formData.idBranch}
                    onValueChange={(value) => setFormData({ ...formData, idBranch: value })}
                  >
                    <SelectTrigger className="bg-muted border-border text-foreground mt-2">
                      <SelectValue placeholder="Selecciona tu sucursal" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">                    
                      {deliveryZones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id} className="text-foreground">
                          {zone.name} - {formatCurrency(zone.price, currency!.code)} ({zone.time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            )}

            {/* {
              formData.idTypeDelivery === TYPE_DELIVERY.RECOJO_LOCAL.id && ( */}
            <div>
              <Label className="text-foreground font-medium">Sucursal *</Label>
              <Select
                value={formData.idBranch}
                onValueChange={(value) =>
                  setFormData({ ...formData, idBranch: value })
                }
              >
                <SelectTrigger
                  ref={refBranch}
                  className="bg-muted border-border text-foreground mt-2"
                >
                  <SelectValue placeholder="Selecciona tu sucursal" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {branches.map((branch) => (
                    <SelectItem
                      key={branch.id}
                      value={branch.id}
                      className="text-foreground"
                    >
                      {branch.name}
                    </SelectItem>
                  ))}
                  {/* {deliveryZones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id} className="text-foreground">
                          {zone.name} -  {formatCurrency(zone.price, currency!.code)} ({zone.time})
                        </SelectItem>
                        
                      ))} */}
                </SelectContent>
              </Select>
            </div>
            {/* )
            } */}

            {/* Descuento */}
            {/* <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Descuento</h3>
              <div>
                <Label htmlFor="discount" className="text-foreground font-medium">
                  Porcentaje de Descuento
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="bg-muted border-border text-foreground mt-2"
                  placeholder="Ej: 10"
                />
              </div>
            </div> */}

            {/* Método de pago */}
            {/* <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Método de Pago</h3>
              <p className="text-sm text-muted-foreground">
                Los pagos son referenciales. Aún no se aceptan pagos en línea. Al momento de recoger su pedido, se le proporcionará toda la información necesaria para realizar el pago.
              </p>
              <RadioGroup
                value={formData.paymentMethodReference}
                onValueChange={(value) => setFormData({ ...formData, paymentMethodReference: value })}
                className="space-y-3"
              >
                {paymentMethods
                  .filter((method) => method.available)
                  .map((method) => (
                    <div key={method.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="text-foreground flex items-center cursor-pointer">
                        <span className="mr-2 text-lg">{method.icon}</span>
                        {method.name}
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            </div> */}

            {/* Notas del pedido */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">
                Información Adicional
              </h3>
              <div>
                <Label
                  htmlFor="orderNotes"
                  className="text-foreground font-medium"
                >
                  Notas sobre el pedido
                </Label>
                <Textarea
                  id="orderNotes"
                  value={formData.orderNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, orderNotes: e.target.value })
                  }
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground mt-2"
                  placeholder="Ej: Incluir adicionales..."
                  rows={3}
                />
              </div>
              <div>
                <Label
                  htmlFor="instructions"
                  className="text-foreground font-medium"
                >
                  Instrucciones de entrega
                </Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground mt-2"
                  placeholder="Instrucciones especiales para la entrega..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 bg-transparent"
              >
                Volver
              </Button>
              <Button
                type="submit"
                // disabled={!isFormValid}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Confirmar Pedido
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground font-display text-xl">
            Resumen del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-border"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-foreground font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-primary mt-1">
                        Nota: {item.notes}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-primary font-bold font-display">
                  {formatCurrency(item.price * item.quantity, currency!.code)}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex justify-between text-foreground">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal, currency!.code)}</span>
            </div>
            {/* {discountPercentage > 0 && (
              <div className="flex justify-between text-foreground">
                <span>Descuento ({discountPercentage}%):</span>
                <span>-{formatCurrency((subtotal * discountPercentage / 100), currency!.code)}</span>
              </div>
            )} */}
            {/* <div className="flex justify-between text-foreground">
              <span>Subtotal con descuento:</span>
              <span>{formatCurrency(discountedSubtotal, currency!.code)}</span>
            </div> */}
            {/* {formData.deliveryType === TYPE_DELIVERY.DELIVERY.id && (
              <div className="flex justify-between text-foreground">
                <span>Delivery:</span>
                <span>{formatCurrency(deliveryFee, currency!.code)}</span>
              </div>
            )} */}
            {/* <div className="flex justify-between text-xl font-bold text-primary pt-3 border-t border-border font-display">
              <span>Total:</span>
              <span>{formatCurrency(total, currency!.code)}</span>
            </div> */}
          </div>
          {/* Información de entrega */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
              <div className="flex items-center mb-2">
                {
                  Object.values(TYPE_DELIVERY).find(
                    (t) => t.id === formData.idTypeDelivery
                  )?.icon
                }
                <span className="font-medium text-foreground">
                  {
                    Object.values(TYPE_DELIVERY).find(
                      (t) => t.id === formData.idTypeDelivery
                    )?.name
                  }
                </span>
              </div>

              {Object.values(TYPE_DELIVERY).find(
                (t) => t.id === formData.idTypeDelivery
              )?.isScheduled ? (
                <p className="text-foreground text-sm">
                  <strong>Programado para:</strong>{" "}
                  <span className="text-primary">
                    {new Date(formData.scheduledDate).toLocaleDateString()} a
                    las {formData.scheduledTime}
                  </span>
                </p>
              ) : (
                <p className="text-foreground text-sm">
                  <strong>Tiempo estimado:</strong>{" "}
                  <span className="text-primary">
                    {
                      Object.values(TYPE_DELIVERY).find(
                        (t) => t.id === formData.idTypeDelivery
                      )?.description
                    }
                  </span>
                </p>
              )}

              {(formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_NOW.id ||
                formData.idTypeDelivery ===
                  TYPE_DELIVERY.DELIVERY_SCHEDULED.id) && (
                <p className="text-foreground text-sm mt-1">
                  <strong>Dirección:</strong>{" "}
                  <span className="text-primary">{formData.address}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
