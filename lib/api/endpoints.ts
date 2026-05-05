// ── All API Endpoints ─────────────────────────────────────────────────────────
// Single source of truth for all Laravel routes
// Change endpoint once here — updates everywhere

export const ENDPOINTS = {

    auth: {
        login: "/login",
        signup: "/register",
        logout: "/logout",
        refresh: "/auth/refresh",
        verifyOtp: "/verify-otp",
        forgotPassword: "/forgot-password",
        verifyResetOtp: "/verify-forgot-otp",
        resetPassword: "/set-password",
        heartbeat: "/heartbeat",
        me: "/auth/me",
    },

    user: {
        profile: "/candidate/profile",
        update_edu: "/update-education",
        update_exp: "/update-employment",
        photo: "/candidate/upload-photo",
        password: "/user/profile/password",
    },

    jobs: {
        list: "/jobs",
        detail: (id: string) => `/jobs/${id}`,
        apply: (id: string) => `/jobs/${id}/apply`,
        search: "/jobs/search",
        applied: "/my-applications",
        interviewSchedule: "/jobs/interviews",
    },

    registration: {
        basicDetails: "/candidate/basic-details",
        education: "/education",
        experience: "/employment",
        //update: "/update",
    },

    faqs: {
        list: "/faqs",
    },
};