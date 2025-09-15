import { TypeDelivery } from "@/types/api-type";
import { Home, Truck, AlarmClock, CalendarDays } from "lucide-react";

export const TYPE_DELIVERY = {
  DELIVERY_NOW: {
    id: "TE0001",
    code: "DELIVERY_NOW",
    icon: <Truck className="w-4 h-4 mr-2 text-primary" />,
    name: "Delivery a domicilio",
    description: "Llega en 30-45 minutos",
    isScheduled: false,
  },
  PICKUP_NOW: {
    id: "TE0002", 
    code: "PICKUP_NOW",
    icon: <Home className="w-4 h-4 mr-2 text-primary" />,
    name: "Recoger en local",
    description: "Listo en 15-20 minutos",
    isScheduled: false,
  },
  DELIVERY_SCHEDULED: {
    id: "TE0003",
    code: "DELIVERY_SCHEDULED", 
    icon: <CalendarDays className="w-4 h-4 mr-2 text-primary" />,
    name: "Delivery programado",
    description: "Elige fecha y hora",
    isScheduled: true,
  },
  PICKUP_SCHEDULED: {
    id: "TE0004",
    code: "PICKUP_SCHEDULED",
    icon: <CalendarDays className="w-4 h-4 mr-2 text-primary" />,
    name: "Recoger programado", 
    description: "Elige fecha y hora",
    isScheduled: true,
  },
} as const satisfies Record<string, TypeDelivery>;

// Lista para iterar fácilmente
export const TYPE_DELIVERY_LIST: TypeDelivery[] = Object.values(TYPE_DELIVERY);

// Agrupados por categoría para mejor UX
export const TYPE_DELIVERY_GROUPED = {
  IMMEDIATE: [
    TYPE_DELIVERY.DELIVERY_NOW,
    TYPE_DELIVERY.PICKUP_NOW,
  ],
  SCHEDULED: [
    TYPE_DELIVERY.DELIVERY_SCHEDULED,
    TYPE_DELIVERY.PICKUP_SCHEDULED,
  ],
};
