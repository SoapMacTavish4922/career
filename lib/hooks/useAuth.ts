import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.services";

export function useSignup() {
    return useMutation({
        mutationFn: (data: { name: string; email: string; password: string }) =>
            authService.signup(data),
    });
}

// Shared between signup and forgot password
export function useVerifyOtp() {
    return useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) =>
            authService.verifyOtp(email, otp),
    });
}

// Forgot password step 1 — sends reset OTP
export function useSendForgotPasswordOtp() {
    return useMutation({
        mutationFn: (email: string) => authService.forgotPassword(email),
    });
}

export function useVerifyResetOtp() {
    return useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) =>
            authService.verifyResetOtp(email, otp),
    });
}

// For forgot password step 3
export function useResetPassword() {
    return useMutation({
        mutationFn: authService.resetPassword,
    });
}