import api from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const authService = {

    // ── Login ─────────────────────────────────────────────────────────────────
    // Returns { access_token, refresh_token, user }
    // Component calls context.login() with this data

    login: async (email: string, password: string) => {
        const res = await api.post(ENDPOINTS.auth.login, { email, password });
        return res.data;
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

    // ── Signup — Step 1: Send OTP ─────────────────────────────────────────────

    sendOtp: async (email: string) => {
        const res = await api.post(ENDPOINTS.auth.sendOtp, { email });
        return res.data;
    },

    // ── Signup — Step 2: Verify OTP ───────────────────────────────────────────

    verifyOtp: async (email: string, otp: string) => {
        const res = await api.post(ENDPOINTS.auth.verifyOtp, { email, otp });
        return res.data;
    },

    // ── Signup — Step 3: Create account ──────────────────────────────────────

    signup: async (data: {
        userName: string;
        email: string;
        password: string;
    }) => {
        const res = await api.post(ENDPOINTS.auth.signup, data);
        return res.data;
    },

    // ── Forgot Password — Step 1: Send OTP ───────────────────────────────────

    sendForgotPasswordOtp: async (email: string) => {
        const res = await api.post(ENDPOINTS.auth.sendOtp, {
            email,
            type: "forgot_password",
        });
        return res.data;
    },

    // ── Forgot Password — Step 3: Reset Password ──────────────────────────────

    resetPassword: async (data: {
        email: string;
        otp: string;
        password: string;
        password_confirmation: string;
    }) => {
        const res = await api.post(ENDPOINTS.auth.resetPassword, data);
        return res.data;
    },
};