// components/CheckoutForm.tsx

import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Agency, Branch, PaymentReceipt, Person, Tax } from "@/types/api-type";
import {
  TYPE_DELIVERY,
} from "@/constants/type-delivery";
import {
  currentDate,
  formatCurrency,
  timeSlots,
} from "@/lib/utils";
import Image from "next/image";
import { useAlert } from "@/hooks/use-alert";
import { FormOrder } from "@/types/form";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Lock } from "lucide-react";

interface CheckoutFormProps {
  taxes: Tax[];
  branch: Branch;
  branches: Branch[];
  receipts: PaymentReceipt[];
  person: Person;
  agencies: Agency[];
  onSubmitOrder: (orderData: FormOrder) => void;
}

interface FormDataProps {
  idTypeDelivery: string;

  idBranch: string;

  orderShipping: {
    // DELIVERY
    address: string | null;
    reference: string | null;

    // RECOJO_LOCAL
    idBranch: string | null;

    // PROGRAMADO
    scheduledDate: string | null;
    scheduledTime: string | null;

    // ENVIO AGENCIA
    idAgency: string | null;
    destination: string | null;
    receiverName: string | null;
  };

  // Método de pago
  paymentMethod: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
  cardHolderName: string;

  // Campos para Transferencia Bancaria
  bankReceipt: File | null;

  // Campos para Billetera Digital (Yape/Plin)
  walletType: string; // "yape" o "plin"
  walletReceipt: File | null;

  // Otros
  orderNotes: string;
}

export function CheckoutForm({
  taxes,
  branch,
  branches,
  receipts,
  person,
  agencies,
  onSubmitOrder,
}: CheckoutFormProps) {
  const { cart } = useCart();
  const { currency } = useCurrency();
  const alert = useAlert();

  const [formData, setFormData] = useState<FormDataProps>({
    idTypeDelivery: TYPE_DELIVERY.HOME_DELIVERY.id,

    // Recojo en local
    idBranch: branch.idBranch,

    orderShipping: {
      // Envío a domicilio
      address: null,
      reference: null,

      // Recojo en local
      idBranch: null,

      // Entrega programada
      scheduledDate: null,
      scheduledTime: null,

      // Envío por agencia
      idAgency: null,
      destination: null,
      receiverName: null,
    },

    // Método de pago
    paymentMethod: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    cardHolderName: "",

    // Campos para Transferencia Bancaria
    bankReceipt: null,

    // Campos para Billetera Digital (Yape/Plin)
    walletType: "",
    walletReceipt: null,

    // Otros
    orderNotes: "",
  });

  const refAddress = React.useRef<HTMLInputElement>(null);
  const refBranch = React.useRef<HTMLButtonElement>(null);
  const refScheduledDate = React.useRef<HTMLInputElement>(null);
  const refScheduledTime = React.useRef<HTMLButtonElement>(null);
  const refAgency = React.useRef<HTMLButtonElement>(null);
  const refDestination = React.useRef<HTMLInputElement>(null);
  const refReceiverName = React.useRef<HTMLInputElement>(null);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (branches.length === 1) {
      setFormData((prev) => ({
        ...prev,
        idBranch: branches[0].idBranch,
      }));
    }
  }, [branches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentReceipt = receipts.find((paymentReceipt) => paymentReceipt.prefered === true);

    if (!paymentReceipt) {
      alert.warning({
        message:
          "No se encontró un comprobante preferido para la sucursal, comunique con el administrador.",
      });
      return;
    }

    // Envío a domicilio
    if (TYPE_DELIVERY.HOME_DELIVERY.id === formData.idTypeDelivery && !formData.orderShipping.address) {
      alert.warning({
        message: "Por favor, introduce la dirección de entrega.",
      }, () => {
        refAddress.current?.focus();
      });
      return;
    }

    // Recojo en local
    if (TYPE_DELIVERY.STORE_PICKUP.id === formData.idTypeDelivery && !formData.orderShipping.idBranch) {
      alert.warning({
        message: "Por favor, selecciona el local de recojo.",
      }, () => {
        refBranch.current?.focus();
      });
      return;
    }

    // Entrega programada
    if (TYPE_DELIVERY.SCHEDULED_DELIVERY.id === formData.idTypeDelivery && !formData.orderShipping.scheduledDate) {
      alert.warning({
        message: "Por favor, introduce la fecha de programación.",
      }, () => {
        refScheduledDate.current?.focus();
      });
      return;
    }

    if (TYPE_DELIVERY.SCHEDULED_DELIVERY.id === formData.idTypeDelivery && !formData.orderShipping.scheduledTime) {
      alert.warning({
        message: "Por favor, introduce la hora de programación.",
      }, () => {
        refScheduledTime.current?.focus();
      });
      return;
    }

    if (TYPE_DELIVERY.SCHEDULED_DELIVERY.id === formData.idTypeDelivery && !formData.orderShipping.address) {
      alert.warning({
        message: "Por favor, introduce la dirección de entrega.",
      }, () => {
        refAddress.current?.focus();
      });
      return;
    }

    // Envío por agencia
    if (TYPE_DELIVERY.SHIPPING_AGENCY.id === formData.idTypeDelivery && !formData.orderShipping.idAgency) {
      alert.warning({
        message: "Por favor, introduce el nombre de la agencia.",
      }, () => {
        refAgency.current?.focus();
      });
      return;
    }

    if (TYPE_DELIVERY.SHIPPING_AGENCY.id === formData.idTypeDelivery && !formData.orderShipping.destination) {
      alert.warning({
        message: "Por favor, introduce el destino.",
      }, () => {
        refDestination.current?.focus();
      });
      return;
    }

    if (TYPE_DELIVERY.SHIPPING_AGENCY.id === formData.idTypeDelivery && !formData.orderShipping.receiverName) {
      alert.warning({
        message: "Por favor, introduce el nombre del receptor.",
      }, () => {
        refReceiverName.current?.focus();
      });
      return;
    }

    const idImpuesto = taxes.find(tax => tax.prefered === true)?.idTax!;

    if (!idImpuesto) {
      alert.warning({
        message: "No se encontró un impuesto preferido, comunique con el administrador.",
      });
      return;
    }

    const accept = await alert.question({
      title: "Aceptar pago",
      message: "¿Está seguro de que desea de confirmar el pedido?",
    });

    if (!accept) {
      return;
    }

    const orderData: FormOrder = {
      idTipoPedido: formData.idTypeDelivery,
      pedidoEnvio: {
        direccion: formData.orderShipping.address,
        referencia: formData.orderShipping.reference,
        idSucursal: formData.orderShipping.idBranch,
        fechaPedido: formData.orderShipping.scheduledDate,
        horaPedido: formData.orderShipping.scheduledTime,
        idAgencia: formData.orderShipping.idAgency,
        destino: formData.orderShipping.destination,
        receptor: formData.orderShipping.receiverName,
      },
      idSucursal: formData.idBranch,
      idUsuario: "US0001",
      idMoneda: currency.idCurrency!,
      idComprobante: paymentReceipt.idPaymentReceipt,
      idCliente: person.idPerson!,
      nota: formData.orderNotes,
      detalles: cart.map((item) => ({
        idProducto: item.idProduct,
        idMedida: item.measure?.id!,
        precio: item.price,
        cantidad: item.quantity,
        idImpuesto: idImpuesto,
      })),
    }

    onSubmitOrder(orderData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8 py-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl">
            Información de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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
                    refAddress={refAddress}
                    formData={formData}
                    setFormData={setFormData}
                  />

                )
              }

              {
                formData.idTypeDelivery === TYPE_DELIVERY.STORE_PICKUP.id && (
                  <TypeDeliveryRecojoLocalComponent
                    refBranch={refBranch}
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
                    refAddress={refAddress}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )
              }

              {
                formData.idTypeDelivery === TYPE_DELIVERY.SHIPPING_AGENCY.id && (
                  <TypeDeliveryEnvioAgenciaComponent
                    refAgency={refAgency}
                    refDestination={refDestination}
                    refReceiverName={refReceiverName}
                    agencies={agencies}
                    formData={formData}
                    setFormData={setFormData}
                  />

                )
              }
            </div>

            {/* Metodo de pago */}
            {/* <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Método de Pago</h3>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                className="space-y-3"
              >
                {[
                  {
                    id: "cash",
                    name: "Efectivo",
                    icon: "💵",
                    color: "bg-green-100 text-green-800",
                    borderColor: "border-green-200",
                    hoverColor: "hover:bg-green-200",
                    available: true,
                  },
                  {
                    "id": "card",
                    "name": "Tarjeta",
                    "icon": "💳",
                    color: "bg-blue-100 text-blue-800",
                    borderColor: "border-blue-200",
                    hoverColor: "hover:bg-blue-200",
                    "available": true
                  },
                  {
                    id: "bank_transfer",
                    name: "Transferencia Bancaria",
                    icon: "🏦",
                    color: "bg-blue-100 text-blue-800",
                    borderColor: "border-blue-200",
                    hoverColor: "hover:bg-blue-200",
                    available: true,
                  },
                  {
                    id: "digital_wallet",
                    name: "Billetera Digital",
                    icon: "📱",
                    color: "bg-purple-100 text-purple-800",
                    borderColor: "border-purple-200",
                    hoverColor: "hover:bg-purple-200",
                    available: true,
                  },
                ]
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

              {formData.paymentMethod === "card" && (
                <CardPaymentComponent formData={formData} setFormData={setFormData} />
              )}

              {formData.paymentMethod === "bank_transfer" && (
                <BankTransferComponent formData={formData} setFormData={setFormData} />
              )}

              {formData.paymentMethod === "digital_wallet" && (
                <DigitalWalletComponent formData={formData} setFormData={setFormData} />
              )}

              {formData.paymentMethod === "cash" && <CashPaymentComponent />}
            </div> */}

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
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            // disabled={!isFormValid}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Confirmar Pedido
          </Button>
        </CardFooter>
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
                      {item.quantity} x {formatCurrency(item.price, currency!.code)}
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
    </form>
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
  refAddress,
  formData,
  setFormData
}: {
  refAddress: React.RefObject<HTMLInputElement | null>;
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
          ref={refAddress}
          placeholder="Dirección de entrega"
          value={formData.orderShipping.address ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              orderShipping: {
                ...formData.orderShipping,
                address: e.target.value
              }
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
          value={formData.orderShipping.reference ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              orderShipping: {
                ...formData.orderShipping,
                reference: e.target.value
              }
            })
          }
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>
    </div>
  );
}

const TypeDeliveryRecojoLocalComponent = ({
  refBranch,
  branches,
  formData,
  setFormData
}: {
  refBranch: React.RefObject<HTMLButtonElement | null>;
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
          Local <span className="text-red-500 text-base">*</span>
        </Label>

        <Select
          value={formData.orderShipping.idBranch ?? ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              orderShipping: {
                ...formData.orderShipping,
                idBranch: value
              }
            })
          }
        >
          <SelectTrigger
            ref={refBranch}
            className="bg-muted border-border text-foreground mt-2">
            <SelectValue
              placeholder="Seleccione local"
            />
          </SelectTrigger>

          <SelectContent>
            {
              branches.map(branch => (
                <SelectItem
                  key={branch.idBranch}
                  value={branch.idBranch}
                >
                  {branch.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

const TypeDeliveryProgramadoComponent = ({
  refScheduledDate,
  refScheduledTime,
  refAddress,
  formData,
  setFormData
}: {
  refScheduledDate: React.RefObject<HTMLInputElement | null>;
  refScheduledTime: React.RefObject<HTMLButtonElement | null>;
  refAddress: React.RefObject<HTMLInputElement | null>;
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
            value={formData.orderShipping.scheduledDate ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                orderShipping: {
                  ...formData.orderShipping,
                  scheduledDate: e.target.value
                }
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
            value={formData.orderShipping.scheduledTime ?? ""}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                orderShipping: {
                  ...formData.orderShipping,
                  scheduledTime: value
                }
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
          ref={refAddress}
          value={formData.orderShipping.address ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              orderShipping: {
                ...formData.orderShipping,
                address: e.target.value
              }
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
          value={formData.orderShipping.reference ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              orderShipping: {
                ...formData.orderShipping,
                reference: e.target.value
              }
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
  refAgency,
  refDestination,
  refReceiverName,
  agencies,
  formData,
  setFormData
}: {
  refAgency: React.RefObject<HTMLButtonElement | null>;
  refDestination: React.RefObject<HTMLInputElement | null>;
  refReceiverName: React.RefObject<HTMLInputElement | null>;
  agencies: Agency[];
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
          value={formData.orderShipping.idAgency ?? ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              orderShipping: {
                ...formData.orderShipping,
                idAgency: value
              }
            })
          }
        >
          <SelectTrigger
            ref={refAgency}
            className="bg-muted border-border text-foreground mt-2">
            <SelectValue
              placeholder="Seleccione agencia"
            />
          </SelectTrigger>

          <SelectContent>
            {
              agencies.map(agency => (
                <SelectItem
                  key={agency.idAgency}
                  value={agency.idAgency.toString()}
                >
                  {agency.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>
          Destino <span className="text-red-500 text-base">*</span>
        </Label>
        <Input
          ref={refDestination}
          value={formData.orderShipping.destination ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              orderShipping: {
                ...formData.orderShipping,
                destination: e.target.value
              }
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
          ref={refReceiverName}
          placeholder="Persona que recoge"
          value={formData.orderShipping.receiverName ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              orderShipping: {
                ...formData.orderShipping,
                receiverName: e.target.value
              }
            })
          }
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>
    </div>
  );
}

const CardPaymentComponent = ({
  formData,
  setFormData,
}: {
  formData: FormDataProps;
  setFormData: (value: FormDataProps) => void;
}) => {
  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border/50">
      <h4 className="font-semibold text-foreground">Datos de la Tarjeta</h4>

      <div>
        <Label htmlFor="cardNumber" className="text-foreground font-medium">
          Número de Tarjeta
        </Label>
        <Input
          id="cardNumber"
          value={formData.cardNumber}
          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
          placeholder="1234 5678 9012 3456"
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cardExpiry" className="text-foreground font-medium">
            Fecha de Expiración
          </Label>
          <Input
            id="cardExpiry"
            value={formData.cardExpiry}
            onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
            placeholder="MM/AA"
            className="bg-muted border-border text-foreground mt-2"
          />
        </div>
        <div>
          <Label htmlFor="cardCVV" className="text-foreground font-medium">
            CVV
          </Label>
          <Input
            id="cardCVV"
            value={formData.cardCVV}
            onChange={(e) => setFormData({ ...formData, cardCVV: e.target.value })}
            placeholder="123"
            className="bg-muted border-border text-foreground mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="cardHolderName" className="text-foreground font-medium">
          Nombre del Titular
        </Label>
        <Input
          id="cardHolderName"
          value={formData.cardHolderName}
          onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
          placeholder="Nombre completo"
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>

      <div className="flex items-center text-muted-foreground">
        <Lock className="w-4 h-4 mr-2" />
        <span className=" text-sm">
          Tus datos de pago están seguros y encriptados
        </span>
      </div>
    </div>
  );
};

const DigitalWalletComponent = ({
  formData,
  setFormData,
}: {
  formData: FormDataProps;
  setFormData: (value: FormDataProps) => void;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, walletReceipt: e.target.files![0] });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border/50">
      <h4 className="font-semibold text-foreground">Billetera Digital</h4>
      <p className="text-sm text-muted-foreground">
        Escanea nuestro código QR con tu aplicación de pago y sube una captura de pantalla del pago realizado.
      </p>

      <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="w-32 h-32 bg-yellow-100 rounded-lg flex flex-col items-center justify-center">
          <span className="text-2xl">📱</span>
          <p className="text-sm font-medium">Código QR</p>
          <p className="text-xs text-muted-foreground">Escanea para pagar</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          También puedes usar el usuario <strong>@masaymiga</strong> en tu aplicación.
        </p>
      </div>

      <div>
        <Label htmlFor="walletReceipt" className="text-foreground font-medium">
          Sube la captura del pago
        </Label>
        <p className="text-xs text-muted-foreground">
          (PNG, JPG - máx. 5MB)
        </p>
        <Input
          id="walletReceipt"
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="bg-muted border-border text-foreground mt-2"
        />
      </div>
    </div>
  );
};

const CashPaymentComponent = () => {
  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border/50">
      <h4 className="font-semibold text-foreground">Pago en Efectivo</h4>
      <p className="text-popover-foreground">
        Pagarás en efectivo al recibir tu pedido.
      </p>
      <p className="text-muted-foreground text-sm">
        Por favor, ten el importe exacto si es posible.
      </p>
    </div>
  );
};

const BankTransferComponent = ({
  formData,
  setFormData,
}: {
  formData: FormDataProps;
  setFormData: (value: FormDataProps) => void;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, bankReceipt: e.target.files![0] });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border/50">
      <h4 className="font-semibold text-foreground">Transferencia Bancaria</h4>
      <p className="text-sm text-muted-foreground">
        Realiza una transferencia a nuestra cuenta bancaria y sube el comprobante.
      </p>

      <div className="space-y-3">
        <div className="bg-background p-3 rounded-lg border border-border/50">
          <p className="font-medium text-foreground">Datos Bancarios</p>
          <p className="text-sm text-muted-foreground">Banco: Banco Nacional</p>
          <p className="text-sm text-muted-foreground">Titular: Masa & Miga S.L.</p>
          <p className="text-sm text-muted-foreground">IBAN: ES12 3456 7890 1234 5678 9012</p>
          <p className="text-sm text-muted-foreground">Concepto: Tu nombre + Fecha</p>
        </div>

        <div>
          <Label htmlFor="bankReceipt" className="text-foreground font-medium">
            Sube el comprobante de transferencia
          </Label>
          <p className="text-xs text-muted-foreground">
            (PNG, JPG, PDF - máx. 5MB)
          </p>
          <Input
            id="bankReceipt"
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
            className="bg-muted border-border text-foreground mt-2"
          />
        </div>
      </div>
    </div>
  );
};