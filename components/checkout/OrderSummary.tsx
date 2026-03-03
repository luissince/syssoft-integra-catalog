import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Cart, Currency } from "@/types/api-type";
import { TYPE_DELIVERY, TYPE_DELIVERY_LIST } from "@/constants/type-delivery";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryProps {
  cart: Cart[];
  currency: Currency;
  formData: any;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, currency, formData }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Card className="bg-card border-border w-full">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Resumen del Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-border">
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
                  <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                  {item.notes && <p className="text-xs text-primary mt-1">Nota: {item.notes}</p>}
                </div>
              </div>
              <span className="text-primary font-bold">
                {formatCurrency(item.price * item.quantity, currency!.code)}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-foreground">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal, currency!.code)}</span>
          </div>
        </div>
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex flex-col gap-2 bg-muted/50 p-4 rounded-lg border border-border/50">
            <div className="flex items-center mb-2">
              {TYPE_DELIVERY_LIST.find((t) => t.id === formData.idTypeDelivery)?.icon}
              <span className="font-medium text-foreground ml-2">
                {TYPE_DELIVERY_LIST.find((t) => t.id === formData.idTypeDelivery)?.name}
              </span>
            </div>
            {TYPE_DELIVERY_LIST.find((t) => t.id === formData.idTypeDelivery)?.isScheduled ? (
              <p className="text-foreground text-sm">
                <strong>Programado para:</strong>{" "}
                <span className="text-primary">
                  {new Date(formData.scheduledDate).toLocaleDateString()} a las {formData.scheduledTime}
                </span>
              </p>
            ) : (
              <p className="text-foreground text-sm">
                <strong>Tiempo estimado:</strong>{" "}
                <span className="text-primary">
                  {TYPE_DELIVERY_LIST.find((t) => t.id === formData.idTypeDelivery)?.description}
                </span>
              </p>
            )}
            {(formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_NOW.id ||
              formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_SCHEDULED.id) && (
                <p className="text-foreground text-sm mt-1">
                  <strong>Dirección:</strong>{" "}
                  <span className="text-primary">{formData.address}</span>
                </p>
              )}
            <p className="text-foreground text-xs text-red-500">
              <span>Todos los campos que usen * son obligatorios.</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
