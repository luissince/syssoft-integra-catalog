import {
  Truck,
  Store,
  CalendarDays,
  Package,
} from "lucide-react";

export const TYPE_DELIVERY = {
  HOME_DELIVERY: {
    id: "TE0001",
    name: "Envío a domicilio",
    description: "Recibe tu pedido en tu dirección",
    icon: <Truck className="mr-2 h-5 w-5" />,
  },

  STORE_PICKUP: {
    id: "TE0002",
    name: "Recojo en local",
    description: "Recoge tu pedido en nuestra tienda",
    icon: <Store className="mr-2 h-5 w-5" />,
  },

  SCHEDULED_DELIVERY: {
    id: "TE0003",
    name: "Entrega programada",
    description: "Selecciona fecha y hora",
    icon: <CalendarDays className="mr-2 h-5 w-5" />,
  },

  SHIPPING_AGENCY: {
    id: "TE0004",
    name: "Envío por agencia",
    description: "Enviamos mediante transporte",
    icon: <Package className="mr-2 h-5 w-5" />,
  },
};