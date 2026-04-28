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
        verifyResetOtp: "/verify-forgot-otp",   // forgot password OTP
        resetPassword: "/set-password",      // reset
        me: "/auth/me",
    },

    user: {
        profile: "/candidate/profile",
        update: "/user/profile/update",
        photo: "/user/profile/photo",
        password: "/user/profile/password",
    },

    jobs: {
        list: "/jobs",
        detail: (id: string) => `/jobs/${id}`,  // ← GET /jobs/{job.id}
        apply: (id: string) => `/jobs/${id}/apply`,
        applied: "/my-applications",
        interviewSchedule: "/jobs/interviews",
    },

    registration: {
        basicDetails: "/candidate/basic-details",   
        education: "/education",        
        experience: "/employment",      
        update: "/update",
    },

    faqs: {
        list: "/faqs",
    },
};