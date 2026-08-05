import { getBranches } from "@/lib/api";
import CheckoutComponent from "@/components/Checkout";
import { notFound } from "next/navigation";

export default async function CheckoutPage() {
    const branches = await getBranches();

    if (!branches || branches.length === 0) {
        notFound();
    }

    const branch = branches.find((branch) => branch.primary === true)!;

    return (
        <CheckoutComponent
            branch={branch}
            branches={branches}
        />
    );
}
