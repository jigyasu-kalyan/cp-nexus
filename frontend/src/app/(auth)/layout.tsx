import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-slate-950 to-slate-900 -z-10" />
            {children}
        </main>
    )
}