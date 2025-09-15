import Contact from "@/components/Contact"
import { getBranches, getCompanyInfo } from "@/lib/api"

export default async function ContactPage() {
    // Cargar datos desde la API en el servidor
    const company = await getCompanyInfo()
    const branches = await getBranches()

    // Procesar variable de entorno en el servidor
    const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false

    return (
        <Contact
            company={company}
            branches={branches}
            authEnabled={authEnabled}
        />
    )
}
