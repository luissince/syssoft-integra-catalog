"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";
import type { Order, RestaurantData } from "@/types";
import customers from "@/data/customer.json";

interface OrderCompletionProps {
  order: Order;
  restaurant: RestaurantData["restaurant"];
  onBackToMenu: () => void;
}

export const OrderCompletion: React.FC<OrderCompletionProps> = ({ order, restaurant, onBackToMenu }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const customer = customers.list.find(item => item.id === order.customerId);

  const handlePrint = useReactToPrint({ contentRef });

  const handleWhatsApp = () => {
    const deliveryAddress = order.delivery?.address?.address || 'N/A';
    const message = `Hola, me gustaría confirmar mi pedido:
    \n\n*Resumen del Pedido:*
    \n${order.items.map(item => ` - ${item.name} x ${item.quantity}: S/. ${(item.price * item.quantity).toFixed(2)}`).join('\n')}
    \n\n*Total:* S/. ${order.payment.total.toFixed(2)}
    \n\n*Dirección de entrega:* ${deliveryAddress}
    \n*Método de pago:* ${order.payment.method}
    \n\nGracias.`;

    const url = `https://wa.me/${restaurant.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground font-display text-xl">Pedido Completado</CardTitle>
          </CardHeader>
          <CardContent ref={contentRef}>
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-display">Gracias por tu pedido</h3>
              <p className="text-muted-foreground">Tu pedido ha sido recibido y está siendo procesado.</p>
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground">Resumen del Pedido</h4>
                <div className="space-y-2 mt-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-foreground">{item.name} x {item.quantity}</span>
                      <span className="text-primary">S/. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold mt-4">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">S/. {order.payment.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground">Información del Cliente</h4>
                <p className="text-foreground"><strong>Nombre:</strong> {customer?.name || 'N/A'}</p>
                <p className="text-foreground"><strong>Teléfono:</strong> {customer?.phone || 'N/A'}</p>
                <p className="text-foreground"><strong>Dirección:</strong> {order.delivery?.address?.address || 'N/A'}</p>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground">Método de Pago</h4>
                <p className="text-foreground">{order.payment.method}</p>
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={handleWhatsApp} className="flex-1 bg-green-500 hover:bg-green-500/90">
                  Enviar a WhatsApp
                </Button>
                <Button onClick={handlePrint} className="flex-1 bg-primary hover:bg-primary/90">
                  Imprimir
                </Button>
              </div>
              <div className="pt-4">
                <Button onClick={onBackToMenu} variant="outline" className="w-full">
                  Volver al Menú
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
