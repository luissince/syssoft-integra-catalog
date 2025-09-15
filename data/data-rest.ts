import { TYPE_DELIVERY } from "@/constants/type-delivery";
import { TYPE_PRODUCT_LIST } from "@/constants/type-product";
import { Branch, Category, Company, CompanyBanner, Consult, Currency, FilterOptions, Measurement, Order, OrderDetail, PaymentReceipt, Person, Product, Receipt, Tax, TypeDelivery, TypeDocument, Whatsapp } from "@/types/api-type";
import { FormCustomer, FormOrder } from "@/types/form";

// Función para obtener todos los productos
export const fetchProductsAll = async (): Promise<Product[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const response = await fetch(`${url}/api/producto/filter/web/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching filtered products');
  }

  const result = await response.json();

  const products = result.map((item: {
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
      id: item.idProducto,
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

  return products;
}

// Función para obtener todo los productos por filtro
export const fetchProducts = async (search: string, currentPage: number, totalPage: number, filters: FilterOptions | null = null): Promise<{ products: Product[], count: number }> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const response = await fetch(`${url}/api/producto/filter/web`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      buscar: search,
      filtros: filters,
      posicionPagina: currentPage.toString(),
      filasPorPagina: totalPage.toString()
    }),
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching filtered products');
  }

  const result = await response.json();

  const products = result.data.map((item: {
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
    "products": products,
    "count": result.count
  };
}

// Función para obtener en detalle de un producto
export const fetchProductById = async (id: string): Promise<Product> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const params = new URLSearchParams({
    "codigo": id,
  });

  const response = await fetch(
    `${process.env.APP_BACK_END || url}/api/producto/filter/web/id?${params}`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching product');
  }

  const result = await response.json();

  return {
    id: result.idProducto,
    code: result.codigo,
    sku: result.sku,
    codeBar: result.codigoBarras,
    name: result.nombre,
    description: result.descripcionCorta,
    descriptionLong: result.descripcionLarga,
    price: result.precio,
    idCategory: result.idCategoria,
    idBrand: result.idMarca,
    image: result.imagen,
    difficulty: "hard",
    isNew: true,
    discount: 0,
    stock: result.cantidad,
    oldPrice: 0,
    typeProduct: TYPE_PRODUCT_LIST.find(type => type.id === result.idTipoProducto),
    category: { id: result.categoria.idCategoria, name: result.categoria.nombre },
    brand: { id: result.marca.idMarca, name: result.marca.nombre },
    measurement: { id: result.medida.idMedida, name: result.medida.nombre },
    details: result.detalles.map((item: { id: string, nombre: string, valor: string }) => ({ id: item.id, name: item.nombre, value: item.valor })),
    images: result.imagenes.map((image: any) => {
      return {
        id: image.idImagen,
        name: image.nombre,
        url: image.url,
        width: image.ancho,
        height: image.alto
      }
    }),
    colors: result.colores.map((item: { id: string, idAtributo: string, nombre: string, hexadecimal: string }) => ({ id: item.idAtributo, name: item.nombre, hexadecimal: item.hexadecimal })),
    sizes: result.tallas.map((item: { id: string, idAtributo: string, nombre: string, valor: string }) => ({ id: item.idAtributo, name: item.nombre, value: item.valor })),
    flavors: result.sabores.map((item: { id: string, idAtributo: string, nombre: string, valor: string }) => ({ id: item.idAtributo, name: item.nombre, value: item.valor })),
  } as Product;
}

// Función para obtener los productos relacionados
export const fetchProductsRelated = async (idProduct: string, idCategory: string): Promise<Product[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const params = new URLSearchParams({
    "idProducto": idProduct,
    "idCategoria": idCategory,
  });

  const response = await fetch(
    `${process.env.APP_BACK_END || url}/api/producto/filter/web/related/id?${params}`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching product');
  }

  const result = await response.json();

  return result.map((item: {
    idProducto: string,
    nombre: string,
    codigo: string,
    sku: string,
    codigoBarras: string,
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
      id: item.idProducto,
      code: item.codigo,
      name: item.nombre,
      description: item.descripcionCorta,
      descriptionLong: item.descripcionLarga,
      price: item.precio,
      idCategory: item.idCategoria,
      idBrand: item.idMarca,
      image: item.imagen,
      difficulty: "hard",
      isNew: true,
      discount: 0,
      stock: item.cantidad,
      oldPrice: 0,
      isService: item.servicio === 1 ? true : false,
      category: { id: item.idCategoria, name: item.categoriaNombre },
      brand: { id: item.idMarca, name: item.marcaNombre },
      measurement: { id: item.idMedida, name: item.nombreMedida },
    }
  });
}

// Función para obtener las categorías
export const fetchCategories = async (): Promise<Category[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const response = await fetch(`${url}/api/categoria/combo`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching filtered products');
  }

  const data = await response.json();

  return data.map((item: {
    idCategoria: string,
    nombre: string,
    imagen: string
  }) => {
    return {
      id: item.idCategoria,
      name: item.nombre,
      image: item.imagen
    }
  });
}

// Función para obtener la información de la empresa
export const fetchCompanyInfo = async (): Promise<Company> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const response = await fetch(`${url}/api/empresa/web/info`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching company info');
  }

  const data = await response.json() as {
    acercaNosotros: string,
    email: string,
    informacion: string,
    nombreEmpresa: string,
    paginaWeb: string,
    youTubePagina: string,
    facebookPagina: string,
    twitterPagina: string,
    instagramPagina: string,
    tiktokPagina: string,
    politicasPrivacidad: string,
    rutaIcon: string,
    rutaImage: string,
    rutaBanner: string,
    rutaPortada: string,
    terminosCondiciones: string,
  };

  const company: Company = {
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
  }

  return company;
}

// Función para obtener los banners de la empresa
export const fetchCompanyBanners = async (): Promise<CompanyBanner[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const response = await fetch(`${url}/api/empresa/web/banners`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching company info');
  }

  const data = await response.json();

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

  const response = await fetch(`${url}/api/sucursal/list/web`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching branches');
  }

  const result = await response.json();

  const branches: Branch[] = result.map((branch: {
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
  }) => {
    return {
      id: branch.idSucursal,
      name: branch.nombre,
      address: branch.direccion,
      email: branch.email,
      phone: branch.celular,
      schedule: branch.horarioAtencion,
      mapUrl: branch.googleMaps,
      image: branch.imagen,
      state: branch.estado === 1 ? true : false,
      primary: branch.principal === 1 ? true : false,
    } as Branch
  });

  return branches;
}

// Función para obtener la lista de impuestos
export const fetchTaxes = async (): Promise<Tax[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const response = await fetch(`${url}/api/impuesto/combo`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching taxes');
  }

  const result = await response.json();

  const taxes: Tax[] = result.map((branch: {
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

  const response = await fetch(`${url}/api/moneda/combo`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching currencies');
  }

  const result = await response.json();

  const currencies: Currency[] = result.map((branch: {
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

  const response = await fetch(`${url}/api/empresa//web/whatsapp`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching whatsapp info');
  }

  const data = await response.json();

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

  const response = await fetch(`${url}/api/moneda/nacional`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching currency info');
  }

  const data = await response.json();

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

  const response = await fetch(`${url}/api/comprobante/combo?tipo=TC0010&idSucursal=${idBranch}`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error('Error fetching currency info');
  }

  const data = await response.json();

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

  const response = await fetch(`${url}/api/pedido/create/web`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formOrder),
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(response.statusText || 'Error fetching order');
  }

  const result = await response.json();

  const data = {
    idOrder: result.idPedido,
    message: result.message,
  };

  return data;
}

// Función para obtener todos los pedidos
export const fetchAllOrder = async (): Promise<Order[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const response = await fetch(`${url}/api/pedido/list/web`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(response.statusText || 'Error fetching order');
  }

  const result = await response.json();

  return result.map((item: {
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

  const response = await fetch(`${url}/api/pedido/detail/${idOrder}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(response.statusText || 'Error fetching order');
  }

  const result = await response.json();

  return {
    person: {
      idPerson: result.cabecera.idPersona,
      document: result.cabecera.documento,
      information: result.cabecera.informacion,
      cellular: result.cabecera.telefono,
      phone: result.cabecera.celular,
      email: result.cabecera.email,
      address: result.cabecera.direccion,
    },
    date: result.cabecera.fecha,
    time: result.cabecera.hora,
    series: result.cabecera.serie,
    numbering: result.cabecera.numeracion,
    status: result.cabecera.estado,
    observations: result.cabecera.observacion,
    notes: result.cabecera.nota,
    instructions: result.cabecera.instruccion,
    idTypeDelivery: result.cabecera.idTipoEntrega,
    typeDelivery: Object.values(TYPE_DELIVERY).find(type => type.id === result.cabecera.idTipoEntrega)!,
    scheduledDate: result.cabecera.fechaPedido,
    scheduledTime: result.cabecera.horaPedido,
    currency: {
      code: result.cabecera.codiso,
    } as Currency,
    orderDetails: result.detalles.map((item: {
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

  const response = await fetch(`${url}/api/persona/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error fetching filtered products');
  }

  const result = await response.json();

  return {
    idPerson: result.idPersona,
    idTypeDocument: result.idTipoDocumento,
    document: result.documento,
    information: result.informacion,
    cellular: result.telefono,
    phone: result.celular,
    email: result.email,
    address: result.direccion,
  } as Person;
}

// Función para obtener datos de un usuarios
export const fetchCustomerById = async (idPerson: string): Promise<Person> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const params = new URLSearchParams({
    "idPersona": idPerson,
  });

  const response = await fetch(
    `${process.env.APP_BACK_END || url}/api/persona/id?${params}`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error fetching product');
  }

  const result = await response.json();

  return {
    idPerson: result.idPersona,
    idTypeDocument: result.idTipoDocumento,
    document: result.documento,
    information: result.informacion,
    cellular: result.telefono,
    phone: result.celular,
    email: result.email,
    address: result.direccion,
  } as Person;
}

// Función para obtener la lista de tipos de documento
export const fetchListTypeDocument = async (): Promise<TypeDocument[]> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const response = await fetch(
    `${process.env.APP_BACK_END || url}/api/tipodocumento/combo`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error fetching product');
  }

  const result = await response.json();

  return result.map((item: {
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

  const response = await fetch(
    `${process.env.APP_BACK_END || url}/api/persona/${body.idPersona}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error fetching product');
  }

  const result = await response.json();

  return result.message;
}

// Función para crear una consulta
export const fetchCreateConsult = async (body: Consult): Promise<string> => {
  const url = process.env.APP_BACK_END || process.env.NEXT_PUBLIC_APP_BACK_END;

  const response = await fetch(`${url}/api/consulta`, {
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

  const result = await response.text();

  if (!response.ok) {
    throw new Error(result || 'Error fetching create consult');
  }

  return result;
}