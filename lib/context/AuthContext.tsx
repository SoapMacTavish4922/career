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
    is_profile_complete: boolean; // false = new user, redirect to registration
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;             // true while restoring session on page load
    setUser: (user: User | null) => void;
    login: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    refreshTokens: () => Promise<boolean>; // returns true = success, false = expired
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ── Restore user from cookie on every page load/refresh ──────────────────
    // Without this, user would be logged out on every page refresh
    useEffect(() => {
        const savedUser = Cookies.get("user_info");
        const hasToken = tokenHelper.isLoggedIn();

        if (savedUser && hasToken) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                // Cookie is corrupt — clear everything and start fresh
                logout();
            }
        }

        setIsLoading(false);
    }, []);

    // ── Login ─────────────────────────────────────────────────────────────────
    // Called from login page after successful API response
    // Saves tokens to cookies + user to context

    const login = (user: User, accessToken: string, refreshToken: string) => {
        tokenHelper.setTokens(accessToken, refreshToken);

        Cookies.set("user_info", JSON.stringify(user), {
            expires: 7,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
        });

        setUser(user);
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    // Clears all cookies + resets user state to null
    // Called from MainLayout logout button and session expiry

    const logout = useCallback(() => {
        tokenHelper.clearTokens();
        Cookies.remove("user_info");
        setUser(null);
    }, []);

    // ── Refresh Tokens ────────────────────────────────────────────────────────
    // Called from SessionWarningModal when user clicks "Stay Logged In"
    // Sends refresh token to Laravel → gets new access + refresh tokens
    // Returns true if successful, false if refresh token also expired

    const refreshTokens = useCallback(async (): Promise<boolean> => {
        const refreshToken = tokenHelper.getRefresh();

        if (!refreshToken) {
            logout();
            return false;
        }

        try {
            const res = await api.post(ENDPOINTS.auth.refresh, {
                refresh_token: refreshToken,
            });

            const { access_token, refresh_token } = res.data;
            tokenHelper.setTokens(access_token, refresh_token);
            return true;

        } catch {
            // Refresh token expired — force full logout
            logout();
            return false;
        }
    }, [logout]);

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            isLoading,
            setUser,
            login,
            logout,
            refreshTokens,
        }
        }>
            {children}
        </AuthContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
// Use this in every component that needs user state
// e.g. const { user, isLoggedIn, logout } = useAuth();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}