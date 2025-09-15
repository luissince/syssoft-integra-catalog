import { fetchAllOrder, fetchBranches, fetchCategories, fetchCompanyBanners, fetchCompanyInfo, fetchCreateConsult, fetchCreateOrder, fetchCurrencies, fetchCurrencyInfo, fetchCustomerById, fetchGetOrder, fetchListTypeDocument, fetchLogin, fetchPaymentReceipts, fetchProductById, fetchProducts, fetchProductsAll, fetchProductsRelated, fetchTaxes, fetchUpdateCustomer, fetchWhatsappInfo } from "@/data/data-rest";
import { Branch, Category, Company, CompanyBanner, Consult, Currency, FilterOptions, Order, PaymentReceipt, Person, Product, Tax, TypeDocument, Whatsapp } from "@/types/api-type";
import { FormCustomer, FormOrder } from "@/types/form";

// Obtener todos los productos 
export async function getProductsAll(): Promise<Product[]> {
    try {
        const data = await fetchProductsAll();
        return data;
    } catch (error) {
        return [];
    }
}

// Obtener todos los productos por filtro
export async function getProducts(search = "", currentPage: number = 0, totalPage: number = 6, filters: FilterOptions | null = null): Promise<{ products: Product[], count: number }> {
    try {
        const data = await fetchProducts(search, currentPage, totalPage, filters);
        return data;
    } catch (error) {
        return {
            products: [],
            count: 0
        };
    }
}

// Obtener en detalle de un producto
export async function getProductById(code: string): Promise<Product | null> {
    try {
        const data = await fetchProductById(code);
        return data;
    } catch (error) {
        return null;
    }
}

// Obtener los productos relacionados
export async function getProductsRelated(idProduct: string, idCategory: string): Promise<Product[]> {
    try {
        const data = await fetchProductsRelated(idProduct, idCategory);
        return data;
    } catch (error) {
        return [];
    }
}

// Obtener las categorías
export async function getCategories(): Promise<Category[]> {
    try {
        const data = await fetchCategories();
        return data;
    } catch (error) {
        return [];
    }
}

// Obtener la información de la empresa
export async function getCompanyInfo(): Promise<Company> {
    try {
        const data = await fetchCompanyInfo();
        return data;
    } catch (error) {
        const company: Company = {
            idCompany: "1",
            aboutUs: "Descripción del negocio",
            email: "ecommerse@gmail.com",
            information: "Somos una empresa de comercio electrónico",
            name: "Ecommerse",
            website: "https://ecommerse.com",
            youtubePage: "https://www.youtube.com/",
            facebookPage: "https://www.facebook.com/",
            twitterPage: "https://twitter.com/",
            instagramPage: "https://www.instagram.com/",
            tiktokPage: "https://www.tiktok.com/",
            privacyPolicy: "Política de privacidad",
            icon: "favicon.svg",
            logo: "placeholder.svg",
            cover: "placeholder.svg",
            banner: "placeholder.svg",
            termsAndConditions: "Términos y condiciones",
        }
        return company;
    }
}

// Obtener los banners de la empresa
export async function getCompanyBanners(): Promise<CompanyBanner[]> {
    try {
        const data = await fetchCompanyBanners();
        return data;
    } catch (error) {
        return [];
    }
}

// Obtener las sucursales
export async function getBranches(): Promise<Branch[]> {
    try {
        const data = await fetchBranches();
        return data;
    } catch (error) {
        return [];
    }
}

// Obtener las monedas
export async function getCurrencies(): Promise<Currency[]> {
    try {
        const data = await fetchCurrencies();
        return data;
    } catch (error) {
        return [];
    }
}

// Obtener las impuestos
export async function getTaxes(): Promise<Tax[]> {
    try {
        const data = await fetchTaxes();
        return data;
    } catch (error) {
        return [];
    }
}

// Obtener la información del whatsapp
export async function getWhatsappInfo(): Promise<Whatsapp> {
    try {
        const data = await fetchWhatsappInfo();
        return data;
    } catch (error) {
        const whatsapp: Whatsapp = {
            idWhatsapp: "1",
            message: "Hola, me gustaría obtener más información sobre Plantopia.",
            number: "123456789",
            title: "Plantopia",
        }
        return whatsapp;
    }
}

// Obtener la información de la moneda
export async function getCurrencyInfo(): Promise<Currency> {
    try {
        const data = await fetchCurrencyInfo();
        return data;
    } catch (error) {
        const currency: Currency = {
            idCurrency: "1",
            name: "Peso",
            symbol: "€",
            code: "EUR",
            prefered: true
        }

        return currency;
    }
}

// Obtener la información del comprobante o documento
export async function getPaymentReceipts(idBranch: string): Promise<PaymentReceipt[]> {
    try {
        const data = await fetchPaymentReceipts(idBranch);
        return data;
    } catch (error) {
        return [];
    }
}

// Función para registrar el pedido
export async function createOrder(formOrder: FormOrder): Promise<{ status: boolean, idOrder?: string, message: string }> {
    try {
        const data = await fetchCreateOrder(formOrder);
        return {
            status: true,
            idOrder: data.idOrder,
            message: data.message,
        };
    } catch (error) {
        return {
            status: false,
            message: (error as Error).message,
        };
    }
}

// Función para obtener todos los pedidos
export async function getAllOrder(): Promise<Order[]> {
    try {
        const data = await fetchAllOrder();
        return data;
    } catch (error) {
        return [];
    }
}

// Función para obtener un pedido
export async function getOrderById(idOrder: string): Promise<Order | null> {
    try {
        const data = await fetchGetOrder(idOrder);
        return data;
    } catch (error) {
        return null;
    }
}

// Función para obtener los datos de inicio de sesión
export async function loginCustomer(body: { email: string, password: string }): Promise<Person | string> {
    try {
        const data = await fetchLogin(body);
        return data;
    } catch (error) {
        return (error as Error).message;
    }
}

// Función para obtener datos de un usuario
export async function getCustomerById(idPerson: string): Promise<Person> {
    try {
        const data = await fetchCustomerById(idPerson);
        return data as Person;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Función para obtener la lista de tipos de documento
export async function getListTypeDocument(): Promise<TypeDocument[]> {
    try {
        const data = await fetchListTypeDocument();
        return data;
    } catch (error) {
        return [];
    }
}

// Función para actualizar el cliente
export async function updateCustomer(body: FormCustomer): Promise<string> {
    try {
        const data = await fetchUpdateCustomer(body);
        return data;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

// Función para crear una consulta
export async function createConsult(body: Consult): Promise<{ status: boolean, message: string }> {
    try {
        const data = await fetchCreateConsult(body);
        return {
            status: true,
            message: data,
        };
    } catch (error) {
        return {
            status: false,
            message: (error as Error).message
        };
    }

}