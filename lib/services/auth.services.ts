import api from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const authService = {

    // ── Login ─────────────────────────────────────────────────────────────────
    // Returns { access_token, refresh_token, user }
    // Component calls context.login() with this data

    login: async (email: string, password: string) => {
        const res = await api.post(ENDPOINTS.auth.login, { email, password });
        const { data } = res.data; // ← tokens are inside res.data.data

        const user = {
            id: data.id,
            name: data.name,
            email: data.email,
            is_profile_complete: data.is_profile_complete,
            profilePhoto: data.profile_photo ?? undefined,
        };

        return {
            user,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
        };
    },

    // ── Logout ────────────────────────────────────────────────────────────────
    // Tells Laravel to invalidate token server side
    // Component calls context.logout() after this

    logout: async () => {
        await api.post(ENDPOINTS.auth.logout);
    },

    // ── Get current user ──────────────────────────────────────────────────────
    // Used by SessionWarningModal to keep session alive

    getMe: async () => {
        const res = await api.get(ENDPOINTS.auth.me);
        return res.data;
    },

    // Step 1 — create user (backend sends OTP automatically)
    signup: async (data: { name: string; email: string; password: string }) => {
        const res = await api.post(ENDPOINTS.auth.signup, data);
        return res.data;
    },

    // Step 2 — verify OTP (backend activates user)
    verifyOtp: async (email: string, otp: string) => {
        const res = await api.post(ENDPOINTS.auth.verifyOtp, { email, otp });
        return res.data;
    },

    verifyResetOtp: async (email: string, otp: string) => {
        const res = await api.post(ENDPOINTS.auth.verifyResetOtp, { email, otp });
        return res.data;
    },


    // ── Forgot Password — Step 1: Send OTP ───────────────────────────────────

    // Forgot password step 1 — different from signup sendOtp
    forgotPassword: async (email: string) => {
        const res = await api.post(ENDPOINTS.auth.forgotPassword, { email });
        return res.data;
    },

    // ── Forgot Password — Step 3: Reset Password ──────────────────────────────
    resetPassword: async (data: {
        email: string;
        password: string;
        password_confirmation: string;
        reset_token: string;
    }) => {
        const res = await api.post(ENDPOINTS.auth.resetPassword, data);
        return res.data;
    },
};