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

export interface Product {
  id: string
  code: string
  name: string
  description: string
  descriptionLong?: string
  price: number
  idCategory: string
  idBrand?: string
  idMeasurement?: string
  image: string
  difficulty: "easy" | "medium" | "hard"
  isNew?: boolean
  discount: number
  stock: number
  oldPrice?: number
  isService?: boolean 
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

export interface Currency{
  idCurrency?: string,
  name: string,
  symbol: string,
  code: string,
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