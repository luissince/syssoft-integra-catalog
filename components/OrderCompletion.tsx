"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";
import { useCurrency } from "@/context/CurrencyContext";
import { formatCurrency } from "@/lib/utils";
import { Branch, Company, Order } from "@/types/api-type";

interface OrderCompletionProps {
  order: Order;
  company: Company;
  branch: Branch;
  onBackToMenu: () => void;
}

export const OrderCompletion: React.FC<OrderCompletionProps> = ({ order, company, branch, onBackToMenu }) => {
  const { currency } = useCurrency();
  const contentRef = useRef<HTMLDivElement>(null);

  const total = order.orderDetails.reduce((previousValue, currentValue) => previousValue + (currentValue.price * currentValue.quantity), 0);

  const handlePrint = useReactToPrint({ contentRef });

  return (
    <>
      <style>{`
                @media print {
                    html, body {
                        margin: 0mm !important;
                        padding: 0mm !important;
                        height: initial !important;
                        overflow: initial !important;
                        -webkit-print-color-adjust: exact;
                    }
    
                    @page {
                        margin: 0mm;
                        padding: 10mm;
                        font-family: sans-serif;
                    }
                }
            `}</style>
      <div className="min-h-screen bg-background font-sans">
        <div className="container mx-auto p-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-xl">Pedido Completado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4" ref={contentRef}>
                <h3 className="font-semibold text-foreground">Gracias por tu pedido</h3>
                <p className="text-muted-foreground">Tu pedido ha sido recibido y está siendo procesado.</p>
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground">Resumen del Pedido</h4>
                  <div className="space-y-2 mt-2">
                    {order.orderDetails.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-foreground">{item.product.name} x {item.quantity}</span>
                        <span className="text-primary">{formatCurrency(item.price * item.quantity, currency.code)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold mt-4">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatCurrency(total, currency.code)}</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground">Información del Cliente</h4>
                  <p className="text-foreground"><strong>Nombre:</strong> {order.person.information || 'N/A'}</p>
                  <p className="text-foreground"><strong>Teléfono:</strong> {order.delivery?.phone || 'N/A'}</p>
                  <p className="text-foreground"><strong>Dirección:</strong> {order.delivery?.address || 'N/A'}</p> 
                </div>
              </div>
              {/* <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground">Método de Pago</h4>
                <p className="text-foreground">{order.payment.method}</p>
              </div> */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handlePrint} className="flex-1 bg-primary hover:bg-primary/90">
                  Imprimir
                </Button>
              </div>
              <div className="pt-4">
                <Button onClick={onBackToMenu} variant="outline" className="w-full">
                  Volver al Menú
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
