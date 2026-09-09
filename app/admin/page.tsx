// components/admin.tsx

import AdminComponent from "@/components/AdminPanel";
import { fetchAllOrder } from "@/data/data-rest";
import {
    getCompanyInfo,
    getListTypeDocument
} from "@/lib/api";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Component() {
    const person = await getCurrentSession();

    if (person === null) {
        return redirect("/");
    }

    const [
        company,
        listTypeDocument,
        orders
    ] = await Promise.all([
        getCompanyInfo(),
        getListTypeDocument(),
        fetchAllOrder({
            opcion: 3,
            buscar: person.idPerson, posicionPagina: 0,
            filasPorPagina: 5
        })
    ]);

    if (!orders.success) {
        throw new Error("No se pudo obtener los pedidos");
    }

    return (
        <AdminComponent
            company={company}
            listTypeDocument={listTypeDocument}
            initialOrders={orders.data!}
            person={person}
        />
    );
}