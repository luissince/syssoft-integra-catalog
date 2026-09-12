"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSyncProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const channel = new BroadcastChannel("auth-sync");

        channel.onmessage = (event) => {
            if (
                event.data === "LOGIN" ||
                event.data === "LOGOUT"
            ) {
                router.refresh();
            }
        };

        return () => {
            channel.close();
        };
    }, [router]);

    return <>{children}</>;
}