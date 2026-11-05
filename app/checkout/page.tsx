// pages/checkout.tsx

import CheckoutComponent from "@/components/Checkout";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { fetchAgencies, fetchTaxes } from "@/data/data-rest";

export default async function CheckoutPage() {
    const person = await getCurrentSession();

    if (person === null) {
        return redirect("/register");
    }

    const [taxes, agencies] = await Promise.all([
        fetchTaxes(),
        fetchAgencies(),
    ]);

    if (!taxes || taxes.length === 0) {
        throw new Error("No se pudo obtener los impuestos");
    }

    if (!agencies.success) {
        throw new Error("No se pudo obtener las agencias");
    }

    return (
        <CheckoutComponent
            taxes={taxes}
            person={person}
            agencies={agencies.data!}
        />
    );
}
