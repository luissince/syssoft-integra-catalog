import { getCompanyInfo, getListTypeDocument } from "@/lib/api";
import RegisterComponent from "@/components/Register";
import { notFound } from "next/navigation";

export default async function RegisterPage() {
    const [
        company,
        listTypeDocument
    ] = await Promise.all([
        getCompanyInfo(),
        getListTypeDocument()
    ]);

    if (!company) {
        notFound();
    }

    if (!listTypeDocument || listTypeDocument.length === 0) {
        notFound();
    }

    return (
        <RegisterComponent
            listTypeDocument={listTypeDocument}
        />
    );
}
