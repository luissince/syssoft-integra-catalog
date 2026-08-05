import { TYPE_DELIVERY } from "@/constants/type-delivery";
import { TYPE_PRODUCT_LIST } from "@/constants/type-product";
import { apiFetch, apiRequestFetch } from "@/lib/utils";
import { ApiResult } from "@/types";
import {
  Branch,
  Category,
  Company,
  CompanyBanner,
  Consult,
  Currency,
  FilterOptions,
  Measurement,
  Order,
  OrderDetail,
  PaymentReceipt,
  Person,
  Product,
  Receipt,
  Tax,
  TypeDelivery,
  TypeDocument,
  Whatsapp
} from "@/types/api-type";
import { FormCustomer, FormOrder } from "@/types/form";

// Función para obtener todo los productos por filtro
export const fetchProducts = async (search?: string, currentPage: number = 0, totalPage: number = 6, filters: FilterOptions | null = null): Promise<{ data: Product[], count: number }> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/producto/filter/web`, {
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

  const products = data.data.map((item: {
    idProducto: string,
    codigo: string,
    descripcionCorta: string,
    sku: string,
    codigoBarras: string,
    nombre: string,
    precio: number,
    imagen: string,
    idTipoProducto: string,
    idCategoria: string,
    nombreCategoria: string,
    idMedida: string,
    nombreMedida: string,
    cantidad: number;
    id: number
  }) => {
    const product: Product = {
      id: item.id.toString(),
      idProduct: item.idProducto,
      code: item.codigo,
      sku: item.sku,
      codeBar: item.codigoBarras,
      name: item.nombre,
      description: item.descripcionCorta,
      price: item.precio,
      idCategory: item.idCategoria,
      category: { id: item.idCategoria, name: item.nombreCategoria },
      idMeasurement: item.idMedida,
      measurement: { id: item.idMedida, name: item.nombreMedida },
      image: item.imagen,
      discount: 0,
      stock: item.cantidad,
      typeProduct: TYPE_PRODUCT_LIST.find(type => type.id === item.idTipoProducto),
    }

    return product;
  });

  return {
    "data": products,
    "count": data.count
  };
}

// Función para obtener en detalle de un producto
export const fetchProductById = async (id: string): Promise<Product> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/producto/filter/web/${id}`, {
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
    discount: 0,
    stock: data.cantidad,
    oldPrice: 0,
    typeProduct: TYPE_PRODUCT_LIST.find(type => type.id === data.idTipoProducto),
    category: { id: data.categoria.idCategoria, name: data.categoria.nombre },
    brand: { id: data.marca.idMarca, name: data.marca.nombre },
    measurement: { id: data.medida.idMedida, name: data.medida.nombre },
    details: data.detalles.map((item: { id: string, nombre: string, valor: string }) => ({ id: item.id, name: item.nombre, value: item.valor })),
    images: images,
    colors: data.colores.map((item: { id: string, idAtributo: string, nombre: string, hexadecimal: string }) => ({ id: item.idAtributo, name: item.nombre, hexadecimal: item.hexadecimal })),
    sizes: data.tallas.map((item: { id: string, idAtributo: string, nombre: string, valor: string }) => ({ id: item.idAtributo, name: item.nombre, value: item.valor })),
    flavors: data.sabores.map((item: { id: string, idAtributo: string, nombre: string, valor: string }) => ({ id: item.idAtributo, name: item.nombre, value: item.valor })),
  } as Product;
}

// Función para obtener los productos relacionados
export const fetchProductsRelated = async (idProduct: string, idCategory: string): Promise<Product[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/producto/filter/web/related/${idProduct}/${idCategory}`, {
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
      discount: 0,
      stock: item.cantidad,
      oldPrice: 0,
      isService: item.servicio === 1 ? true : false,
      category: { id: item.idCategoria, name: item.categoriaNombre },
      brand: { id: item.idMarca, name: item.marcaNombre },
      measurement: { id: item.idMedida, name: item.nombreMedida },
      typeProduct: TYPE_PRODUCT_LIST.find(type => type.id === item.idTipoProducto),
    }
  });
}

// Función para obtener las categorías
export const fetchCategories = async (): Promise<Category[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const data = await apiFetch<[]>(`${url}/api/categoria/combo`, {
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
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/empresa/web/info`, {
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
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`${url}/api/empresa/web/banners`, {
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
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`${url}/api/sucursal/list/web`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });

  const branches: Branch[] = data.map((branch: {
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
    id: branch.idSucursal,
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

// Función para obtener la lista de impuestos
export const fetchTaxes = async (): Promise<Tax[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`${url}/api/impuesto/combo`, {
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
      percentage: branch.porcentaje,
      prefered: branch.preferido === 1 ? true : false,
    } as Tax
  });

  return taxes;
}

// Función para obtener la lista de monedas
export const fetchCurrencies = async (): Promise<Currency[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`${url}/api/moneda/combo`, {
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
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/empresa//web/whatsapp`, {
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
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/moneda/nacional`, {
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
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`${url}/api/comprobante/combo?tipo=TC0010&idSucursal=${idBranch}`, {
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
export const fetchCreateOrder = async (formOrder: FormOrder): Promise<{ idOrder: string, message: string }> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/pedido/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formOrder),
    next: { revalidate: 0 }
  });

  return {
    idOrder: data.idPedido,
    message: data.message,
  };
}

// Función para obtener todos los pedidos
export const fetchAllOrder = async (): Promise<Order[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`${url}/api/pedido/list/web`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });


  return data.map((item: {
    id: number
    idPedido: string
    comprobante: string
    documento: string
    informacion: string
    telefono: string
    celular: string
    email: string
    direccion: string
    tipoDocumento: string
    fecha: string
    hora: string
    serie: string
    numeracion: string
    nota: string
    instruccion: string
    estado: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
    idTipoEntrega: string
    tipoEntrega: string
    idTipoPedido: string
    tipoPedido: string
    fechaPedido: string
    horaPedido: string
    codiso: string
    detalles: {
      id: number

      idProducto: string
      nombre: string
      codigo: string
      sku: string
      codigoBarras: string
      imagen: string

      idTipoProducto: string
      tipoProducto: string

      idMedida: string
      medida: string

      idCategoria: string
      categoria: string

      idImpuesto: string
      impuesto: string
      porcentaje: number

      cantidad: number
      precio: number
    }[]
  }) => {
    const order: Order = {
      id: item.id,
      idOrder: item.idPedido,
      receipt: {
        idReceipt: "",
        name: item.comprobante,
        series: "",
        number: 0,
        code: "",
      } as Receipt,
      person: {
        idPerson: "",
        document: item.documento,
        information: item.informacion,
        cellular: item.telefono,
        phone: item.celular,
        email: item.email,
        address: item.direccion,

        typeDocument: {
          id: "",
          name: item.tipoDocumento,
          description: "",
          lenght: 0,
          required: false,
          code: "",
          state: false,
        } as TypeDocument,
      } as Person,
      date: item.fecha,
      time: item.hora,
      series: item.serie,
      numbering: item.numeracion,
      status: item.estado,
      observations: "",
      notes: item.nota,
      instructions: item.instruccion,
      idTypeDelivery: item.idTipoEntrega,
      typeDelivery: Object.values(TYPE_DELIVERY).find(type => type.id === item.idTipoEntrega) || {
        id: item.idTipoEntrega,
        name: item.tipoEntrega,
        icon: undefined,
        code: "",
      } as TypeDelivery,
      scheduledDate: item.fechaPedido,
      scheduledTime: item.horaPedido,
      currency: {
        idCurrency: "",
        name: "",
        symbol: "",
        code: item.codiso,
        prefered: false,
      } as Currency,
      orderDetails: item.detalles.map((detalle) => {
        return {
          id: detalle.id,
          product: {
            id: detalle.idProducto,
            code: detalle.codigo,
            name: detalle.nombre,
            image: detalle.imagen,
          } as Product,
          measurement: {
            id: detalle.idMedida,
            name: detalle.medida,
          } as Measurement,
          category: {
            id: detalle.idCategoria,
            name: detalle.categoria,
          } as Category,
          price: detalle.precio,
          quantity: detalle.cantidad,
          tax: {
            idTax: detalle.idImpuesto,
            name: detalle.impuesto,
            percentage: detalle.porcentaje,
          } as Tax,
        }
      }) as OrderDetail[],
    }

    return order;
  });
}

// Función para obtener un pedido
export const fetchGetOrder = async (idOrder: string): Promise<Order> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/pedido/detail/${idOrder}`, {
    next: { revalidate: 0 }
  });

  return {
    person: {
      idPerson: data.cabecera.idPersona,
      document: data.cabecera.documento,
      information: data.cabecera.informacion,
      cellular: data.cabecera.telefono,
      phone: data.cabecera.celular,
      email: data.cabecera.email,
      address: data.cabecera.direccion,
    },
    date: data.cabecera.fecha,
    time: data.cabecera.hora,
    series: data.cabecera.serie,
    numbering: data.cabecera.numeracion,
    status: data.cabecera.estado,
    observations: data.cabecera.observacion,
    notes: data.cabecera.nota,
    instructions: data.cabecera.instruccion,
    idTypeDelivery: data.cabecera.idTipoEntrega,
    typeDelivery: Object.values(TYPE_DELIVERY).find(type => type.id === data.cabecera.idTipoEntrega)!,
    scheduledDate: data.cabecera.fechaPedido,
    scheduledTime: data.cabecera.horaPedido,
    currency: {
      code: data.cabecera.codiso,
    } as Currency,
    orderDetails: data.detalles.map((item: {
      id: number
      imagen: string
      codigo: string
      producto: string
      medida: string
      categoria: string
      precio: number
      cantidad: number
      idImpuesto: string
      impuesto: string
      porcentaje: number
    }) => {
      return {
        id: item.id,
        product: {
          image: item.imagen,
          code: item.codigo,
          name: item.producto,
        } as Product,
        measurement: {
          name: item.medida,
        } as Measurement,
        category: {
          name: item.categoria,
        } as Category,
        price: item.precio,
        quantity: item.cantidad,
        tax: {
          idTax: item.idImpuesto,
          name: item.impuesto,
          percentage: item.porcentaje,
        } as Tax,
      }
    }),
  }
}

// Función para obtener los datos de inicio de sesión
export const fetchLogin = async (body: { email: string, password: string }): Promise<Person> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/persona/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { revalidate: 0 }
  });

  return {
    idPerson: data.idPersona,
    idTypeDocument: data.idTipoDocumento,
    document: data.documento,
    information: data.informacion,
    cellular: data.telefono,
    phone: data.celular,
    email: data.email,
    address: data.direccion,
  } as Person;
}

// Función para registrar el cliente
export const fetchRegisterConsumer = async (body: FormCustomer): Promise<ApiResult<string>> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  return await apiRequestFetch<string>(`${url}/api/persona/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}


// Función para obtener datos de un usuarios
export const fetchCustomerById = async (idPerson: string): Promise<Person> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const params = new URLSearchParams({
    "idPersona": idPerson,
  });

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/persona/id?${params}`, {
    next: { revalidate: 0 }
  });

  return {
    idPerson: data.idPersona,
    idTypeDocument: data.idTipoDocumento,
    document: data.documento,
    information: data.informacion,
    cellular: data.telefono,
    phone: data.celular,
    email: data.email,
    address: data.direccion,
  } as Person;
}

// Función para obtener la lista de tipos de documento
export const fetchListTypeDocument = async (): Promise<TypeDocument[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<[]>(`${url}/api/tipodocumento/combo`, {
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
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;


  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/persona/${body.idPersona}`, {
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
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  // Obtener los datos de la respuesta
  const data = await apiFetch<any>(`${url}/api/consulta`, {
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