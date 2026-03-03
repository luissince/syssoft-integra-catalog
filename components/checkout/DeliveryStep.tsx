import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TYPE_DELIVERY, TYPE_DELIVERY_LIST } from "@/constants/type-delivery";
import { Branch } from "@/types/api-type";
import { Textarea } from "../ui/textarea";

interface DeliveryStepProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  refs: any;
  branches: Branch[];
  timeSlots: () => string[];
}

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  formData,
  setFormData,
  refs,
  branches,
  timeSlots,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-foreground">¿Cómo quieres recibir tu pedido?</h3>
      <RadioGroup
        value={formData.idTypeDelivery}
        onValueChange={(value) => setFormData({ ...formData, idTypeDelivery: value })}
        className="space-y-3"
      >
        {TYPE_DELIVERY_LIST.map((delivery) => (
          <div key={delivery.id} className="flex items-center space-x-3">
            <RadioGroupItem value={delivery.id} id={delivery.id} />
            <Label htmlFor={delivery.id} className="text-foreground flex items-center cursor-pointer">
              {delivery.icon}
              <div>
                <span className="font-medium">{delivery.name}</span>
                <span className="block text-sm text-muted-foreground">{delivery.description}</span>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {TYPE_DELIVERY_LIST.find((t) => t.id === formData.idTypeDelivery)?.isScheduled && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Programar para</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate" className="text-foreground font-medium text-sm">Fecha *</Label>
              <Input
                id="scheduledDate"
                ref={refs.scheduledDate}
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="bg-muted border-border text-foreground mt-2"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="scheduledTime" className="text-foreground font-medium text-sm">Hora *</Label>
              <Select
                value={formData.scheduledTime}
                onValueChange={(value) => setFormData({ ...formData, scheduledTime: value })}
              >
                <SelectTrigger ref={refs.scheduledTime} className="bg-muted border-border text-foreground mt-2">
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-48">
                  {timeSlots().map((time) => (
                    <SelectItem key={time} value={time} className="text-foreground">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {(formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_NOW.id ||
        formData.idTypeDelivery === TYPE_DELIVERY.DELIVERY_SCHEDULED.id) && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Dirección de Entrega</h3>
            <div>
              <Label htmlFor="address" className="text-foreground font-medium">Dirección *</Label>
              <Input
                id="address"
                ref={refs.address}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-muted border-border text-foreground mt-2"
                placeholder="Ej: Calle 123, 123 123"
              />
            </div>
            <div>
              <Label htmlFor="reference" className="text-foreground font-medium">Referencia</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="bg-muted border-border text-foreground mt-2"
                placeholder="Ej: Casa azul, portón negro"
              />
            </div>
          </div>
        )}

      <div>
        <Label className="text-foreground font-medium">Sucursal *</Label>
        <Select
          value={formData.idBranch}
          onValueChange={(value) => setFormData({ ...formData, idBranch: value })}
        >
          <SelectTrigger ref={refs.branch} className="bg-muted border-border text-foreground mt-2">
            <SelectValue placeholder="Selecciona tu sucursal" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id} className="text-foreground">
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="instructions" className="text-foreground font-medium">Instrucciones de entrega</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground mt-2"
          placeholder="Instrucciones especiales para la entrega..."
          rows={3}
        />
      </div>
    </div>
  );
};
