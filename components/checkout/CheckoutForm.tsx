import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAlert } from "@/hooks/use-alert";
import { useAuth } from "@/context/AuthContext";
import { currentDate, isValidEmail, timeSlots } from "@/lib/utils";
import { getPaymentReceipts } from "@/lib/api";
import type {PaymentMethod, Branch, Cart, Currency, Tax, TypeDocument } from "@/types/api-type";
import type { FormOrder, FormOrderDelivery } from "@/types/form";
import { StepIndicator } from "./StepIndicator";
import { InfoStep } from "./InfoStep";
import { DeliveryStep } from "./DeliveryStep";
import { PaymentStep } from "./PaymentStep";
import { OrderSummary } from "./OrderSummary";
import { TYPE_DELIVERY } from "@/constants/type-delivery";
import { TYPE_PAYMENT_METHOD_LIST } from "@/constants/type-payment-method";

interface CheckoutFormProps {
  listTypeDocument: TypeDocument[];
  branches: Branch[];
  tax: Tax;
  currency: Currency;
  cart: Cart[];
  paymentMethods: PaymentMethod[];
  onSubmitOrder: (orderData: FormOrder) => void;
}

interface StepIndicatorProps {
  currentStep: "info" | "delivery" | "payment";
  name: string;
}

const steps: StepIndicatorProps[] = [
  {
    currentStep: "info",
    name: "Información"
  },
  {
    currentStep: "delivery",
    name: "Entrega"
  },
  {
    currentStep: "payment",
    name: "Pago"
  }
]

const informationDefault = {
  idTypeDocument: "TD0001",
  document: "00000000",
  name: "PUBLICO GENERAL",
  phone: "987654321",
  whatsapp: "+51987654321",
  email: "test@gmail.com",
  password: "123456",
  validationPassword: "123456",
}

export default function CheckoutForm({
  listTypeDocument,
  branches,
  tax,
  currency,
  cart,
  paymentMethods,
  onSubmitOrder,
}: CheckoutFormProps) {
  const isMobile = useIsMobile();
  const alert = useAlert();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<StepIndicatorProps["currentStep"]>("info");
  const [formData, setFormData] = useState<{
    idTypeDocument: string;
    document: string;
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    password: string;
    validationPassword: string;

    idTypeDelivery: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    reference: string;
    idBranch: string;
    idPaymentMethod: string;
    orderNotes: string;
    instructions: string;
  }>({
    idTypeDocument: process.env.NEXT_PUBLIC_ENV === "development" && informationDefault["idTypeDocument"] || "",
    document: process.env.NEXT_PUBLIC_ENV === "development" && informationDefault["document"] || "",
    name: process.env.NEXT_PUBLIC_ENV === "development" && informationDefault["name"] || "",
    phone: process.env.NEXT_PUBLIC_ENV === "development" && informationDefault["phone"] || "",
    whatsapp: process.env.NEXT_PUBLIC_ENV === "development" && informationDefault["whatsapp"] || "",
    email: process.env.NEXT_PUBLIC_ENV === "development" && informationDefault["email"] || "",
    password: process.env.NEXT_PUBLIC_ENV === "development" && informationDefault["password"] || "",
    validationPassword: process.env.NEXT_PUBLIC_ENV === "development" && informationDefault["validationPassword"] || "",

    idTypeDelivery: TYPE_DELIVERY["DELIVERY_NOW"].id,
    scheduledDate: currentDate(),
    scheduledTime: "",
    address: "",
    reference: "",

    idBranch: "",
    idPaymentMethod: TYPE_PAYMENT_METHOD_LIST.find(method => method.prefered)?.id || "",
    orderNotes: "",
    instructions: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showValidationPassword, setShowValidationPassword] = useState(false);

  const refs = {
    typeDocument: React.useRef<HTMLButtonElement>(null),
    document: React.useRef<HTMLInputElement>(null),
    name: React.useRef<HTMLInputElement>(null),
    phone: React.useRef<HTMLInputElement>(null),
    email: React.useRef<HTMLInputElement>(null),
    password: React.useRef<HTMLInputElement>(null),
    validationPassword: React.useRef<HTMLInputElement>(null),
    whatsapp: React.useRef<HTMLInputElement>(null),
    address: React.useRef<HTMLInputElement>(null),
    branch: React.useRef<HTMLButtonElement>(null),
    scheduledDate: React.useRef<HTMLInputElement>(null),
    scheduledTime: React.useRef<HTMLButtonElement>(null),
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      document: user?.document || prev.document,
      name: user?.information || prev.name,
      phone: user?.phone || prev.phone,
      whatsapp: user?.phone || prev.whatsapp,
      address: user?.address || prev.address,
      email: user?.email || prev.email,
    }));
  }, [user]);

  useEffect(() => {
    if (branches.length === 1) {
      setFormData((prev) => ({ ...prev, idBranch: branches[0].id }));
    }
  }, [branches]);

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep === "info") setCurrentStep("delivery");
      else if (currentStep === "delivery") setCurrentStep("payment");
    }
  };

  const prevStep = () => {
    if (currentStep === "delivery") setCurrentStep("info");
    else if (currentStep === "payment") setCurrentStep("delivery");
  };

  const validateStep = (): boolean => {
    if (currentStep === "info") {
      // Validar tipo de documento
      if (!formData.idTypeDocument) {
        alert.warning({ message: "Selecciona el tipo de documento." }, () => refs.typeDocument.current?.focus());
        return false;
      }

      // Validar numero de documento
      if (!formData.document) {
        alert.warning({ message: "Ingresa el número de documento." }, () => refs.document.current?.focus());
        return false;
      }

      // Validar nombre completo
      if (!formData.name) {
        alert.warning({ message: "Ingresa tu nombre completo." }, () => refs.name.current?.focus());
        return false;
      }

      // Validar número de celular
      if (!formData.phone) {
        alert.warning({ message: "Ingresa tu número de celular." }, () => refs.phone.current?.focus());
        return false;
      }

      // Validar número de WhatsApp
      if (!formData.whatsapp) {
        alert.warning({ message: "Ingresa tu número de WhatsApp." }, () => refs.whatsapp.current?.focus());
        return false;
      }

      // Validar correo electrónico
      if (!isValidEmail(formData.email)) {
        alert.warning({ message: "Ingresa un correo electrónico válido." }, () => refs.email.current?.focus());
        return false;
      }

      // Validar contraseña
      if (!formData.password) {
        alert.warning({ message: "Ingresa una contraseña." }, () => refs.password.current?.focus());
        return false;
      }

      // Validar contraseña
      if (formData.password !== formData.validationPassword) {
        alert.warning({ message: "Las contraseñas no coinciden." }, () => refs.password.current?.focus());
        return false;
      }
    }

    if (currentStep === "delivery") {
      if (!formData.idTypeDelivery) {
        alert.warning({ message: "Selecciona cómo recibir tu pedido." });
        return false;
      }

      if ((formData.idTypeDelivery === TYPE_DELIVERY["DELIVERY_NOW"].id || formData.idTypeDelivery === TYPE_DELIVERY["DELIVERY_SCHEDULED"].id) && !formData.address) {
        alert.warning({ message: "Ingresa tu dirección de entrega." }, () => refs.address.current?.focus());
        return false;
      }

      if ((formData.idTypeDelivery == TYPE_DELIVERY["DELIVERY_SCHEDULED"].id || formData.idTypeDelivery == TYPE_DELIVERY["PICKUP_SCHEDULED"].id) && !formData.scheduledDate) {
        alert.warning({ message: "Selecciona la fecha de entrega." }, () => refs.scheduledDate.current?.focus());
        return false;
      }

      if ((formData.idTypeDelivery == TYPE_DELIVERY["DELIVERY_SCHEDULED"].id || formData.idTypeDelivery == TYPE_DELIVERY["PICKUP_SCHEDULED"].id) && !formData.scheduledTime) {
        alert.warning({ message: "Selecciona la hora de entrega." }, () => refs.scheduledTime.current?.focus());
        return false;
      }

      if (!formData.idBranch) {
        alert.warning({ message: "Selecciona una sucursal." }, () => refs.branch.current?.focus());
        return false;
      }
    }

    if (currentStep === "payment") {
      if (!formData.idPaymentMethod) {
        alert.warning({ message: "Selecciona un método de pago." }, () => refs.branch.current?.focus());
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateStep()) return;

    const paymentReceipts = await getPaymentReceipts(formData.idBranch);
    const paymentReceipt = paymentReceipts.find((pr) => pr.prefered);

    if (!paymentReceipt) {
      alert.warning({ message: "No se encontró un comprobante preferido para la sucursal seleccionada." });
      return;
    }

    const details = cart.map((item) => ({
      id: item.id,
      codigo: item.code,
      cantidad: item.quantity,
      idImpuesto: tax.idTax!,
      idMedida: item.measurement?.id!,
      idProducto: item.id,
      imagen: item.image,
      nombre: item.name,
      nombreImpuesto: "",
      nombreMedida: "",
      porcentajeImpuesto: 0,
      precio: item.price,
    }));

    let delivery: FormOrderDelivery | null = null;
    if (formData.idTypeDelivery === TYPE_DELIVERY["DELIVERY_NOW"].id || formData.idTypeDelivery === TYPE_DELIVERY["DELIVERY_SCHEDULED"].id) {
      delivery = {
        email: formData.email,
        telefono: formData.phone,
        celular: formData.whatsapp,
        direccion: formData.address,
        referencia: formData.reference
      }
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
      observacion: "",
      nota: formData.orderNotes,
      instruccion: formData.instructions,
      idTipoEntrega: formData.idTypeDelivery,
      fechaEntrega: formData.scheduledDate,
      horaEntrega: formData.scheduledTime,
      entrega: delivery,
      detalles: details,
    };

    onSubmitOrder(orderData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 lg:gap-x-8">
      <Card className="bg-card border-border col-span-2 lg:col-span-1">
        <CardContent className="mt-4">
          <StepIndicator
            currentStep={currentStep}
            steps={steps}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === "info" && (
              <InfoStep
                formData={formData}
                setFormData={setFormData}
                refs={refs}
                listTypeDocument={listTypeDocument}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showValidationPassword={showValidationPassword}
                setShowValidationPassword={setShowValidationPassword}
                isMobile={isMobile}
              />
            )}
            {currentStep === "delivery" && (
              <DeliveryStep
                formData={formData}
                setFormData={setFormData}
                refs={refs}
                branches={branches}
                timeSlots={timeSlots}
              />
            )}
            {currentStep === "payment" && (
              <PaymentStep
                formData={formData}
                setFormData={setFormData}
                paymentMethods={paymentMethods}
              />
            )}

            <div className="flex gap-4 pt-4">
              {currentStep !== "info" && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                  Atrás
                </Button>
              )}
              {currentStep !== "payment" ? (
                <Button type="button" onClick={nextStep} className="flex-1">
                  Siguiente
                </Button>
              ) : (
                <>
                  <Button type="submit" className="flex-1">
                    Confirmar Pedido
                  </Button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <OrderSummary cart={cart} currency={currency} formData={formData} />
    </div>
  );
}
