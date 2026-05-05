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
import { userService } from "@/lib/services/user.services";
import { clearFormProgress } from "../utils/formProgress";

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
    showSessionExpired: boolean;
    setUser: (user: User | null) => void;
    login: (userData: Omit<User, never>, accessToken: string, refreshToken: string) => Promise<void>;
    reLogin: (userData: Omit<User, never>, accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => void;
    refreshTokens: () => Promise<boolean>;
    triggerSessionExpiry: () => void;
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
        clearFormProgress();
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
    const login = async (user: User, accessToken: string, refreshToken: string) => {
        tokenHelper.setTokens(accessToken, refreshToken);

        let enrichedUser = { ...user };

        // If profile is complete, fetch photo_url and attach it
        if (user.is_profile_complete) {
            try {
                const profile = await userService.getProfile();
                if (profile.photo_url) {
                    enrichedUser.profilePhoto = profile.photo_url;
                }
            } catch {
                // Non-fatal — login still succeeds without photo
            }
        }

        Cookies.set("user_info", JSON.stringify(enrichedUser), {
            expires: 7,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
        });
        setUser(enrichedUser);
        setShowSessionExpired(false);
    };

    // ── Re-login — called from SessionExpiredOverlay ──────────────────────────
    const reLogin = async (user: User, accessToken: string, refreshToken: string) => {
        tokenHelper.setTokens(accessToken, refreshToken);

        let enrichedUser = { ...user };

        if (user.is_profile_complete) {
            try {
                const profile = await userService.getProfile();
                if (profile.photo_url) {
                    enrichedUser.profilePhoto = profile.photo_url;
                }
            } catch {
                // Non-fatal
            }
        }

        Cookies.set("user_info", JSON.stringify(enrichedUser), {
            expires: 7,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
        });
        setUser(enrichedUser);
        setShowSessionExpired(false);
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