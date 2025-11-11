import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/api";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                try {
                    const response = await api.post('/auth/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const { user, token } = response.data;
                    if (user && token) {
                        return {
                            ...user,
                            backendToken: token,
                        };
                    } else {
                        return null;
                    }
                } catch (error: any) {
                    throw new Error(error.response?.data?.message || "Login failed");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.backendToken = (user as any).backendToken;
                token.id = (user as any).id;
                token.username = (user as any).username;
            }
            return token;
        },
        async session({session, token}) {
            return {
                ...session,
                backendToken: token.backendToken as string,
                user: {
                    ...session.user,
                    id: token.id as string,
                    username: token.username as string,
                },
            } as any;
        },
    },
    pages: {
        signIn: '/login',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };