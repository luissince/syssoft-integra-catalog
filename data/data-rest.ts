// data-rest.ts

import { apiFetch, apiRequestFetch, sleep } from "@/lib/utils";
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

const domainBase = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;
const domainOwn = process.env.NEXTAUTH_URL;

// Función para obtener las agencias
export const fetchGetToken = async (Cookie: string): Promise<ApiResult<{ accessToken: string }>> => {
  // Obtener los datos de la respuesta
  return await apiRequestFetch<{ accessToken: string }>(`${domainOwn}/api/get-token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": Cookie,
    },
    cache: "no-store",
  });
}

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
  }>(`${domainBase}/api/producto/filter/web`, {
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
export const fetchProductById = async (id: string): Promise<ApiResult<Product>> => {
  // Obtener los datos de la respuesta
  return await apiRequestFetch<Product>(`${domainBase}/api/producto/filter/web/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });
}

// Función para obtener los productos relacionados
export const fetchProductsRelated = async (idProduct: string, idCategory: string): Promise<ApiResult<Product[]>> => {
  // Obtener los datos de la respuesta
  return await apiRequestFetch<Product[]>(`${domainBase}/api/producto/filter/web/related/${idProduct}/${idCategory}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });
}

// Función para obtener las categorías
export const fetchCategories = async (): Promise<Category[]> => {
  const data = await apiFetch<[]>(`${domainBase}/api/categoria/combo`, {
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
  const data = await apiFetch<any>(`${domainBase}/api/empresa/web/info`, {
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
  const data = await apiFetch<[]>(`${domainBase}/api/empresa/web/banners`, {
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
  const data = await apiFetch<[]>(`${domainBase}/api/sucursal/list/web`, {
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
  return await apiRequestFetch<Agency[]>(`${domainBase}/api/agencia/combo`, {
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
  const data = await apiFetch<[]>(`${domainBase}/api/impuesto/combo`, {
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
  const data = await apiFetch<[]>(`${domainBase}/api/moneda/combo`, {
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
  const data = await apiFetch<any>(`${domainBase}/api/empresa//web/whatsapp`, {
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
  const data = await apiFetch<any>(`${domainBase}/api/moneda/nacional`, {
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
export const fetchPaymentReceipts = async (idBranch: string): Promise<ApiResult<PaymentReceipt[]>> => {
  // Obtener los datos de la respuesta
  return await apiRequestFetch<PaymentReceipt[]>(`${domainBase}/api/comprobante/combo?tipo=TC0010&idSucursal=${idBranch}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });
}

// Función para registrar el pedido
export const fetchCreateOrder = async (formOrder: FormOrder): Promise<ApiResult<FormOrderResponse>> => {
  // Obtener los datos de la respuesta
  return await apiRequestFetch<FormOrderResponse>(`${domainBase}/api/pedido/create`, {
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
  return await apiRequestFetch<{ orders: Order[], count: number }>(`${domainBase}/api/pedido/list?${query}`, {
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
  return await apiRequestFetch<Order>(`${domainBase}/api/pedido/detail/${idOrder}`);
}

// Función para obtener los datos de inicio de sesión
export const fetchLoginCustomer = async (body: { email: string, password: string }): Promise<ApiResult<{ person: Person, token: string }>> => {
  // Obtener los datos de la respuesta
  return await apiRequestFetch<{ person: Person, token: string }>(`${domainBase}/api/persona/login`, {
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
  return await apiRequestFetch<string>(`${domainBase}/api/persona/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// Función para validar el inicio de sesión
export const fetchValidateConsumer = async (token: string): Promise<ApiResult<Person>> => {
  // Obtener los datos de la respuesta
  return await apiRequestFetch<Person>(`${domainBase}/api/persona/validate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

// Función para cerrar sesión
export const fetchLogoutCustomer = async () => {
  // Obtener los datos de la respuesta
  return await apiRequestFetch<string>(`${domainBase}/api/persona/logout`, {
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
  const data = await apiFetch<any>(`${domainBase}/api/persona/id?${params}`, {
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
  const data = await apiFetch<[]>(`${domainBase}/api/tipodocumento/combo`, {
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
  const data = await apiFetch<any>(`${domainBase}/api/persona/${body.idPersona}`, {
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
  const data = await apiFetch<any>(`${domainBase}/api/consulta`, {
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