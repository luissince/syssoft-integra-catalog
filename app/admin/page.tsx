import AdminComponent from "@/components/AdminPanel";
import Welcome from "@/components/Welcome";
import { 
    getAllOrder, 
    getBranches, 
    getCategories, 
    getCompanyInfo, 
    getListTypeDocument 
} from "@/lib/api";
import { Suspense } from "react";

export default async function Component() {
    const [
        company,
        branches,
        categories,
        listTypeDocument,
        orders
    ] = await Promise.all([
        getCompanyInfo(),
        getBranches(),
        getCategories(),
        getListTypeDocument(),
        getAllOrder()
    ]);

    const branch = branches.find((branch) => branch.primary === true)!;
    const authEnabled = process.env.AUTH_ENABLED === "true" ? true : false;

    return (
        <Suspense fallback={<Welcome company={company} />}>
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