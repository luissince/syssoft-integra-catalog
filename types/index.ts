export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  available: boolean
  preparationTime: number
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
  customer: {
    name: string
    phone: string
    whatsapp: string
    address: string
    reference: string
  }
  payment: {
    method: string
    total: number
    deliveryFee: number
  }
  delivery: {
    zone: string
    time: string
    type: "now" | "scheduled"
    scheduledDate?: string
    scheduledTime?: string
  }
  status: "pending" | "preparing" | "ready" | "delivered"
  notes: string
  orderNotes: string // Notas sobre lo que incluye el pedido
  createdAt: string
}

export interface RestaurantData {
  restaurant: {
    name: string
    logo: string
    phone: string
    address: string
    hours: string
    whatsapp: string
  }
  categories: Category[]
  menuItems: MenuItem[]
  paymentMethods: PaymentMethod[]
  deliveryZones: DeliveryZone[]
}
