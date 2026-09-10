// lib/auth.ts

import { fetchGetToken, fetchValidateConsumer } from "@/data/data-rest";
import { Person } from "@/types/api-type";
import { cookies } from "next/headers";

export async function getCurrentSession(): Promise<Person | null> {
    try {
        // Obtener el JWT de Express almacenado dentro
        // del JWT de NextAuth       
        const token = await fetchGetToken(cookies().toString());

        if (!token.success || !token.data) {
            return null;
        }

        const accessToken = token.data.accessToken;

        const { success, data } = await fetchValidateConsumer(accessToken);

        if (!success || !data) {
            return null;
        }

        return data;
    } catch (error) {
        console.error("getCurrentSession ERROR", error);
        return null;
    }
}