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
  idProduct: string
  code: string
  sku: string
  codeBar: string
  name: string
  description: string
  descriptionLong?: string
  price: number
  idCategory: string
  idBrand?: string
  idMeasure?: string
  image: string
  isNew?: boolean
  stock: number
  idTypeProduct?: string
  typeProduct?: TypeProduct
  brand?: Brand
  category?: Category
  measure?: Measure
  images?: ProductImage[],
  details?: ProductDetail[],
  colors?: Attribute[],
  sizes?: Attribute[],
  flavors?: Attribute[],
}

export interface Measure {
  id: string
  name: string
}

export interface Category {
  id: string
  name?: string
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
  id: number
  idBranch: string
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
  rate: number,
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
  categories?: Category[]
  priceRange?: [number, number]
  brands?: Brand[]
  colors?: Attribute[],
  sizes?: Attribute[],
  flavors?: Attribute[],
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
  idPerson?: string
  idTypeDocument?: string
  document: string
  information: string
  phonerNumber: string
  mobileNumber: string
  email?: string
  clave?: string
  address?: string

  typePerson?: TypePerson
  typeDocument?: TypeDocument
}

export interface Receipt { 
  idReceipt: string;
  name: string;
  series: string;
  number: number;
  code?: string;
}

export interface Agency {
  idAgency: number
  name: string
  description: string
  status: boolean
}

export interface OrderShipping {
  id: number
  idOrderShipping: string
  idOrder: string
  address: string
  reference: string
  idBranch: string
  date: string
  time: string
  idAgency: string
  destination: string
  receiver: string
  
  agency?: Agency
  branch?: Branch
}

export interface OrderDetail {
  id: number
  product: Product
  measure: Measure
  category: Category
  price: number
  quantity: number
  idTax: string
  tax: Tax
}

export interface typeOrder {
  id?: number
  idTypeOrder?: string
  name: string
  description?: string
  staus?: boolean
}

export interface Order {
  id?: number
  idOrder?: string
  typeOrder?: typeOrder
  receipt?: Receipt
  person: Person
  date: string
  time: string
  series: string
  numbering: string
  status: number
  observations: string
  notes: string
  currency: Currency
  branch?: Branch
  orderShipping?: OrderShipping
  orderDetails: OrderDetail[],
  total: number
}

export type ApiResult<T> = {
  success: boolean;
  status: number;
  data?: T;
  message?: string;
};