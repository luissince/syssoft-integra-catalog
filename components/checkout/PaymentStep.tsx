import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethod } from "@/types/api-type";

interface PaymentStepProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  paymentMethods: PaymentMethod[];
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  formData,
  setFormData,
  paymentMethods,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Método de Pago</h3>
      <p className="text-sm text-muted-foreground">
        Los pagos son referenciales. Al momento de recoger tu pedido, se te proporcionará la información para realizar el pago.
      </p>
      <RadioGroup
        value={formData.idPaymentMethod}
        onValueChange={(value) => setFormData({ ...formData, idPaymentMethod: value })}
        className="space-y-3"
      >
        {paymentMethods.filter((method) => method.available).map((method) => (
          <div key={method.id} className="flex items-center space-x-3">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="text-foreground flex items-center cursor-pointer">
              <span className="mr-2 text-lg">{method.icon}</span>
              {method.name}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Información Adicional</h3>
        <div>
          <Label htmlFor="orderNotes" className="text-foreground font-medium">Notas sobre el pedido</Label>
          <Textarea
            id="orderNotes"
            value={formData.orderNotes}
            onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground mt-2"
            placeholder="Ej: Incluir adicionales..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
