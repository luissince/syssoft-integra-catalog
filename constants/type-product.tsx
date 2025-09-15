import { TypeProduct } from "@/types/api-type";

export const TYPE_PRODUCT = {
  PRODUCT: {
    id: "TP0001",
    code: "",
    name: "PRODUCTO",
  },
  SERVICE: {
    id: "TP0002",
    code: "",
    name: "SERVICIO",
  },
  COMBO: {
    id: "TP0003",
    code: "",
    name: "COMBO",
  },
} as const satisfies Record<string, TypeProduct>;

// Si quieres recorrer/filtrar fácilmente
export const TYPE_PRODUCT_LIST: TypeProduct[] = Object.values(TYPE_PRODUCT);
