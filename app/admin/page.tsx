import AdminComponent from "@/components/AdminPanel";
import Welcome from "@/components/Welcome";
import { getAllOrder, getBranches, getCategories, getCompanyInfo, getListTypeDocument } from "@/lib/api";
import { Suspense } from "react";

export default async function Component() {
    const company = await getCompanyInfo();
    const branches = await getBranches();
    const categories = await getCategories();
    const listTypeDocument = await getListTypeDocument();
    const orders = await getAllOrder();

    const branch = branches.find((branch) => branch.primary === true)!;
    const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

    return (
        <Suspense fallback={<Welcome company={company} branch={branch} />}>
            <AdminComponent
                company={company}
                branch={branch}
                categories={categories}
                listTypeDocument={listTypeDocument}
                orders={orders}
                authEnabled={authEnabled}
            />
        </Suspense>
    );
}
