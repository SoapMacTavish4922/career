import api from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const userService = {

    // ── Get full profile ──────────────────────────────────────────────────────
    // Called on edit-details page to pre-fill registration form

    getProfile: async () => {
        const res = await api.get(ENDPOINTS.user.profile);
        return res.data;
        // Returns AllFormData shape
    },

    // ── Update profile ────────────────────────────────────────────────────────
    // Called on edit-details submit
    // PATCH — only sends changed fields

    updateProfile: async (data: any) => {
        const res = await api.patch(ENDPOINTS.user.update, data);
        return res.data;
    },

    // ── Update profile photo ──────────────────────────────────────────────────
    // File upload must use FormData + multipart header
    // Returns { photo_url: "https://..." }

    updatePhoto: async (file: File) => {
        const formData = new FormData();
        formData.append("profile_photo", file);
        const res = await api.post(ENDPOINTS.user.photo, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    // ── Update password ───────────────────────────────────────────────────────
    // Called on profile page password section

    updatePassword: async (data: {
        current_password: string;
        password: string;
        password_confirmation: string;
    }) => {
        const res = await api.patch(ENDPOINTS.user.password, data);
        return res.data;
    },

    // ── Request email change — Step 1 ─────────────────────────────────────────
    // Sends OTP to new email address

    requestEmailChange: async (newEmail: string) => {
        const res = await api.post(ENDPOINTS.user.email, { email: newEmail });
        return res.data;
    },

    // ── Confirm email change — Step 2 ─────────────────────────────────────────
    // Verifies OTP and updates email in DB

    confirmEmailChange: async (otp: string) => {
        const res = await api.patch(ENDPOINTS.user.email, { otp });
        return res.data;
    },

    // ── Submit registration form ──────────────────────────────────────────────
    // Called from DeclareAndSubmit on first time registration

    submitRegistration: async (data: any) => {
        const res = await api.post(ENDPOINTS.registration.submit, data);
        return res.data;
    },

    // ── Update registration form ──────────────────────────────────────────────
    // Called from DeclareAndSubmit on edit-details flow

    updateRegistration: async (data: any) => {
        const res = await api.patch(ENDPOINTS.registration.update, data);
        return res.data;
    },
};