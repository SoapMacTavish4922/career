"use client"; // ← client directive goes here instead

import { useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { setSessionExpiryHandler } from "@/lib/api/client";
import SessionExpiredOverlay from "@/components/career-portal/SessionExpiryOverlay";
import { usePathname } from "next/navigation";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { triggerSessionExpiry } = useAuth();
    const pathname = usePathname();

    const isAuthPage = AUTH_ROUTES.some((r) => pathname.startsWith(r));

    useEffect(() => {
        setSessionExpiryHandler(triggerSessionExpiry);
    }, [triggerSessionExpiry]);

    return (
        <>
            {children}
            {!isAuthPage && <SessionExpiredOverlay />}
        </>
    );
}