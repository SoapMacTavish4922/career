// lib/api/client.ts
// Key change: on final 401 (refresh also failed) → call triggerSessionExpiry()
// instead of window.location.href = "/login"
// This shows the overlay without losing the current page/form state

import axios from "axios";
import Cookies from "js-cookie";
import { ENDPOINTS } from "@/lib/api/endpoints";

const ACCESS_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenHelper = {
    getAccess: () => Cookies.get(ACCESS_TOKEN_KEY),
    getRefresh: () => Cookies.get(REFRESH_TOKEN_KEY),

    setTokens: (accessToken: string, refreshToken: string) => {
        // Access token — no expiry (backend controls via JWT 15 min inactivity)
        Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
        });
        // Refresh token — 7 days
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
            expires: 7,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
        });
    },

    clearTokens: () => {
        Cookies.remove(ACCESS_TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
    },

    isLoggedIn: () => !!Cookies.get(ACCESS_TOKEN_KEY),
};

// ── Refresh queue — prevents duplicate refresh calls ─────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];
let triggerExpiry: (() => void) | null = null; // set by axios interceptor setup

// Called once from app layout to wire up the auth context
export function setSessionExpiryHandler(handler: () => void) {
    triggerExpiry = handler;
}

const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

// ── Request interceptor — attach bearer token ─────────────────────────────────
api.interceptors.request.use((config) => {
    const token = tokenHelper.getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Response interceptor — handle 401 silently ───────────────────────────────
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenHelper.getRefresh();

            if (!refreshToken) {
                // No refresh token — show overlay, don't redirect
                tokenHelper.clearTokens();
                triggerExpiry?.();
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.auth.refresh}`,
                    { refresh_token: refreshToken },
                    { headers: { "Content-Type": "application/json" } }
                );

                const { access_token, refresh_token } = res.data;
                tokenHelper.setTokens(access_token, refresh_token);
                processQueue(null);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh also failed — show overlay instead of redirecting
                processQueue(refreshError);
                tokenHelper.clearTokens();
                triggerExpiry?.(); // ← show SessionExpiredOverlay, page stays intact
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;