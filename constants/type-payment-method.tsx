import { PaymentMethod } from "@/types/api-type";

export const TYPE_PAYMENT_METHOD_LIST: PaymentMethod[] = [
  {
    id: "PM0001",
    code: "cash",
    type: "cash",
    name: "Efectivo",
    icon: "💵",
    available: true,
    prefered: true,
  },
  {
    id: "PM002",
    code: "card",
    type: "card",
    name: "Tranferencia Bancaria",
    icon: "💳",
    available: true,
    prefered: false,
  },
  {
    id: "PM003",
    code: "wallet",
    type: "wallet",
    name: "Yape",
    icon: "📱",
    available: true,
    prefered: false,
  },
  {
    id: "PM004",
    code: "wallet",
    type: "wallet",
    name: "Plin",
    icon: "📲",
    available: true,
    prefered: false,
  },
]
