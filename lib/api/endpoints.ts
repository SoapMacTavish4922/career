// ── All API Endpoints ─────────────────────────────────────────────────────────
// Single source of truth for all Laravel routes
// Change endpoint once here — updates everywhere

export const ENDPOINTS = {

    auth: {
        login: "/v1/login",
        signup: "/auth/signup",
        logout: "/auth/logout",
        refresh: "/auth/refresh",
        sendOtp: "/auth/send-otp",
        verifyOtp: "/auth/verify-otp",
        resetPassword: "/auth/reset-password",
        me: "/auth/me",
    },

    user: {
        profile: "/user/profile",
        update: "/user/profile/update",
        photo: "/user/profile/photo",
        password: "/user/profile/password",
    },

    jobs: {
        list: "/jobs",
        detail: (slug: string) => `/jobs/${slug}`,
        apply: (id: number) => `/jobs/${id}/apply`,
        applied: "/jobs/applied",
        interviewSchedule: "/jobs/interviews",
    },

    registration: {
        submit: "/registration/submit",
        update: "/registration/update",
    },

    faqs: {
        list: "/faqs",
    },
};