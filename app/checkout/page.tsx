import { getBranches, getCompanyInfo, getListTypeDocument, getTaxes } from "@/lib/api";
import CheckoutComponent from "@/components/Checkout";
import { Suspense } from "react";
import Welcome from "@/components/Welcome";

export default async function CheckoutPage() {
    const [
        company,
        branches,
        taxes,
        listTypeDocument
    ] = await Promise.all([
        getCompanyInfo(),
        getBranches(),
        getTaxes(),
        getListTypeDocument()
    ]);

    const branch = branches.find((branch) => branch.primary === true)!;
    const tax = taxes.find((tax) => tax.prefered === true)!;

    const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

    return (
        <Suspense fallback={<Welcome company={company} />}>
            <CheckoutComponent
                listTypeDocument={listTypeDocument}
                company={company}
                branch={branch}
                branches={branches}
                tax={tax}
                authEnabled={authEnabled}
            />
        </Suspense>
    );
}
