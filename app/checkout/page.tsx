// pages/checkout.tsx

import { getBranches } from "@/lib/api";
import CheckoutComponent from "@/components/Checkout";
import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { fetchAgencies, fetchPaymentReceipts, fetchTaxes } from "@/data/data-rest";

export default async function CheckoutPage() {
    const person = await getCurrentSession();

    if (person === null) {
        return redirect("/register");
    }

    const [taxes, branches, agencies] = await Promise.all([
        fetchTaxes(),
        getBranches(),
        fetchAgencies(),
    ]);

    if (!taxes || taxes.length === 0) {
        throw new Error("No se pudo obtener los impuestos");
    }

    if (!branches || branches.length === 0) {
        throw new Error("No se pudo obtener las sucursales");
    }

    if (!agencies.success) {
        throw new Error("No se pudo obtener las agencias");
    }

    const branch = branches.find((branch) => branch.primary === true)!;

    const receipts = await fetchPaymentReceipts(branch.idBranch);

    if (!receipts || receipts.length === 0) {
        throw new Error("No se pudo obtener los comprobantes");
    }

    return (
        <CheckoutComponent
            taxes={taxes}
            branch={branch}
            branches={branches}
            receipts={receipts}
            person={person}
            agencies={agencies.data!}
        />
    );
}
