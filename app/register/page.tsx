// components/Register.tsx

import { getListTypeDocument } from "@/lib/api";
import RegisterComponent from "@/components/Register";
import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";

export default async function RegisterPage() {
    const person = await getCurrentSession();

    if (person !== null) {
        return redirect("/");
    }

    const listTypeDocument = await getListTypeDocument();

    if (!listTypeDocument || listTypeDocument.length === 0) {
        return notFound();
    }

    return (
        <RegisterComponent
            listTypeDocument={listTypeDocument}
        />
    );
}
