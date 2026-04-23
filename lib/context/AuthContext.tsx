"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import Cookies from "js-cookie";
import api, { tokenHelper } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface User {
    id: number;
    name: string;
    email: string;
    profilePhoto?: string;
    is_profile_complete: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    showSessionExpired: boolean;          // controls the overlay
    setUser: (user: User | null) => void;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    reLogin: (user: User, accessToken: string, refreshToken: string) => void; // re-auth without redirect
    refreshTokens: () => Promise<boolean>;
    triggerSessionExpiry: () => void;      // called by axios interceptor on 401
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSessionExpired, setShowSessionExpired] = useState(false);
    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        tokenHelper.clearTokens();
        Cookies.remove("user_info");
        setUser(null);
        setShowSessionExpired(false);
    }, []);

    // ── Restore user from cookie on every page load ───────────────────────────
    useEffect(() => {
        const savedUser = Cookies.get("user_info");
        const hasToken = tokenHelper.isLoggedIn();

        if (savedUser && hasToken) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                logout();
            }
        } else if (savedUser && !hasToken) {
            // Access token gone but refresh token may exist — try silent refresh
            const tryRefresh = async () => {
                const refreshToken = tokenHelper.getRefresh();
                if (refreshToken) {
                    try {
                        const res = await api.post(ENDPOINTS.auth.refresh, {
                            refresh_token: refreshToken,
                        });
                        const { access_token, refresh_token } = res.data;
                        tokenHelper.setTokens(access_token, refresh_token);
                        setUser(JSON.parse(savedUser));
                        // No redirect — user stays on current page
                    } catch {
                        // Refresh also expired — show session expired overlay
                        setShowSessionExpired(true);
                    }
                } else {
                    logout();
                }
                setIsLoading(false);
            };
            tryRefresh();
            return; // don't hit setIsLoading(false) below
        }

        setIsLoading(false);
    }, []);

    // ── Login — first time or normal login ────────────────────────────────────
    const login = (user: User, accessToken: string, refreshToken: string) => {
        tokenHelper.setTokens(accessToken, refreshToken);
        Cookies.set("user_info", JSON.stringify(user), {
            expires: 7,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
        });
        setUser(user);
        setShowSessionExpired(false);
    };

    // ── Re-login — called from SessionExpiredOverlay ──────────────────────────
    // Restores auth state WITHOUT redirecting
    // User stays exactly where they are — form data is preserved
    const reLogin = (user: User, accessToken: string, refreshToken: string) => {
        tokenHelper.setTokens(accessToken, refreshToken);
        Cookies.set("user_info", JSON.stringify(user), {
            expires: 7,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
        });
        setUser(user);
        setShowSessionExpired(false); // hide the overlay — user continues where they left off
    };



    // ── Trigger session expiry — called by axios interceptor on final 401 ─────
    // Shows the overlay instead of redirecting to login page
    // This way the user doesn't lose their current page or form state
    const triggerSessionExpiry = useCallback(() => {
        setShowSessionExpired(true);
    }, []);

    // ── Refresh tokens — called from SessionWarningModal ─────────────────────
    const refreshTokens = useCallback(async (): Promise<boolean> => {
        const refreshToken = tokenHelper.getRefresh();
        if (!refreshToken) { logout(); return false; }

        try {
            const res = await api.post(ENDPOINTS.auth.refresh, {
                refresh_token: refreshToken,
            });
            const { access_token, refresh_token } = res.data;
            tokenHelper.setTokens(access_token, refresh_token);
            setShowSessionExpired(false);
            return true;
        } catch {
            // Both tokens expired — show overlay, don't redirect
            setShowSessionExpired(true);
            return false;
        }
    }, [logout]);

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isLoading,
            showSessionExpired,
            setUser,
            login,
            logout,
            reLogin,
            refreshTokens,
            triggerSessionExpiry,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}