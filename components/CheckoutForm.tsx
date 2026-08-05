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
import { Branch, Cart, Currency } from "@/types/api-type";
import {
  TYPE_DELIVERY,
} from "@/constants/type-delivery";
import {
  currentDate,
  formatCurrency,
  timeSlots,
} from "@/lib/utils";
import Image from "next/image";
import { getPaymentReceipts } from "@/lib/api";
import { useAlert } from "@/hooks/use-alert";
import { useAuth } from "@/context/AuthContext";
import { FormOrder } from "@/types/form";

interface CheckoutFormProps {
  branch: Branch;
  branches: Branch[];
  currency: Currency;
  cart: Cart[];
  onSubmitOrder: (orderData: FormOrder) => void;
}

interface FormDataProps {
  idTypeDelivery: string;


  // DELIVERY
  address: string;
  reference: string;


  // RECOJO_LOCAL
  idBranch: string;
  personPickup: string;
  documentPickup: string;


  // PROGRAMADO
  scheduledDate: string;
  scheduledTime: string;


  // ENVIO AGENCIA
  agency: string;
  destination: string;
  receiverName: string;
  receiverDocument: string;
  receiverPhone: string;


  // Otros
  paymentMethodReference: string;
  orderNotes: string;
  instructions: string;
}

export function CheckoutForm({
  branch,
  branches,
  currency,
  cart,
  onSubmitOrder,
}: CheckoutFormProps) {
  const alert = useAlert();
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormDataProps>({
    idTypeDelivery: TYPE_DELIVERY.HOME_DELIVERY.id,


    address: user?.address || "",
    reference: "",


    idBranch: branch.id,

    personPickup: "",
    documentPickup: "",


    scheduledDate: currentDate(),
    scheduledTime: "",


    agency: "",
    destination: "",
    receiverName: "",
    receiverDocument: "",
    receiverPhone: "",


    paymentMethodReference: "",
    orderNotes: "",
    instructions: ""
  });

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
      alert.warning({
        message:
          "No se encontró un comprobante preferido para la sucursal, comunique con el administrador.",
      });
      return;
    }

    // // PROGRAMADO
    // if (
    //   formData.idTypeDelivery === TYPE_DELIVERY.PROGRAMADO.id &&
    //   formData.scheduledDate === ""
    // ) {

    //   alert.warning({
    //     message: "Por favor, introduce la fecha de programación.",
    //   }, () => {
    //     refScheduledDate.current?.focus();
    //   });
    //   return;
    // }

    // if (
    //   formData.idTypeDelivery === TYPE_DELIVERY.PROGRAMADO.id &&
    //   formData.scheduledTime === ""
    // ) {

    //   alert.warning({
    //     message: "Por favor, introduce la hora de programación.",
    //   }, () => {
    //     refScheduledTime.current?.focus();
    //   });

    //   return;
    // }

    // // DATOS CLIENTE
    // if (formData.idTypeDocument === "") {
    //   alert.warning({
    //     message: "Por favor, selecciona el tipo de documento.",
    //   }, () => {
    //     refTypeDocument.current?.focus();
    //   });

    //   return;
    // }

    // if (formData.document === "") {
    //   alert.warning({
    //     message: "Por favor, introduce el número de documento.",
    //   }, () => {
    //     refDocument.current?.focus();
    //   });
    //   return;
    // }

    // if (formData.name === "") {
    //   alert.warning({
    //     message: "Por favor, introduce el nombre.",
    //   }, () => {
    //     refName.current?.focus();
    //   });
    //   return;
    // }

    // if (formData.phone === "") {
    //   alert.warning({
    //     message: "Por favor, introduce el número de teléfono.",
    //   }, () => {
    //     refPhone.current?.focus();
    //   });
    //   return;
    // }

    // if (formData.whatsapp === "") {

    //   alert.warning({
    //     message: "Por favor, introduce el número de WhatsApp.",
    //   }, () => {
    //     refWhastapp.current?.focus();
    //   });
    //   return;
    // }

    // if (!isValidEmail(formData.email)) {
    //   alert.warning({
    //     message: "Por favor, introduce el correo electrónico.",
    //   }, () => {
    //     refEmail.current?.focus();
    //   });
    //   return;
    // }

    // if (formData.password === "") {
    //   alert.warning({
    //     message: "Por favor, introduce la contraseña.",
    //   }, () => {
    //     refPassword.current?.focus();
    //   });
    //   return;
    // }

    // if (formData.password !== formData.validationPassword) {
    //   alert.warning({
    //     message: "Las contraseñas no coinciden.",
    //   }, () => {
    //     refPassword.current?.focus();
    //   });
    //   return;
    // }

    // // DELIVERY Y PROGRAMADO necesitan dirección
    // if (
    //   (
    //     formData.idTypeDelivery === TYPE_DELIVERY.DOMICILIO.id ||
    //     formData.idTypeDelivery === TYPE_DELIVERY.PROGRAMADO.id
    //   )
    //   &&
    //   formData.address === ""
    // ) {
    //   alert.warning({
    //     message: "Por favor, introduce la dirección.",
    //   }, () => {
    //     refAddress.current?.focus();
    //   });
    //   return;
    // }

    // // RECOJO LOCAL
    // if (
    //   formData.idTypeDelivery === TYPE_DELIVERY.RECOJO_LOCAL.id &&
    //   formData.idBranch === ""
    // ) {
    //   alert.warning({
    //     message: "Por favor, selecciona el local de recojo.",
    //   }, () => {
    //     refBranch.current?.focus();
    //   });

    //   return;
    // }

    // // ENVIO AGENCIA

    // if (
    //   formData.idTypeDelivery === TYPE_DELIVERY.ENVIO_AGENCIA.id &&
    //   formData.destination === ""
    // ) {
    //   alert.warning({
    //     message: "Por favor, introduce el destino.",
    //   });
    //   return;
    // }

    // if (currency === null) {
    //   alert.warning({
    //     message:
    //       "No se pudo obtener información de la moneda seleccionada.",
    //   });
    //   return;
    // }

    // const orderData: FormOrder = {
    //   cliente: {
    //     idTipoDocumento: formData.idTypeDocument,
    //     documento: formData.document,
    //     informacion: formData.name,
    //     telefono: formData.phone,
    //     celular: formData.whatsapp,
    //     email: formData.email,
    //     clave: formData.password,
    //     direccion: formData.address,

    //   },

    //   idComprobante: paymentReceipt.idPaymentReceipt,
    //   idMoneda: currency.idCurrency!,
    //   idSucursal: formData.idBranch,
    //   idUsuario: "US0001",
    //   nota: formData.orderNotes,
    //   observacion: "",
    //   instruccion: formData.instructions,
    //   idTipoEntrega: formData.idTypeDelivery,

    //   // Ya no depende de si es programado
    //   idTipoPedido: "TP0001",

    //   fechaPedido:
    //     formData.idTypeDelivery === TYPE_DELIVERY.PROGRAMADO.id
    //       ? formData.scheduledDate
    //       : "",

    //   horaPedido:
    //     formData.idTypeDelivery === TYPE_DELIVERY.PROGRAMADO.id
    //       ? formData.scheduledTime
    //       : "",

    //   entrega: {
    //     tipo: formData.idTypeDelivery,
    //     // DELIVERY / PROGRAMADO
    //     direccion:
    //       (
    //         formData.idTypeDelivery === TYPE_DELIVERY.DOMICILIO.id ||
    //         formData.idTypeDelivery === TYPE_DELIVERY.PROGRAMADO.id
    //       )
    //         ? {
    //           email: formData.email,
    //           telefono: formData.phone,
    //           celular: formData.whatsapp,
    //           direccion: formData.address,
    //           referencia: formData.reference,
    //         }
    //         : null,

    //     // RECOJO LOCAL
    //     recojo:
    //       formData.idTypeDelivery === TYPE_DELIVERY.RECOJO_LOCAL.id
    //         ? {
    //           sucursal: formData.idBranch,
    //           persona: formData.personPickup,
    //           documento: formData.documentPickup,
    //         }
    //         : null,

    //     // ENVIO AGENCIA
    //     agencia:
    //       formData.idTypeDelivery === TYPE_DELIVERY.ENVIO_AGENCIA.id
    //         ? {
    //           nombre: formData.agency,
    //           destino: formData.destination,
    //           receptor: formData.receiverName,
    //           documento: formData.receiverDocument,
    //           telefono: formData.receiverPhone,
    //         }
    //         : null,

    //     // PROGRAMACION
    //     programacion:
    //       formData.idTypeDelivery === TYPE_DELIVERY.PROGRAMADO.id
    //         ? {
    //           fecha: formData.scheduledDate,
    //           hora: formData.scheduledTime,
    //         }
    //         : null,
    //   },

    //   detalles: cart.map((item) => ({
    //     cantidad: item.quantity,
    //     codigo: item.code,
    //     id: item.id,
    //     idImpuesto: tax.idTax!,
    //     idMedida: item.measurement?.id!,
    //     idProducto: item.id,
    //     imagen: item.image,
    //     nombre: item.name,
    //     nombreImpuesto: "",
    //     nombreMedida: "",
    //     porcentajeImpuesto: 0,
    //     precio: item.price,
    //   })),
    // };

    // onSubmitOrder(orderData);

    const orderData: FormOrder = {
      idSucursal: formData.idBranch,
      idUsuario: "US0001",
      idMoneda: currency.idCurrency!,
      idComprobante: paymentReceipt.idPaymentReceipt,
      nota: formData.orderNotes,
      instruccion: formData.instructions
    }

    onSubmitOrder(orderData);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 py-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Información de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cómo quieres recibir tu pedido */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                ¿Cómo quieres recibir tu pedido?
              </h3>

              <TypeDeliverComponent
                formData={formData}
                setFormData={setFormData}
              />

              {
                formData.idTypeDelivery === TYPE_DELIVERY.HOME_DELIVERY.id && (
                  <TypeDeliveryDomicilioComponent
                    formData={formData}
                    setFormData={setFormData}
                  />

                )
              }

              {
                formData.idTypeDelivery === TYPE_DELIVERY.STORE_PICKUP.id && (
                  <TypeDeliveryRecojoLocalComponent
                    branches={branches}
                    formData={formData}
                    setFormData={setFormData}
                  />

                )
              }

              {
                formData.idTypeDelivery === TYPE_DELIVERY.SCHEDULED_DELIVERY.id && (
                  <TypeDeliveryProgramadoComponent
                    refScheduledDate={refScheduledDate}
                    refScheduledTime={refScheduledTime}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )
              }

              {
                formData.idTypeDelivery === TYPE_DELIVERY.SHIPPING_AGENCY.id && (
                  <TypeDeliveryEnvioAgenciaComponent
                    formData={formData}
                    setFormData={setFormData}
                  />

                )
              }
            </div>

            {/* Notas del pedido */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
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

            {/* Botones de acción */}
            <div className="flex gap-4 pt-4">             
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
          <CardTitle className="text-foreground text-xl">
            Resumen del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Detakke del pedido */}
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
                <span className="text-primary font-bold">
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
          </div>

          {/* Información de entrega */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
              <div className="flex flex-col items-center mb-2">
                {
                  Object.values(TYPE_DELIVERY).find(
                    (t) => t.id === formData.idTypeDelivery
                  )?.icon
                }
                <p className="font-medium text-foreground">
                  {
                    Object.values(TYPE_DELIVERY).find(
                      (t) => t.id === formData.idTypeDelivery
                    )?.name
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {Object.values(TYPE_DELIVERY).find(
                    (t) => t.id === formData.idTypeDelivery
                  )?.description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const TypeDeliverComponent = ({
  formData,
  setFormData
}: {
  formData: FormDataProps;
  setFormData: (value: FormDataProps) => void;
}) => {
  return (
    <RadioGroup
      value={formData.idTypeDelivery}
      onValueChange={(value) =>
        setFormData({
          ...formData,
          idTypeDelivery: value
        })
      }
      className="space-y-3"
    >
      {
        Object.values(TYPE_DELIVERY).map((delivery) => (
          <div
            key={delivery.id}
            className="flex items-center space-x-3"
          >
            <RadioGroupItem
              value={delivery.id}
              id={delivery.id}
            />
            <Label
              htmlFor={delivery.id}
              className="text-foreground flex items-center cursor-pointer"
            >
              {delivery.icon}
              <div>
                <span className="font-medium">
                  {delivery.name}
                </span>

                <span className="block text-sm text-muted-foreground">
                  {delivery.description}
                </span>
              </div>
            </Label>
          </div>
        ))
      }
    </RadioGroup>
  );
}

const TypeDeliveryDomicilioComponent = ({
  formData,
  setFormData
}: {
  formData: FormDataProps;
  setFormData: (value: FormDataProps) => void;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        Dirección de entrega
      </h3>

      <div>
        <Label>
          Dirección <span className="text-red-500 text-base">*</span>
        </Label>

        <Input
          placeholder="Dirección de entrega"
          value={formData.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: e.target.value
            })
          }
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>

      <div>
        <Label>
          Referencia
        </Label>
        <Input
          placeholder="Ej: Casa azul, portón negro"
          value={formData.reference}
          onChange={(e) =>
            setFormData({
              ...formData,
              reference: e.target.value
            })
          }
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>
    </div>
  );
}

const TypeDeliveryRecojoLocalComponent = ({
  branches,
  formData,
  setFormData
}: {
  branches: Branch[];
  formData: FormDataProps;
  setFormData: (value: FormDataProps) => void;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        Datos de recojo
      </h3>
      <div>
        <Label>
          Local
        </Label>

        <Select
          value={formData.idBranch}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              idBranch: value
            })
          }
        >
          <SelectTrigger className="bg-muted border-border text-foreground mt-2">
            <SelectValue placeholder="Seleccione local" />
          </SelectTrigger>

          <SelectContent>
            {
              branches.map(branch => (
                <SelectItem
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>
          Datos de la persona <span className="text-red-500 text-base">*</span>
        </Label>
        <Input
          placeholder="Persona que recoge"
          value={formData.personPickup}
          onChange={(e) =>
            setFormData({
              ...formData,
              personPickup: e.target.value
            })
          }
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>

      <div>
        <Label>
          Documento <span className="text-red-500 text-base">*</span>
        </Label>
        <Input
          placeholder="Documento"
          value={formData.documentPickup}
          onChange={(e) =>
            setFormData({
              ...formData,
              documentPickup: e.target.value
            })
          }
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>
    </div>
  );
}

const TypeDeliveryProgramadoComponent = ({
  refScheduledDate,
  refScheduledTime,
  formData,
  setFormData
}: {
  refScheduledDate: React.RefObject<HTMLInputElement | null>;
  refScheduledTime: React.RefObject<HTMLButtonElement | null>;
  formData: FormDataProps;
  setFormData: (value: FormDataProps) => void;
}) => {
  return (
    <div className="space-y-4">

      <h3 className="font-semibold text-foreground">
        Programar entrega
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="scheduledDate"
            className="text-foreground font-medium"
          >
            Fecha <span className="text-red-500 text-base">*</span>
          </Label>

          <Input
            id="scheduledDate"
            ref={refScheduledDate}
            type="date"
            value={formData.scheduledDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                scheduledDate: e.target.value
              })
            }
            min={new Date().toISOString().split("T")[0]}
            className="bg-muted border-border text-foreground mt-2"
          />
        </div>

        <div>
          <Label
            htmlFor="scheduledTime"
            className="text-foreground font-medium"
          >
            Hora <span className="text-red-500 text-base">*</span>
          </Label>

          <Select
            value={formData.scheduledTime}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                scheduledTime: value
              })
            }
          >
            <SelectTrigger
              ref={refScheduledTime}
              className="bg-muted border-border text-foreground mt-2"
            >
              <SelectValue placeholder="Seleccionar hora" />
            </SelectTrigger>

            <SelectContent>
              {
                timeSlots().map(time => (

                  <SelectItem
                    key={time}
                    value={time}
                  >
                    {time}
                  </SelectItem>

                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>
          Dirección <span className="text-red-500 text-base">*</span>
        </Label>

        <Input
          value={formData.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: e.target.value
            })
          }
          className="bg-muted border-border text-foreground mt-2"
          placeholder="Dirección de entrega"
        />
      </div>

      <div>
        <Label>
          Referencia
        </Label>

        <Input
          value={formData.reference}
          onChange={(e) =>
            setFormData({
              ...formData,
              reference: e.target.value
            })
          }
          className="bg-muted border-border text-foreground mt-2"
          placeholder="Ej: Casa azul, portón negro"
        />
      </div>
    </div>
  );
}

const TypeDeliveryEnvioAgenciaComponent = ({
  formData,
  setFormData
}: {
  formData: FormDataProps;
  setFormData: (value: FormDataProps) => void;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">
        Datos de envío por agencia
      </h3>

      <div>
        <Label>
          Agencia <span className="text-red-500 text-base">*</span>
        </Label>

        <Select
          value={formData.agency}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              agency: value
            })
          }
        >
          <SelectTrigger className="bg-muted border-border text-foreground mt-2">
            <SelectValue
              placeholder="Seleccione agencia"
            />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="SHALOM">
              Shalom
            </SelectItem>
            <SelectItem value="OLVA">
              Olva Courier
            </SelectItem>
            <SelectItem value="CRUZ_DEL_SUR">
              Cruz del Sur
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>
          Destino <span className="text-red-500 text-base">*</span>
        </Label>
        <Input
          value={formData.destination}
          onChange={(e) =>
            setFormData({
              ...formData,
              destination: e.target.value
            })
          }
          placeholder="Ciudad / provincia"
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>

      <div>
        <Label>
          Persona que recibe <span className="text-red-500 text-base">*</span>
        </Label>

        <Input
          value={formData.receiverName}
          onChange={(e) =>
            setFormData({
              ...formData,
              receiverName: e.target.value
            })
          }
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>
            Documento
          </Label>

          <Input
            value={formData.receiverDocument}
            onChange={(e) =>
              setFormData({
                ...formData,
                receiverDocument: e.target.value
              })
            }
            className="bg-muted border-border text-foreground mt-2"
          />
        </div>

        <div>
          <Label>
            Teléfono
          </Label>

          <Input
            value={formData.receiverPhone}
            onChange={(e) =>
              setFormData({
                ...formData,
                receiverPhone: e.target.value
              })
            }
            className="bg-muted border-border text-foreground mt-2"
          />
        </div>
      </div>

      <div>
        <Label>
          Observación para agencia
        </Label>

        <Textarea
          value={formData.instructions}
          onChange={(e) =>
            setFormData({
              ...formData,
              instructions: e.target.value
            })
          }
          placeholder="Indicaciones adicionales"
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>
    </div>
  );
}