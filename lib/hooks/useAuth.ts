import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.services";

// Signup page step 1 — sends OTP to email
export function useSendOtp() {
    return useMutation({
        mutationFn: (email: string) => authService.sendOtp(email),
    });
}

// Signup page step 2 + forgot password step 2 — verifies OTP
export function useVerifyOtp() {
    return useMutation({
        mutationFn: ({ email, otp }: { email: string; otp: string }) =>
            authService.verifyOtp(email, otp),
    });
}

// Signup page step 3 — creates account
export function useSignup() {
    return useMutation({
        mutationFn: authService.signup,
    });
}

// Forgot password step 1 — sends reset OTP
export function useSendForgotPasswordOtp() {
    return useMutation({
        mutationFn: (email: string) => authService.sendForgotPasswordOtp(email),
    });
}

// Forgot password step 3 — resets password
export function useResetPassword() {
    return useMutation({
        mutationFn: authService.resetPassword,
    });
}