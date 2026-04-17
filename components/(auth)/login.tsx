"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [touched, setTouched] = useState<TouchedState>({
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (field: keyof TouchedState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValid) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Store token
      localStorage.setItem("token", data.token);

      // ✅ Redirect using Next router
      router.push("/dashboard");

    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In triggered");
  };

  return (
    <>
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

          {/* 🔴 API ERROR */}
          {apiError && (
            <p className="text-xs text-red-500 mb-3 text-center">
              {apiError}
            </p>
          )}

          {/* EMAIL */}
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
              className={`w-full px-3 py-2 border rounded-lg text-xs outline-none transition-all duration-200 placeholder-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 ${touched.email && errors.email
                ? "border-red-400 focus:ring-red-100 focus:border-red-400"
                : "border-gray-300"
                }`}
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
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
                className={`w-full px-3 py-2 pr-9 border rounded-lg text-xs outline-none transition-all duration-200 placeholder-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 ${touched.password && errors.password
                  ? "border-red-400 focus:ring-red-100 focus:border-red-400"
                  : "border-gray-300"
                  }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                👁
              </button>
            </div>

            {touched.password && errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}

            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 hover:underline font-medium"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot password?
            </Link>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold disabled:opacity-60 flex items-center justify-center"
          >
            {isSubmitting ? "Signing in..." : "Log In"}
          </button>
        </form>
      </div>

      <p className="text-xs text-gray-500 mt-5">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 font-semibold">
          Sign up
        </Link>
      </p>
    </>
  );
}