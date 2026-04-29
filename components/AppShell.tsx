"use client"; // ← client directive goes here instead

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { setSessionExpiryHandler } from "@/lib/api/client";
import SessionExpiredOverlay from "@/components/career-portal/SessionExpiryOverlay";
import { usePathname } from "next/navigation";           // ← add useRef
import api from "@/lib/api/client";                  // ← add api
import { ENDPOINTS } from "@/lib/api/endpoints";     // ← add ENDPOINTS

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isAuthPage = AUTH_ROUTES.some((r) => pathname.startsWith(r));
    const { triggerSessionExpiry, isLoggedIn } = useAuth(); // ← add isLoggedIn
    const lastActivityRef = useRef<number>(Date.now());
    const INACTIVE_LIMIT = 30 * 60 * 1000;  // 30 min — if no activity skip ping


    useEffect(() => {
        setSessionExpiryHandler(triggerSessionExpiry);
    }, [triggerSessionExpiry]);

    useEffect(() => {
        if (!isLoggedIn) return;

        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        window.addEventListener("mousemove", updateActivity);
        window.addEventListener("keydown", updateActivity);
        window.addEventListener("click", updateActivity);
        window.addEventListener("scroll", updateActivity);
        window.addEventListener("touchstart", updateActivity);

        const interval = setInterval(async () => {
            const timeSinceActivity = Date.now() - lastActivityRef.current;
            if (timeSinceActivity > INACTIVE_LIMIT) return;
            try {
                await api.post(ENDPOINTS.auth.heartbeat);
            } catch (error: any) {
                console.warn("Heartbeat failed:", error?.response?.status);
                // axios interceptor handles token refresh
            }
        }, 20 * 60 * 1000);

        return () => {
            clearInterval(interval);
            window.removeEventListener("mousemove", updateActivity);
            window.removeEventListener("keydown", updateActivity);
            window.removeEventListener("click", updateActivity);
            window.removeEventListener("scroll", updateActivity);
            window.removeEventListener("touchstart", updateActivity);
        };
    }, [isLoggedIn]);

    return (
        <>
            {children}
            {!isAuthPage && <SessionExpiredOverlay />}
        </>
    );
}