// components/OrderCompletion.tsx
"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";
import { useCurrency } from "@/context/CurrencyContext";
import { cn, formatCurrency, formatDecimal, formatTime } from "@/lib/utils";
import { Order } from "@/types/api-type";
import { useWhatsApp } from "@/context/WhatsAppContext";
import Image from "next/image";
import { TYPE_DELIVERY } from "@/constants/type-delivery";

interface OrderCompletionProps {
  order: Order;
  onBackToMenu: () => void;
}

export const OrderCompletion: React.FC<OrderCompletionProps> = ({ order, onBackToMenu }) => {
  const { currency } = useCurrency();
  const { whatsapp } = useWhatsApp();
  const contentRef = useRef<HTMLDivElement>(null);

  const total = order.orderDetails.reduce((previousValue, currentValue) => previousValue + (currentValue.price * currentValue.quantity), 0);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    copyShadowRoots: true,
    pageStyle: `
    @page {
      size: auto;
      margin: 10mm;
    }

    @media print {
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    }
  `,
  });

  const handleWhatsApp = () => {
    // const deliveryAddress = order.delivery?.address?.address || 'N/A';
    const deliveryAddress = order.person.address || 'N/A';
    const message = `Hola, me gustaría confirmar mi pedido:
    \n\n*Resumen del Pedido:*
    \n${order.orderDetails.map(item => ` - ${item.product.name} x ${item.quantity}: ${formatCurrency(item.price * item.quantity, currency.code)}`).join('\n')}
    \n\n*Total:* ${formatCurrency(total, currency.code)}
    \n\n*Dirección de entrega:* ${deliveryAddress}
    \n*Método de pago:* completar
    \n\nGracias.`;

    const url = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Pedido Completado</CardTitle>
      </CardHeader>
      <CardContent ref={contentRef} className="ticket">
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Gracias por tu pedido</h3>
          <p className="text-muted-foreground">Tu pedido ha sido recibido y está siendo procesado.</p>
          <div className="border-t border-border pt-4">
            <h4 className="font-semibold text-foreground">Resumen del Pedido</h4>
            <div className="space-y-2 mt-2">
              {order.orderDetails.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "grid",
                      " grid-cols-1",
                      "gap-3",
                      "py-3",
                      "border-b",
                      "border-border",
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
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price, currency!.code)} x <small>{item.measure.name}</small>
                        </p>
                        {/* {item.notes && (
                          <p className="text-xs text-primary mt-1">
                            Nota: {item.notes}
                          </p>
                        )} */}
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
                )
              })}
            </div>
            <div className="flex justify-between font-bold mt-4">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{formatCurrency(total, currency.code)}</span>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <h4 className="font-bold text-foreground">Pedido Envío</h4>
            <p className="text-foreground"><strong>Tipo:</strong> {order.typeOrder?.name}</p>

            {
              order.typeOrder?.idTypeOrder === TYPE_DELIVERY.HOME_DELIVERY.id && (
                <>
                  <p className="text-foreground"><strong>Dirección:</strong> {order.orderShipping?.address}</p>
                  <p className="text-foreground"><strong>Referencia:</strong> {order.orderShipping?.reference}</p>
                </>
              )
            }

            {
              order.typeOrder?.idTypeOrder === TYPE_DELIVERY.STORE_PICKUP.id && (
                <>
                  <p className="text-foreground"><strong>Sucursal:</strong> {order?.orderShipping?.branch?.name}</p>
                  <p className="text-foreground"><strong>Sucursal Dirección:</strong> {order?.orderShipping?.branch?.address}</p>
                </>
              )
            }

            {
              order.typeOrder?.idTypeOrder === TYPE_DELIVERY.SCHEDULED_DELIVERY.id && (
                <>
                  <p className="text-foreground"><strong>Fecha y Hora:</strong> {order.orderShipping?.date} - {formatTime(order.orderShipping?.time!)}</p>
                  <p className="text-foreground"><strong>Dirección:</strong> {order.orderShipping?.address}</p>
                  <p className="text-foreground"><strong>Referencia:</strong> {order.orderShipping?.reference}</p>
                </>
              )
            }

            {
              order.typeOrder?.idTypeOrder === TYPE_DELIVERY.SHIPPING_AGENCY.id && (
                <>
                  <p className="text-foreground"><strong>Agencia:</strong> {order.orderShipping?.agency?.name}</p>
                  <p className="text-foreground"><strong>Destino:</strong> {order.orderShipping?.destination}</p>
                  <p className="text-foreground"><strong>Receptor:</strong> {order.orderShipping?.receiver}</p>
                </>
              )
            }
            <p className="text-foreground"><strong>Nota:</strong> {order.notes}</p>
          </div>
          <div className="border-t border-border pt-4">
            <h4 className="font-semibold text-foreground">Información del Cliente</h4>
            <p className="text-foreground"><strong>Nombre:</strong> {order.person.information || 'N/A'}</p>
            <p className="text-foreground"><strong>Teléfono:</strong> {order.person.phonerNumber || 'N/A'}</p>
            <p className="text-foreground"><strong>WhatsApp:</strong> {order.person.mobileNumber || 'N/A'}</p>
            <p className="text-foreground"><strong>Dirección:</strong> {order.person.address || 'N/A'}</p>
          </div>
          {/* <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground">Método de Pago</h4>
                <p className="text-foreground">{order.payment.method}</p>
              </div> */}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 pt-4">
          <Button onClick={handleWhatsApp} className="flex-1 bg-green-500 hover:bg-green-500/90">
            Enviar a WhatsApp
          </Button>

          <Button onClick={handlePrint} className="flex-1 bg-primary hover:bg-primary/90">
            Imprimir
          </Button>

          <Button onClick={onBackToMenu} variant="outline" className="w-full">
            Volver al Menú
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
