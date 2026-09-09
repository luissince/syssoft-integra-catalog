import { notFound } from "next/navigation";
import ContactComponent from "@/components/Contact"
import { getBranches } from "@/lib/api"

export default async function ContactPage() {
    // Cargar datos desde la API en el servidor
    const branches = await getBranches()

    if (!branches || branches.length === 0) {
        return notFound();
    }

    return (
        <ContactComponent
            branches={branches}
        />
    )
}
