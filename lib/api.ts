import { fetchBranches, fetchCategories, fetchCompanyBanners, fetchCompanyInfo, fetchCurrencyInfo, fetchProductById, fetchProducts, fetchProductsAll, fetchProductsRelated, fetchWhatsappInfo } from "@/data/data-rest";
import { Branch, Category, Company, CompanyBanner, Currency, FilterOptions, Product, Whatsapp } from "@/types/api-type";

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
        }

        return currency;
    }
}