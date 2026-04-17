import axios from "axios";
import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// ── Token Helpers ─────────────────────────────────────────────────────────────
// Central place to read/write/delete JWT tokens from cookies
// Used by axios interceptors and AuthContext

export const tokenHelper = {

    getAccess: () => Cookies.get(ACCESS_TOKEN_KEY),

    getRefresh: () => Cookies.get(REFRESH_TOKEN_KEY),

    setTokens: (accessToken: string, refreshToken: string) => {
        // Access token — NO expiry set on frontend
        // Backend controls 15 min inactivity via JWT
        // Frontend session warning modal handles the UI side
        Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
        });

        // Refresh token — 7 days hard expiry
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

// ── Refresh Queue ─────────────────────────────────────────────────────────────
// Prevents multiple simultaneous refresh requests
// If 5 API calls fail at once, only 1 refresh happens
// Others wait in queue and retry after refresh completes

let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

// ── Axios Instance ────────────────────────────────────────────────────────────
// Pre-configured axios with base URL and default headers
// Use this instead of raw axios everywhere in your app

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// Runs before EVERY request is sent
// Attaches Bearer token from cookie to Authorization header

api.interceptors.request.use((config) => {
    const token = tokenHelper.getAccess();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── Response Interceptor ──────────────────────────────────────────────────────
// Runs after EVERY response comes back
// Handles 401 (token expired) by trying to refresh silently

api.interceptors.response.use(
    (res) => res, // success — pass through unchanged

    async (error) => {
        const originalRequest = error.config;

        // Only handle 401 and only if not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Another refresh already in progress — add to queue
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

            // No refresh token — session fully expired, force login
            if (!refreshToken) {
                tokenHelper.clearTokens();
                window.location.href = "/login?reason=session_expired";
                return Promise.reject(error);
            }

            try {
                // Send refresh token to Laravel
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    { refresh_token: refreshToken },
                    { headers: { "Content-Type": "application/json" } }
                );

                const { access_token, refresh_token } = res.data;

                // Save new tokens
                tokenHelper.setTokens(access_token, refresh_token);

                // Let all queued requests retry
                processQueue(null);

                // Retry original failed request with new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh token also expired — full logout
                processQueue(refreshError);
                tokenHelper.clearTokens();
                Cookies.remove("user_info");
                window.location.href = "/login?reason=session_expired";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;