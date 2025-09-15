import { getBranches, getCompanyInfo, getListTypeDocument, getTaxes } from "@/lib/api";
import CheckoutComponent from "@/components/Checkout";
import { Suspense } from "react";
import Welcome from "@/components/Welcome";

export default async function CheckoutPage() {
    const company = await getCompanyInfo();
    const branches = await getBranches();
    const taxes = await getTaxes();
    const listTypeDocument = await getListTypeDocument();

    const branch = branches.find((branch) => branch.primary === true)!;
    const tax = taxes.find((tax) => tax.prefered === true)!;

    const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

    return (
        <Suspense fallback={<Welcome company={company} branch={branch} />}>
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
