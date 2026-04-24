"use client"; // ← client directive goes here instead

import { useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { setSessionExpiryHandler } from "@/lib/api/client";
import SessionExpiredOverlay from "@/components/career-portal/SessionExpiryOverlay";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { triggerSessionExpiry } = useAuth();

    useEffect(() => {
        setSessionExpiryHandler(triggerSessionExpiry);
    }, [triggerSessionExpiry]);

    return (
        <>
            {children}
            <SessionExpiredOverlay />
        </>
    );
}