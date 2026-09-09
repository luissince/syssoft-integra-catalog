// data-rest.ts

import { TYPE_PRODUCT_LIST } from "@/constants/type-product";
import { apiFetch, apiRequestFetch } from "@/lib/utils";
import { Agency, ApiResult } from "@/types/api-type";
import {
  Branch,
  Category,
  Company,
  CompanyBanner,
  Consult,
  Currency,
  FilterOptions,
  Order,
  PaymentReceipt,
  Person,
  Product,
  Tax,
  TypeDocument,
  Whatsapp
} from "@/types/api-type";
import { FormCustomer, FormOrder, FormOrderResponse } from "@/types/form";

// Función para obtener todo los productos por filtro
export const fetchProducts = async ({
  search,
  currentPage = 0,
  totalPage = 6,
  filters
}: {
  search?: string,
  currentPage: number,
  totalPage: number,
  filters?: FilterOptions | null,
}):
  Promise<{ data: Product[], count: number }> => {

  // Obtener los datos de la respuesta
  return await apiFetch<{
    data: Product[],
    count: number
  }>(`/producto/filter/web`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      buscar: search,
      filtros: filters,
      posicionPagina: currentPage,
      filasPorPagina: totalPage
    }),
    next: { revalidate: 0 }
  });
}

// Función para obtener en detalle de un producto
export const fetchProductById = async (id: string): Promise<Product> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`/producto/filter/web/${id}`, {
    next: { revalidate: 0 }
  });

  let images = [];

  if (data.imagen) {
    images.push({
      id: "principal-1",
      name: data.nombre,
      url: data.imagen,
      width: 600,
      height: 400
    })
  }

  if (data.imagenes.lenght !== 0) {
    data.imagenes.forEach((image: any) => {
      images.push({
        id: image.idImagen,
        name: image.nombre,
        url: image.url,
        width: image.ancho,
        height: image.alto
      })
    })
  }

  if (!data.imagen && (!data.imagenes || data.imagenes.length === 0)) {
    images.push({
      id: "1",
      name: "Default",
      url: "/placeholder.svg",
      width: 600,
      height: 400
    })
  }

  return {
    id: data.id,
    idProduct: data.idProducto,
    code: data.codigo,
    sku: data.sku,
    codeBar: data.codigoBarras,
    name: data.nombre,
    description: data.descripcionCorta,
    descriptionLong: data.descripcionLarga,
    price: data.precio,
    idCategory: data.idCategoria,
    idBrand: data.idMarca,
    image: data.imagen,
    isNew: true,
    stock: data.cantidad,
    typeProduct: TYPE_PRODUCT_LIST.find(type => type.id === data.idTipoProducto),
    category: { id: data.categoria.idCategoria, name: data.categoria.nombre },
    brand: { id: data.marca.idMarca, name: data.marca.nombre },
    measure: { id: data.medida.idMedida, name: data.medida.nombre },
    details: data.detalles.map((item: { id: string, nombre: string, valor: string }) => ({ id: item.id, name: item.nombre, value: item.valor })),
    images: images,
    colors: data.colores.map((item: { id: string, idAtributo: string, nombre: string, hexadecimal: string }) => ({ id: item.idAtributo, name: item.nombre, hexadecimal: item.hexadecimal })),
    sizes: data.tallas.map((item: { id: string, idAtributo: string, nombre: string, valor: string }) => ({ id: item.idAtributo, name: item.nombre, value: item.valor })),
    flavors: data.sabores.map((item: { id: string, idAtributo: string, nombre: string, valor: string }) => ({ id: item.idAtributo, name: item.nombre, value: item.valor })),
  } as Product;
}

// Función para obtener los productos relacionados
export const fetchProductsRelated = async (idProduct: string, idCategory: string): Promise<Product[]> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`/producto/filter/web/related/${idProduct}/${idCategory}`, {
    next: { revalidate: 0 }
  });

  return data.map((item: {
    id: number
    idProducto: string,
    nombre: string,
    codigo: string,
    sku: string,
    codigoBarras: string,
    idTipoProducto: string,
    descripcionCorta: string,
    descripcionLarga: string,
    precio: number,
    imagen: string,
    cantidad: number,
    servicio: number,

    idCategoria: string,
    categoriaNombre: string,

    idMarca: string,
    marcaNombre: string,

    idMedida: string,
    nombreMedida: string,
  }) => {
    return {
      id: item.id.toString(),
      idProduct: item.idProducto,
      code: item.codigo,
      name: item.nombre,
      description: item.descripcionCorta,
      descriptionLong: item.descripcionLarga,
      price: item.precio,
      idCategory: item.idCategoria,
      idBrand: item.idMarca,
      image: item.imagen,
      isNew: true,
      stock: item.cantidad,
      isService: item.servicio === 1 ? true : false,
      category: { id: item.idCategoria, name: item.categoriaNombre },
      brand: { id: item.idMarca, name: item.marcaNombre },
      measure: { id: item.idMedida, name: item.nombreMedida },
      typeProduct: TYPE_PRODUCT_LIST.find(type => type.id === item.idTipoProducto),
    } as unknown as Product
  });
}

// Función para obtener las categorías
export const fetchCategories = async (): Promise<Category[]> => {

  const data = await apiFetch<[]>(`/categoria/combo`, {
    next: { revalidate: 0 }
  });

  return [
    {
      id: "",
      name: "TODOS",
      image: ""
    },
    ...data.map((item: {
      idCategoria: string,
      nombre: string,
      imagen: string
    }) => ({
      id: item.idCategoria,
      name: item.nombre,
      image: item.imagen
    }))
  ];
};

// Función para obtener la información de la empresa
export const fetchCompanyInfo = async (): Promise<Company> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`/empresa/web/info`, {
    next: { revalidate: 0 }
  });

  return {
    aboutUs: data.acercaNosotros,
    email: data.email,
    information: data.informacion,
    name: data.nombreEmpresa,
    website: data.paginaWeb,
    youtubePage: data.youTubePagina,
    facebookPage: data.facebookPagina,
    twitterPage: data.twitterPagina,
    instagramPage: data.instagramPagina,
    tiktokPage: data.tiktokPagina,
    privacyPolicy: data.politicasPrivacidad,
    icon: data.rutaIcon,
    logo: data.rutaImage,
    cover: data.rutaPortada,
    banner: data.rutaBanner,
    termsAndConditions: data.terminosCondiciones,
  } as Company;
}

// Función para obtener los banners de la empresa
export const fetchCompanyBanners = async (): Promise<CompanyBanner[]> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`/empresa/web/banners`, {
    next: { revalidate: 0 }
  });

  const banners: CompanyBanner[] = data.map((banner: {
    id: string,
    nombre: string,
    url: string,
    ancho: number,
    alto: number,
  }) => {
    return {
      id: banner.id,
      name: banner.nombre,
      url: banner.url,
      width: banner.ancho,
      height: banner.alto
    }
  });

  return banners;
}

// Función para obtener la lista de sucursales
export const fetchBranches = async (): Promise<Branch[]> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`/sucursal/list/web`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });

  const branches: Branch[] = data.map((branch: {
    id: number,
    idSucursal: string,
    nombre: string,
    email: string,
    telefono: string,
    celular: string,
    paginaWeb: string,
    direccion: string,
    googleMaps: string,
    horarioAtencion: string,
    estado: number,
    principal: number,
    imagen: string
  }) => ({
    id: branch.id,
    idBranch: branch.idSucursal,
    name: branch.nombre,
    address: branch.direccion,
    email: branch.email,
    phone: branch.celular,
    schedule: branch.horarioAtencion,
    mapUrl: branch.googleMaps,
    image: branch.imagen,
    state: branch.estado === 1,
    primary: branch.principal === 1,
  } as Branch));

  return branches;
}

// Función para obtener las agencias
export const fetchAgencies = async (): Promise<ApiResult<Agency[]>> => {

  // Obtener los datos de la respuesta
  return await apiRequestFetch<Agency[]>(`/agencia/combo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });
}

// Función para obtener la lista de impuestos
export const fetchTaxes = async (): Promise<Tax[]> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`/impuesto/combo`, {
    next: { revalidate: 0 }
  });

  const taxes: Tax[] = data.map((branch: {
    idImpuesto: string
    nombre: string
    porcentaje: number
    preferido: number
  }) => {
    return {
      idTax: branch.idImpuesto,
      name: branch.nombre,
      rate: branch.porcentaje,
      prefered: branch.preferido === 1 ? true : false,
    } as Tax
  });

  return taxes;
}

// Función para obtener la lista de monedas
export const fetchCurrencies = async (): Promise<Currency[]> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`/moneda/combo`, {
    next: { revalidate: 0 }
  });

  const currencies: Currency[] = data.map((branch: {
    idMoneda: string
    nombre: string
    simbolo: string
    codiso: string
    nacional: number
  }) => {
    return {
      idCurrency: branch.idMoneda,
      name: branch.nombre,
      symbol: branch.simbolo,
      code: branch.codiso,
      prefered: branch.nacional === 1 ? true : false,
    } as Currency
  });

  return currencies;
}

// Función para obtener la información del whatsapp
export const fetchWhatsappInfo = async (): Promise<Whatsapp> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`/empresa//web/whatsapp`, {
    next: { revalidate: 0 }
  });

  const whatsapp: Whatsapp = {
    message: data.mensajeWhatsapp,
    number: data.numeroWhatsapp,
    title: data.tituloWhatsapp,
  }

  return whatsapp;
}

// Función para obtener de la moneda de la empresa
export const fetchCurrencyInfo = async (): Promise<Currency> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`/moneda/nacional`, {
    next: { revalidate: 0 }
  });

  const currency: Currency = {
    idCurrency: data.idMoneda,
    name: data.nombre,
    symbol: data.simbolo,
    code: data.codiso,
    prefered: true
  }

  return currency;
}

// Función para obtener la información del comprobante o documento
export const fetchPaymentReceipts = async (idBranch: string): Promise<PaymentReceipt[]> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`/comprobante/combo?tipo=TC0010&idSucursal=${idBranch}`, {
    next: { revalidate: 0 }
  });

  const paymentReceipts: PaymentReceipt[] = data.map((document: {
    idComprobante: string,
    nombre: string,
    serie: string,
    preferida: number
  }) => {
    return {
      idPaymentReceipt: document.idComprobante,
      name: document.nombre,
      series: document.serie,
      prefered: document.preferida === 1 ? true : false,
    }
  });

  return paymentReceipts;
}

// Función para registrar el pedido
export const fetchCreateOrder = async (formOrder: FormOrder): Promise<ApiResult<FormOrderResponse>> => {

  // Obtener los datos de la respuesta
  return await apiRequestFetch<FormOrderResponse>(`/pedido/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formOrder),
  });
}

// Función para obtener todos los pedidos
export const fetchAllOrder = async (params: Record<string, any>): Promise<ApiResult<{ orders: Order[], count: number }>> => {

  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  // Obtener los datos de la respuesta
  return await apiRequestFetch<{ orders: Order[], count: number }>(`/pedido/list?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });
}

// Función para obtener un pedido
export const fetchGetOrder = async (idOrder: string): Promise<ApiResult<Order>> => {

  // Obtener los datos de la respuesta
  return await apiRequestFetch<Order>(`/pedido/detail/${idOrder}`);
}

// Función para obtener los datos de inicio de sesión
export const fetchLoginCustomer = async (body: { email: string, password: string }): Promise<ApiResult<FormCustomer>> => {

  // Obtener los datos de la respuesta
  return await apiRequestFetch<FormCustomer>(`/persona/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

}

// Función para registrar el cliente
export const fetchRegisterConsumer = async (body: FormCustomer): Promise<ApiResult<string>> => {

  // Obtener los datos de la respuesta
  return await apiRequestFetch<string>(`/persona/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// Función para validar el inicio de sesión
export const fetchValidateConsumer = async (cookieStore: string): Promise<ApiResult<Person>> => {

  // Obtener los datos de la respuesta
  return await apiRequestFetch<Person>(`/persona/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookieStore,
    },
    cache: "no-store",
  });
}

// Función para cerrar sesión
export const fetchLogoutCustomer = async () => {

  // Obtener los datos de la respuesta
  return await apiRequestFetch<string>(`/persona/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Función para obtener datos de un usuarios
export const fetchCustomerById = async (idPerson: string): Promise<Person> => {

  const params = new URLSearchParams({
    "idPersona": idPerson,
  });

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`/persona/id?${params}`, {
    next: { revalidate: 0 }
  });

  return {
    idPerson: data.idPersona,
    idTypeDocument: data.idTipoDocumento,
    document: data.documento,
    information: data.informacion,
    phonerNumber: data.telefono,
    mobileNumber: data.celular,
    email: data.email,
    address: data.direccion,
  } as Person;
}

// Función para obtener la lista de tipos de documento
export const fetchListTypeDocument = async (): Promise<TypeDocument[]> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`/tipodocumento/combo`, {
    next: { revalidate: 0 }
  });

  return data.map((item: {
    idTipoDocumento: string,
    nombre: string,
    longitud: number,
    obligado: number
  }) => {
    return {
      id: item.idTipoDocumento,
      name: item.nombre,
      lenght: item.longitud,
      required: item.obligado === 1 ? true : false,
    } as TypeDocument;
  });
}

// Función para actualizar el cliente
export const fetchUpdateCustomer = async (body: FormCustomer): Promise<string> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`/persona/${body.idPersona}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { revalidate: 0 }
  });

  return data.message;
}

// Función para crear una consulta
export const fetchCreateConsult = async (body: Consult): Promise<string> => {

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`/consulta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      nombre: body.name,
      email: body.email,
      celular: body.phone,
      asunto: body.subject,
      mensaje: body.message,
      estado: body.status,
    }),
    next: { revalidate: 0 }
  });

  return data;
}