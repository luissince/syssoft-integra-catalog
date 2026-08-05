// components/admin.tsx
import AdminComponent from "@/components/AdminPanel";
import {
    getAllOrder,
    getCompanyInfo,
    getListTypeDocument
} from "@/lib/api";

export default async function Component() {
    const [
        company,
        listTypeDocument,
        orders
    ] = await Promise.all([
        getCompanyInfo(),
        getListTypeDocument(),
        getAllOrder()
    ]);

    return (
        <AdminComponent
            company={company}
            listTypeDocument={listTypeDocument}
            orders={orders}
        />
    );
}