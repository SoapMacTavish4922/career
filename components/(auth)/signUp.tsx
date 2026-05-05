"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { isValidEmail, isStrongPassword } from "@/lib/validators/auth";
import { SignupFormState, AuthErrors } from "@/lib/types/auth";
import Field from "@/components/ui/Fields";
import SubmitButton from "@/components/ui/SubmitButton";
import PasswordStrength from "@/components/ui/PasswordStrength";
import OtpInput from "@/components/ui/OtpInput";
import { allowOnlyLetters } from "@/lib/utils/keyboardHelpers";
import { useSignup, useVerifyOtp } from "@/lib/hooks/useAuth";

// ── Step type — only 3 steps now ─────────────────────────────────────────────
type Step = "details" | "otp" | "success";

export default function SignupPage() {

    // ── React Query mutations ─────────────────────────────────────────────────
    const { mutate: verifyOtp, isPending: verifyingOtp } = useVerifyOtp();
    const { mutate: signup, isPending: signingUp } = useSignup();

    const [step, setStep] = useState<Step>("details");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: ["", "", "", "", "", ""] as string[],
    });
    const [errors, setErrors] = useState<AuthErrors & { name?: string; confirmPassword?: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const update = (field: string, value: string) =>
        setForm((p) => ({ ...p, [field]: value }));

    const clearError = (field: string) =>
        setErrors((p) => { const e = { ...p }; delete (e as any)[field]; return e; });

    // ── Step 1: Fill details + submit → sends OTP ─────────────────────────────

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};
        if (!form.name.trim()) newErrors.name = "Full name is required.";
        if (!isValidEmail(form.email)) newErrors.email = "Please enter a valid email address.";
        if (!isStrongPassword(form.password)) newErrors.password = "Min 8 chars, 1 uppercase, 1 number required.";
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

        // All valid — send OTP to email
        // POST /auth/send-otp
        signup({ name: form.name, email: form.email, password: form.password }, {
            onSuccess: () => {
                // Backend created user + sent OTP automatically
                setStep("otp");
                startResendTimer();
            },
            onError: (error: any) => {
                const status = error?.response?.status;
                if (status === 409) {
                    setErrors({ email: "This email is already registered. Please log in." });
                } else if (status === 422) {
                    setErrors({ email: "Please check your details and try again." });
                } else {
                    setErrors({ email: "Failed to create account. Please try again." });
                }
            },
        });
    };

    // ── Step 2: Verify OTP → create account → go to login ────────────────────

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

    const clearOtp = () => {
        setForm((prev) => ({ ...prev, otp: Array(6).fill("") }));
        setTimeout(() => {
            document.getElementById("otp-0")?.focus();
        }, 0);
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
        verifyOtp({ email: form.email, otp: otpValue }, {
            onSuccess: () => {
                setStep("success");
            },
            onError: (error: any) => {
                clearOtp();
                const status = error?.response?.status;
                if (status === 422) {
                    setErrors({ otp: "Invalid OTP. Please try again." });
                } else if (status === 410) {
                    setErrors({ otp: "OTP has expired. Please request a new one." });
                } else {
                    setErrors({ otp: "Failed to verify OTP. Please try again." });
                }
            },
        });

    };


    const handleResendOtp = () => {
        clearOtp();
        setErrors({});
        signup({ name: form.name, email: form.email, password: form.password }, {
            onSuccess: () => startResendTimer(),
            onError: () => setErrors({ otp: "Failed to resend OTP. Please try again." }),
        });
    };

    const loading = signingUp || verifyingOtp;

    return (
        <>
            {/* Logo */}
            <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center shadow-inner">
                <Image src="/login-above.png" alt="Signup" width={80} height={80} className="object-contain" />
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Create your account</h1>
            <p className="text-xs text-gray-500 text-center mb-5">
                {step === "details" && "Fill in your details to get started"}
                {step === "otp" && `We sent a 6-digit OTP to ${form.email}`}
                {step === "success" && "Your account has been created!"}
            </p>

            {/* Card */}
            <div className="w-full bg-white rounded-2xl shadow-md px-6 py-6">

                {/* ── Step 1: Details ── */}
                {step === "details" && (
                    <form onSubmit={handleDetailsSubmit} noValidate className="flex flex-col gap-4">
                        <Field
                            label="Full Name" name="name" placeholder="eg. Raj Sharma"
                            value={form.name}
                            onChange={(v) => { update("name", v); clearError("name"); }}
                            onKeyDown={allowOnlyLetters}
                            error={(errors as any).name} required
                        />
                        <Field
                            label="Email ID" name="email" type="email" placeholder="eg. raj@gmail.com"
                            value={form.email}
                            onChange={(v) => { update("email", v); clearError("email"); }}
                            error={errors.email} required
                        />
                        <div className="flex flex-col gap-1">
                            <Field
                                label="Password" name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 8 chars, 1 uppercase, 1 number"
                                value={form.password}
                                onChange={(v) => { update("password", v); clearError("password"); }}
                                error={errors.password} required
                                rightSlot={
                                    <button type="button" onClick={() => setShowPassword((p) => !p)}
                                        className="text-xs text-gray-400 hover:text-gray-600 font-medium px-1">
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                }
                            />
                            <PasswordStrength password={form.password} />
                        </div>
                        <Field
                            label="Confirm Password" name="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Re-enter your password"
                            value={form.confirmPassword}
                            onChange={(v) => { update("confirmPassword", v); clearError("confirmPassword"); }}
                            error={(errors as any).confirmPassword} required
                            rightSlot={
                                <button type="button" onClick={() => setShowConfirm((p) => !p)}
                                    className="text-xs text-gray-400 hover:text-gray-600 font-medium px-1">
                                    {showConfirm ? "Hide" : "Show"}
                                </button>
                            }
                        />
                        <SubmitButton loading={loading} label="Send OTP" />
                    </form>
                )}

                {/* ── Step 2: OTP Verification ── */}
                {step === "otp" && (
                    <form onSubmit={handleOtpSubmit} noValidate className="flex flex-col gap-5">
                        <OtpInput
                            value={form.otp}
                            onChange={handleOtpChange}
                            onKeyDown={handleOtpKeyDown}
                            onPaste={handleOtpPaste}
                            error={errors.otp}
                        />
                        <SubmitButton loading={loading} label="Verify & Create Account" />

                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <button
                                type="button"
                                onClick={() => { clearOtp(); setStep("details"); setErrors({}); }}
                                className="hover:text-gray-800 transition-colors"
                            >
                                ← Change details
                            </button>
                            {resendTimer > 0 ? (
                                <span className="text-gray-400">Resend in {resendTimer}s</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={signingUp}
                                    className="text-orange-500 font-medium hover:underline disabled:opacity-50"
                                >
                                    {signingUp ? "Sending..." : "Resend OTP"}
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* ── Success ── */}
                {step === "success" && (
                    <div className="flex flex-col items-center text-center py-4 gap-3">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Account Created!</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Welcome, <span className="font-semibold text-gray-700">{form.name}</span>.
                                Your account is ready. Please log in to continue.
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="mt-2 w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-semibold text-center transition-all"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>

            {step !== "success" && (
                <p className="text-xs text-gray-500 mt-5">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                        Log in
                    </Link>
                </p>
            )}
        </>
    );
}