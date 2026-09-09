// lib/auth.ts

import { fetchValidateConsumer } from "@/data/data-rest";
import { Person } from "@/types/api-type";
import { cookies } from "next/headers";

export async function getCurrentSession(): Promise<Person | null> {

    const cookieStore = cookies();

    if (!cookieStore) {
        return null;
    }

    console.log("cookieStore");
    console.log(cookieStore.toString());

    const { success, data } = await fetchValidateConsumer(cookieStore.toString());

    if (!success) {
        return null;
    }

    return data!;
}