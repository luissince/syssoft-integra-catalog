export interface ProductImage {
  id: string
  name: string
  url: string
  width: number
  height: number
}

export interface ProductDetail {
  id: string
  name: string,
  value: string,
}

export interface TypeProduct {
  id: string
  code?: string
  name: string
}

export interface TypeDocument {
  id: string
  name: string
  description?: string
  lenght?: number
  required?: boolean
  code?: string
  state: boolean
}

export interface TypePerson {
  id: string
  code?: string
  name: string
}

export interface TypeDelivery {
  id: string
  code?: string
  icon?: React.ReactNode
  name: string
  description?: string
  isScheduled?: boolean
}

export interface Product {
  id: string
  code: string
  sku: string
  codeBar: string
  name: string
  description: string
  descriptionLong?: string
  price: number
  idCategory: string
  idBrand?: string
  idMeasurement?: string
  image: string
  isNew?: boolean
  discount: number
  stock: number
  oldPrice?: number
  idTypeProduct?: string
  typeProduct?: TypeProduct
  brand?: Brand
  category?: Category
  measurement?: Measurement
  images?: ProductImage[],
  details?: ProductDetail[],
  colors?: Attribute[],
  sizes?: Attribute[],
  flavors?: Attribute[],
}

export interface Measurement {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  description?: string
  image?: string
}

export interface Brand {
  id: string
  name: string
  description?: string
  image?: string
}

export interface Attribute {
  id: string
  name: string,
  hexadecimal?: string,
  value?: string,
}

export interface RangePrice {
  minimum: number
  maximum: number
}

export interface Company {
  idCompany?: string,
  aboutUs: string,
  email: string,
  information: string,
  name: string,
  website: string,
  youtubePage: string,
  facebookPage: string,
  twitterPage: string,
  instagramPage: string,
  tiktokPage: string,
  privacyPolicy: string,
  icon: string,
  logo: string,
  cover: string,
  banner: string,
  termsAndConditions: string,
  banners?: CompanyBanner[],
}

export interface CompanyBanner {
  id: string
  name: string
  url: string
  width: number
  height: number
}

export interface Branch {
  id: string
  name: string
  address: string
  email: string
  phone: string
  schedule: string
  mapUrl: string
  image: string
  state: boolean
  primary: boolean
}

export interface Tax {
  idTax?: string,
  name: string,
  percentage: number,
  prefered: boolean,
}

export interface Currency {
  idCurrency?: string,
  name: string,
  symbol: string,
  code: string,
  prefered: boolean,
}

export interface PaymentReceipt {
  idPaymentReceipt: string,
  name: string,
  series: string
  number?: string,
  prefered: boolean,
}

export interface Whatsapp {
  idWhatsapp?: string,
  message: string,
  number: string,
  title: string,
}

export type FilterOptions = {
  categories: Category[]
  priceRange: [number, number]
  brands: Brand[]
  colors: Attribute[],
  sizes: Attribute[],
  flavors: Attribute[],
}

export type Consult = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: number
}

export interface Cart extends Product {
  quantity: number
  notes?: string
}

export interface Wishlist extends Product {
  quantity: number
  notes?: string
}

export interface Person {
  idPerson: string
  idTypeDocument?: string
  document: string
  information: string
  cellular: string
  phone: string
  email: string
  clave?: string
  address: string

  typePerson?: TypePerson
  typeDocument?: TypeDocument
}

export interface Receipt { 
  idReceipt: string;
  name: string;
  series: string;
  number: number;
  code: string;
}

export interface OrderDetail {
  id: number
  product: Product
  measurement: Measurement
  category: Category
  price: number
  quantity: number
  idTax: string
  tax: Tax
}

export interface Order {
  id?: number
  idOrder?: string
  receipt?: Receipt
  person: Person
  date: string
  time: string
  series: string
  numbering: string
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  observations: string
  notes: string
  instructions: string
  idTypeDelivery: string
  typeDelivery: TypeDelivery
  scheduledDate: string
  scheduledTime: string
  currency: Currency
  orderDetails: OrderDetail[]
}