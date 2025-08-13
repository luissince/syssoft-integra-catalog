import { Branch, Category, Company, CompanyBanner, Currency, FilterOptions, Product, Whatsapp } from "@/types/api-type";


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
      name: item.nombre,
      description: item.descripcionCorta,
      price: item.precio,
      idCategory: item.idCategoria,
      category: { id: item.idCategoria, name: item.nombreCategoria },
      idBrand: item.idMedida,
      brand: { id: item.idMedida, name: item.nombreMedida },
      image: item.imagen,
      difficulty: "hard",
      discount: 0,
      stock: item.cantidad,
      isService: false,
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
    idCategoria: string,
    nombreCategoria: string,
    cantidad: number;
    id: number
  }) => {
    const product: Product = {
      id: item.id.toString(),
      code: item.codigo,
      name: item.nombre,
      description: item.descripcionCorta,
      price: item.precio,
      idCategory: item.idCategoria,
      category: { id: item.idCategoria, name: item.nombreCategoria },
      image: item.imagen,
      difficulty: "hard",
      discount: 0,
      stock: item.cantidad,
      isService: false,
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
    isService: result.servicio === 1 ? true : false,
    category: { id: result.categoria.idCategoria, name: result.categoria.nombre },
    brand: { id: result.marca.idMarca, name: result.marca.nombre },
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
    id: number,
    idProducto: string,
    codigo: string,
    sku: string,
    codigoBarras: string,
    nombre: string,
    descripcionCorta: string,
    precio: number,
    imagen: string,
    idCategoria: string,
    nombreCategoria: string,
  }) => {
    return {
      id: item.id,
      code: item.codigo,
      name: item.nombre,
      description: item.descripcionCorta,
      price: item.precio,
      idCategory: item.idCategoria,
      category: { id: item.idCategoria, name: item.nombreCategoria },
      image: item.imagen,
      discount: 0,
      stock: 0,
      isNew: true,
      isService: false
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

// Función para obtener la información de las sucursales
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
  }

  return currency;
}