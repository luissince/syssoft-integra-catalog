export interface Image {
  id: string
  url: string
  alt: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  images: Image[]
  category: string
  rating: number
  available: boolean
  preparationTime: number
  ingredients: string[]
  nutritionalInfo: NutritionalInfo[]
}

export interface NutritionalInfo {
  name: string
  value: string | number
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface CartItem extends MenuItem {
  quantity: number
  notes?: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  available: boolean
}

export interface DeliveryZone {
  id: string
  name: string
  price: number
  time: string
}

export interface Order {
  id: string
  items: CartItem[]
  customerId: string;
  payment: {
    method: string
    total: number
    discount: number
    deliveryFee: number
  }
  delivery?: {
    address: Address
    zone: Zone
    time: string
    type: "delivery" | "local"
    orderType: "now" | "scheduled"
    scheduledDate?: string
    scheduledTime?: string
  }
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  notes: string
  discount: number | string
  orderNotes: string
  createdAt: string
}

export interface Customer {
  id: string;
  document: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  password?: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
  lastOrderId?: string;
  totalOrders: number;
  notes?: string;
  role?: "admin" | "customer";
}

export interface Address {
  id: string;
  address: string; // "Av. 28 de mayo 123"
  reference: string; // "Casa azul, portón negro"
  isDefault: boolean;
  createdAt: string;
}

export interface Zone {
  id: string;
  name: string;
  price: number;
  time: string;
}

export interface Restaurant {
    typeDocument: string
    document: string
    owner: string
    name: string
    icon: Image
    logo: Image
    banner?: Image[]
    phone: string
    address: string
    hours: string
    whatsapp: string
    description: string
    keywords: string | string[]
}

export interface RestaurantData {
  restaurant: Restaurant,
  categories: Category[]
  menuItems: MenuItem[]
  paymentMethods: PaymentMethod[]
  deliveryZones: DeliveryZone[]
}
