import { DefaultSession } from "next-auth";
import { Person } from "@/types/api-type";

declare module "next-auth" {
    interface User extends Person {
        accessToken: string;
    }

    interface Session {
        user: Person & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        idPerson?: string;
        accessToken?: string;
    }
}