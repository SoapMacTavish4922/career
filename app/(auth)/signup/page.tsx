"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = "details" | "otp" | "password" | "success";

type FormState = {
    userName: string;
    email: string;
    otp: string[];
    password: string;
    confirmPassword: string;
};

type Errors = {
    userName?: string;
    email?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (pw: string) =>
    pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);

// ── Reusable Input ────────────────────────────────────────────────────────────

function Field({
    label, name, type = "text", placeholder, value, onChange, onBlur, error, required, rightSlot,
}: {
    label: string; name: string; type?: string; placeholder: string;
    value: string; onChange: (v: string) => void; onBlur?: () => void;
    error?: string; required?: boolean; rightSlot?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-800">
                {label} {required && <span className="text-orange-500">*</span>}
            </label>
            <div className="relative">
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={`w-full px-3 py-2.5 border rounded-lg text-xs outline-none transition-all duration-200 
                        placeholder-gray-300 text-gray-800 focus:ring-2
                        ${error
                            ? "border-red-400 focus:ring-red-100 focus:border-red-400"
                            : "border-gray-300 focus:ring-orange-100 focus:border-orange-500"
                        }
                        ${rightSlot ? "pr-20" : ""}
                    `}
                />
                {rightSlot && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

// ── Password Strength Bar ─────────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
    if (!password) return null;

    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^a-zA-Z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;
    const labels = ["Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

    return (
        <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-gray-200"}`}
                    />
                ))}
            </div>
            <p className={`text-xs font-medium ${score <= 1 ? "text-red-500" : score === 2 ? "text-orange-500" : score === 3 ? "text-yellow-600" : "text-green-600"}`}>
                {labels[score - 1] ?? ""}
            </p>
        </div>
    );
}

// ── Submit Button ─────────────────────────────────────────────────────────────

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-semibold
                transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                flex items-center justify-center gap-2"
        >
            {loading ? (
                <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Please wait...
                </>
            ) : label}
        </button>
    );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
    const [step, setStep] = useState<Step>("details");
    const [form, setForm] = useState<FormState>({
        userName: "", email: "", otp: ["", "", "", "", "", ""],
        password: "", confirmPassword: "",
    });
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const update = (field: keyof FormState, value: string) =>
        setForm((p) => ({ ...p, [field]: value }));

    const clearError = (field: keyof Errors) =>
        setErrors((p) => { const e = { ...p }; delete e[field]; return e; });

    // ── Step 1: Details ───────────────────────────────────────────────────────

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Errors = {};
        if (!form.userName.trim()) newErrors.userName = "Username is required.";
        if (!isValidEmail(form.email)) newErrors.email = "Please enter a valid email address.";
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200)); // simulate API
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

        // Auto-focus next
        if (value && index < 5) {
            const next = document.getElementById(`otp-${index + 1}`);
            next?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !form.otp[index] && index > 0) {
            const prev = document.getElementById(`otp-${index - 1}`);
            prev?.focus();
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
        if (otpValue.length < 6) return setErrors({ otp: "Please enter the 6-digit OTP sent to your email ID." });

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200)); 
        setLoading(false);

        // Simulating OTP check — replace with real API
        if (otpValue !== "123456") {
            return setErrors({ otp: "Invalid OTP. Please try again." });
        }
        setStep("password");
    };

    // ── Step 3: Password ──────────────────────────────────────────────────────

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Errors = {};
        if (!isStrongPassword(form.password))
            newErrors.password = "Min 8 chars, 1 uppercase, 1 number required.";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";
        if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500)); // simulate register API
        setLoading(false);
        setStep("success");
    };

    // ── Step indicator ────────────────────────────────────────────────────────

    const stepIndex = { details: 0, otp: 1, password: 2, success: 3 };
    const steps = ["Details", "Verify", "Password"];

    return (
        <div className="flex min-h-screen bg-gray-200">
            {/* Left panel */}
            <div className="relative flex-1 overflow-hidden hidden md:flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 to-blue-900/30" />
            </div>

            {/* Right panel */}
            <div className="w-full md:w-[420px] flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 px-8 py-10">

                {/* Logo */}
                <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center shadow-inner">
                    <Image src="/login-above.png" alt="Signup" width={80} height={80} className="object-contain" />
                </div>

                <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Create your account</h1>
                <p className="text-xs text-gray-500 text-center mb-5">
                    {step === "details" && "Enter your details to get started"}
                    {step === "otp" && `We sent a 6-digit OTP to ${form.email}`}
                    {step === "password" && "Set a strong password for your account"}
                    {step === "success" && "You're all set!"}
                </p>

                {/* Step indicator */}
                {step !== "success" && (
                    <div className="flex items-center gap-2 mb-6">
                        {steps.map((label, i) => {
                            const current = stepIndex[step];
                            const done = i < current;
                            const active = i === current;
                            return (
                                <div key={label} className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1.5`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                            ${done ? "bg-green-500 text-white" : active ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-500"}`}
                                        >
                                            {done ? (
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : i + 1}
                                        </div>
                                        <span className={`text-xs font-medium ${active ? "text-gray-900" : "text-gray-400"}`}>
                                            {label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`w-8 h-px ${i < current ? "bg-green-400" : "bg-gray-300"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Card */}
                <div className="w-full bg-white rounded-2xl shadow-md px-6 py-6">

                    {/* ── Step 1: Details ── */}
                    {step === "details" && (
                        <form onSubmit={handleDetailsSubmit} noValidate className="flex flex-col gap-4">
                            <Field
                                label="Username" name="username" placeholder="eg. jagdishK23"
                                value={form.userName} onChange={(v) => { update("userName", v); clearError("userName"); }}
                                error={errors.userName} required
                            />
                            <Field
                                label="Email ID" name="email" type="email" placeholder="eg. joe@gmail.com"
                                value={form.email} onChange={(v) => { update("email", v); clearError("email"); }}
                                error={errors.email} required
                            />
                            <SubmitButton loading={loading} label="Send OTP" />
                        </form>
                    )}

                    {/* ── Step 2: OTP ── */}
                    {step === "otp" && (
                        <form onSubmit={handleOtpSubmit} noValidate className="flex flex-col gap-5">
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-medium text-gray-800">
                                    Enter the 6-digit OTP sent to your email ID <span className="text-orange-500">*</span>
                                </label>
                                <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                                    {form.otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            className={`w-11 h-12 text-center text-base font-bold border rounded-xl outline-none transition-all
                                                focus:ring-2 focus:ring-orange-100 focus:border-orange-500
                                                ${errors.otp ? "border-red-400" : digit ? "border-gray-900 bg-gray-50" : "border-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                {errors.otp && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.otp}
                                    </p>
                                )}
                            </div>

                            <SubmitButton loading={loading} label="Verify OTP" />

                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <button
                                    type="button"
                                    onClick={() => setStep("details")}
                                    className="hover:text-gray-800 transition-colors"
                                >
                                    ← Change email
                                </button>
                                {resendTimer > 0 ? (
                                    <span className="text-gray-400">Resend in {resendTimer}s</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => { startResendTimer(); }}
                                        className="text-orange-500 font-medium hover:underline"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* ── Step 3: Password ── */}
                    {step === "password" && (
                        <form onSubmit={handlePasswordSubmit} noValidate className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <Field
                                    label="New Password" name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min 8 chars, 1 uppercase, 1 number"
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
                                label="Confirm Password" name="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Re-enter your password"
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

                            <SubmitButton loading={loading} label="Create Account" />
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
                                    Welcome, <span className="font-semibold text-gray-700">{form.userName}</span>. Your account is ready.
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
            </div>
        </div>
    );
}