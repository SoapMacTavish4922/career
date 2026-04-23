"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { isValidEmail, isStrongPassword } from "@/lib/validators/auth";
import { AuthStep, ForgotPasswordFormState, AuthErrors } from "@/lib/types/auth";
import Field from "@/components/ui/Fields";
import SubmitButton from "@/components/ui/SubmitButton";
import PasswordStrength from "@/components/ui/PasswordStrength";
import OtpInput from "@/components/ui/OtpInput";
import StepIndicator from "@/components/ui/StepIndicator"

const stepIndex: Record<AuthStep, number> = { email: 0, otp: 1, password: 2, success: 3 };
// ── MAIN ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<AuthStep>("email");
    const [form, setForm] = useState<ForgotPasswordFormState>({
        email: "", otp: ["", "", "", "", "", ""],
        password: "", confirmPassword: "",
    });
    const [errors, setErrors] = useState<AuthErrors>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const update = (field: keyof ForgotPasswordFormState, value: string) =>
        setForm((p) => ({ ...p, [field]: value }));

    const clearError = (field: keyof AuthErrors) =>
        setErrors((p) => { const e = { ...p }; delete e[field]; return e; });

    // ── Step 1: Email ─────────────────────────────────────────────────────────

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEmail(form.email))
            return setErrors({ email: "Please enter a valid email address." });

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200)); // replace with API call
        setLoading(false);
        setStep("otp");
        startResendTimer();
    };

    // ── Step 2: OTP ───────────────────────────────────────────────────────────

    const startResendTimer = () => {
        setResendTimer(30);
        const interval = setInterval(() => {
            setResendTimer((t) => {
                if (t <= 1) { clearInterval(interval); return 0; }
                return t - 1;
            });
        }, 1000);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...form.otp];
        newOtp[index] = value;
        setForm((p) => ({ ...p, otp: newOtp }));
        clearError("otp");
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !form.otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...form.otp];
        pasted.split("").forEach((char, i) => { newOtp[i] = char; });
        setForm((p) => ({ ...p, otp: newOtp }));
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = form.otp.join("");
        if (otpValue.length < 6)
            return setErrors({ otp: "Please enter the 6-digit OTP sent to your email ID." });

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200)); // replace with API call
        setLoading(false);

        if (otpValue !== "123456")
            return setErrors({ otp: "Invalid OTP. Please try again." });

        setStep("password");
    };

    // ── Step 3: Reset Password ────────────────────────────────────────────────

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: AuthErrors = {};
        if (!isStrongPassword(form.password))
            newErrors.password = "Min 8 chars, 1 uppercase, 1 number and 1 symbol required.";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500)); // replace with API call
        setLoading(false);
        setStep("success");
    };

    return (
        <>
            {/* Logo */}
            <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center shadow-inner">
                <Image src="/login-above.png" alt="Forgot Password" width={96} height={96} className="object-contain" />
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Forgot Password?</h1>
            <p className="text-xs text-gray-500 text-center mb-5">
                {step === "email" && "Enter your registered email to receive a reset OTP"}
                {step === "otp" && `Enter the 6-digit OTP sent to ${form.email}`}
                {step === "password" && "Set a new strong password for your account"}
                {step === "success" && "Your password has been reset successfully"}
            </p>

            {/* Step indicator */}
            {step !== "success" && (
                <StepIndicator
                    steps={["Details", "Verify", "Password"]}
                    currentIndex={stepIndex[step]}
                />
            )}

            {/* Card */}
            <div className="w-full bg-white rounded-2xl shadow-md px-6 py-6">

                {/* ── Step 1: Email ── */}
                {step === "email" && (
                    <form onSubmit={handleEmailSubmit} noValidate className="flex flex-col gap-4">
                        <Field
                            label="Registered Email ID" name="email" type="email"
                            placeholder="eg. joe@gmail.com"
                            value={form.email}
                            onChange={(v) => { update("email", v); clearError("email"); }}
                            error={errors.email} required
                        />
                        <SubmitButton loading={loading} label="Send OTP" />
                    </form>
                )}

                {/* ── Step 2: OTP ── */}
                {step === "otp" && (
                    <form onSubmit={handleOtpSubmit} noValidate className="flex flex-col gap-5">
                        <OtpInput
                            value={form.otp}
                            onChange={handleOtpChange}
                            onKeyDown={handleOtpKeyDown}
                            onPaste={handleOtpPaste}
                            error={errors.otp}
                        />

                        <SubmitButton loading={loading} label="Verify OTP" />

                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <button
                                type="button"
                                onClick={() => { setStep("email"); setErrors({}); }}
                                className="hover:text-gray-800 transition-colors"
                            >
                                ← Change email
                            </button>
                            {resendTimer > 0 ? (
                                <span className="text-gray-400">Resend in {resendTimer}s</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={startResendTimer}
                                    className="text-orange-500 font-medium hover:underline"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* ── Step 3: Reset Password ── */}
                {step === "password" && (
                    <form onSubmit={handlePasswordSubmit} noValidate className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Field
                                label="New Password" name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 8 chars, 1 uppercase, 1 number and 1 symbol"
                                value={form.password}
                                onChange={(v) => { update("password", v); clearError("password"); }}
                                error={errors.password} required
                                rightSlot={
                                    <button type="button" onClick={() => setShowPassword((p) => !p)}
                                        className="text-xs text-gray-400 hover:text-gray-600 font-medium px-1"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                }
                            />
                            <PasswordStrength password={form.password} />
                        </div>

                        <Field
                            label="Confirm New Password" name="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Re-enter your new password"
                            value={form.confirmPassword}
                            onChange={(v) => { update("confirmPassword", v); clearError("confirmPassword"); }}
                            error={errors.confirmPassword} required
                            rightSlot={
                                <button type="button" onClick={() => setShowConfirm((p) => !p)}
                                    className="text-xs text-gray-400 hover:text-gray-600 font-medium px-1"
                                >
                                    {showConfirm ? "Hide" : "Show"}
                                </button>
                            }
                        />

                        <SubmitButton loading={loading} label="Reset Password" />
                    </form>
                )}

                {/* ── Success ── */}
                {step === "success" && (
                    <div className="flex flex-col items-center text-center py-4 gap-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Password Reset Successful!</h3>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                Your password has been updated for{" "}
                                <span className="font-semibold text-gray-700">{form.email}</span>.
                                You can now log in with your new password.
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-semibold text-center transition-all"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>

            {step !== "success" && (
                <p className="text-xs text-gray-500 mt-5">
                    Remember your password?{" "}
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                        Log in
                    </Link>
                </p>
            )}
        </>
    );
}