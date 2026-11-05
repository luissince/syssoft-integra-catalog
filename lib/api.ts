import { 
    fetchBranches, 
    fetchCategories, 
    fetchCompanyBanners, 
    fetchCreateConsult, 
    fetchCurrencies,
    fetchCurrencyInfo, 
    fetchCustomerById, 
    fetchListTypeDocument, 
    fetchUpdateCustomer, 
    fetchWhatsappInfo 
} from "@/data/data-rest";
import { 
    Branch, 
    Category, 
    CompanyBanner, 
    Consult, 
    Currency, 
    Person, 
    TypeDocument,
    Whatsapp 
} from "@/types/api-type";
import { FormCustomer } from "@/types/form";

// Obtener las categorías
export async function getCategories(): Promise<Category[]> {
    try {
        const data = await fetchCategories();
        return data;
    } catch (error) {
        return [];
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