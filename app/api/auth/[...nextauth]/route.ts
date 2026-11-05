// auth.ts
import { fetchLoginCustomer } from "@/data/data-rest";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                console.log("AUTHORIZE", credentials);

                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const { success, data, message } = await fetchLoginCustomer({
                    email: credentials.email,
                    password: credentials.password,
                });

                if (!success || !data) {
                    throw new Error(message);
                }

                return {
                    ...data.person,
                    accessToken: data.token,
                };
            },
        }),
    ],
    pages: {
        signIn: "/",
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
    },
    callbacks: {
        // Save information to expose
        async signIn({ user }) {
            return true;
        },
        // Save private session information
        async jwt({ token, user }) {
            console.log("jwt")
            if (user) {
                token.idPerson = user.idPerson;
                token.name = user.information;
                token.email = user.email!;
                token.accessToken = user.accessToken;
            }

            return token;
        },
        // Save information to expose
        async session({ session, token, user }) {
            if (session.user) {
                session.user.idPerson = token.idPerson;
                session.user.name = token.name;
                session.user.email = token.email!;
            }

            return session;
        },
    },
    // events: {
    //     async signIn(user, account, profile) {
    //         console.log("signIn", user, account, profile);
    //     },
    //     async jwt(token, user, account, profile) {
    //         console.log("jwt", token, user, account, profile);
    //     },
    //     async session(session, token) {
    //         console.log("session", session, token);
    //     },
    // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };