"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { setSessionExpiryHandler } from "@/lib/api/client";
import SessionExpiredOverlay from "@/components/career-portal/SessionExpiryOverlay";
import { usePathname } from "next/navigation";
import api from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import Cookies from "js-cookie";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];
const INACTIVE_LIMIT = 15 * 60 * 1000;      
const HEARTBEAT_INTERVAL = 10 * 60 * 1000;  

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = AUTH_ROUTES.some((r) => pathname.startsWith(r));
    const { triggerSessionExpiry, isLoggedIn } = useAuth();
    const lastActivityRef = useRef<number>(Date.now());

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

            // User inactive for 15 mins → show session expired overlay
            if (timeSinceActivity > INACTIVE_LIMIT) {
                Cookies.remove("auth_token");  
                triggerSessionExpiry();        
                return;
            }

            // User is active → send heartbeat to keep session alive
            try {
                await api.post(ENDPOINTS.auth.heartbeat);
            } catch (error: any) {
                console.warn("Heartbeat failed:", error?.response?.status);
            }
        }, HEARTBEAT_INTERVAL);

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