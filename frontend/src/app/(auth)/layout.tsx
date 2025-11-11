import React from "react";

export default function AuthLayout({
    children,
} : {
    children: React.ReactNode;
}) {
    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-950">
            {children}
        </main>
    )
}