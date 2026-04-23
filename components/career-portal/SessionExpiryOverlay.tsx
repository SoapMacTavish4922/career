"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { authService } from "@/lib/services/auth.services";
import { isValidEmail } from "@/lib/validators/auth";

// ── Session Expired Overlay ───────────────────────────────────────────────────
// Shows a transparent gradient overlay when JWT expires
// User can re-login without losing their current page/form data
// On success → sends refresh token → gets new tokens → continues where they left off

export default function SessionExpiredOverlay() {
    const { showSessionExpired, reLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!showSessionExpired) return null;

    const handleReLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);
        try {
            const data = await authService.login(email, password);
            // reLogin restores auth state without redirecting
            // user stays on the exact page/form they were on
            reLogin(data.user, data.access_token, data.refresh_token);
        } catch (err: any) {
            const status = err?.response?.status;
            if (status === 401) {
                setError("Invalid email or password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // ── Full screen transparent gradient overlay ──
        <div className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
                background: "linear-gradient(135deg, rgba(0,98,86,0.85) 0%, rgba(0,77,69,0.90) 100%)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
            }}
        >
            {/* Noise texture for depth */}
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

                {/* Top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#006256] to-emerald-400" />

                <div className="px-8 py-8 flex flex-col gap-6">

                    {/* Icon + heading */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <svg className="w-7 h-7 text-[#F26F24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Session Expired</h2>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                Your session has expired due to inactivity.
                                Log in again to continue — your progress is saved.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleReLogin} className="flex flex-col gap-3">

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-700">Email ID</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none
                                    focus:ring-2 focus:ring-[#006256]/20 focus:border-[#006256] transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                    className="w-full px-3 py-2.5 pr-16 border border-gray-300 rounded-xl text-sm outline-none
                                        focus:ring-2 focus:ring-[#006256]/20 focus:border-[#006256] transition-all"
                                />
                                <button type="button" onClick={() => setShowPass((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-medium">
                                    {showPass ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-[#006256] hover:bg-[#004d45] text-white text-sm font-bold rounded-xl
                                transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                                flex items-center justify-center gap-2 mt-1"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Logging in...
                                </>
                            ) : "Continue Session"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span className="flex-1 h-px bg-gray-100" />
                        or
                        <span className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Full logout option */}
                    <button
                        onClick={() => {
                            // Full logout — clears everything including saved progress
                            window.location.href = "/login";
                        }}
                        className="w-full py-2.5 border border-gray-200 text-gray-500 text-sm font-semibold rounded-xl
                            hover:bg-gray-50 transition-colors text-center"
                    >
                        Log out completely
                    </button>
                </div>
            </div>
        </div>
    );
}