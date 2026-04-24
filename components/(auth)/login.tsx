"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { authService } from "@/lib/services/auth.services";

// ── Validation ────────────────────────────────────────────────────────────────

type FormState = {
  email: string;
  password: string;
};

type TouchedState = {
  email: boolean;
  password: boolean;
};

type FormErrors = {
  email?: string;
  password?: string;
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.password.trim()) {
    errors.password = "Password is required.";
  }
  return errors;
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const reason = searchParams.get("reason");

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [touched, setTouched] = useState<TouchedState>({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setApiError(""); // clear API error on input change
  };

  const handleBlur = (field: keyof TouchedState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ── Submit — hits POST /auth/login via axios ───────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      // authService.login sends POST /auth/login via axios
      // Bearer token + refresh token saved to cookies automatically
      const data1 = await authService.login(form.email, form.password);
      
      console.log(data1);

      login(data1.user, data1.access_token, data1.refresh_token);

      // First time user (no profile) → registration form
      // Returning user → search jobs page
      if (!data1.user.is_profile_complete) {
        router.push("/registration/forms");
      } else {
        router.push("/portal/search-jobs");
      }

    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        setApiError("Invalid email or password.");
      } else if (status === 422) {
        setApiError("Please check your credentials.");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Logo */}
      <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center shadow-inner">
        <Image
          src="/login-above.png"
          alt="Login Illustration"
          width={96}
          height={96}
          className="object-contain"
        />
      </div>

      <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">
        Welcome back!
      </h1>
      <p className="text-xs text-gray-500 text-center mb-6">
        Enter your credentials to access your account
      </p>

      <div className="w-full bg-white rounded-2xl shadow-md px-6 py-6">
        <form onSubmit={handleSubmit} noValidate>

          {/* ── Session expired banner ── */}
          {reason === "session_expired" && (
            <div className="bg-orange-50 border border-orange-200 text-orange-700 text-xs rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
              </svg>
              Your session expired. Please log in again.
            </div>
          )}

          {/* ── API error ── */}
          {apiError && (
            <p className="text-xs text-red-500 mb-3 text-center flex items-center justify-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {apiError}
            </p>
          )}

          {/* ── Email ── */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Email ID <span className="text-orange-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="eg. name232@gmail.com"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              className={`w-full px-3 py-2 border rounded-lg text-xs outline-none transition-all duration-200
                                placeholder-gray-300 text-gray-800 focus:ring-2
                                ${touched.email && errors.email
                  ? "border-red-400 focus:ring-red-100 focus:border-red-400"
                  : "border-gray-300 focus:ring-orange-100 focus:border-orange-500"
                }`}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* ── Password ── */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Password <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                className={`w-full px-3 py-2 pr-16 border rounded-lg text-xs outline-none transition-all duration-200
                                    placeholder-gray-300 text-gray-800 focus:ring-2
                                    ${touched.password && errors.password
                    ? "border-red-400 focus:ring-red-100 focus:border-red-400"
                    : "border-gray-300 focus:ring-orange-100 focus:border-orange-500"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 hover:underline font-medium mt-1 inline-block"
            >
              Forgot password?
            </Link>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-semibold
                            transition-all disabled:opacity-60 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : "Log In"}
          </button>
        </form>
      </div>

      <p className="text-xs text-gray-500 mt-5">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}