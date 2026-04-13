"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
}

type TouchedState = {
  firstName: boolean;
  email: boolean;
}

type FormErrors = {
  firstName?: string;
  email?: string;
}


function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  return errors;
}

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", email: "" });
  const [touched, setTouched] = useState<TouchedState>({ firstName: false, email: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    setTouched({ firstName: true, email: true });
    if (!isValid) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In triggered");
  };

  return (
    <div className="flex min-h-screen bg-gray-200">


      <div className="relative flex-1 overflow-hidden hidden md:flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 to-blue-900/30" />
      </div>

      <div className="w-full md:w-[420px] flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 px-8 py-10">

        <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center shadow-inner">
          <Image src="/login-above.png" alt="Signup Illustration" width={96} height={96} className="object-contain" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Create your account!</h1>
        <p className="text-xs text-gray-500 text-center mb-6">
          Enter your email ID and verify to make an account
        </p>

        <div className="w-full bg-white rounded-2xl shadow-md px-6 py-6">
          {submitSuccess ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Verification Email Sent!</h3>
              <p className="text-xs text-gray-500">
                We&apos;ve sent a verification link to <span className="font-medium text-gray-700">{form.email}</span>. Please check your inbox.
              </p>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setTouched({ firstName: false, email: false });
                  setForm({ firstName: "", lastName: "", email: "" });
                }}
                className="mt-4 text-xs text-blue-600 hover:underline font-medium"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  First Name <span className="text-orange-500">*</span>
                </label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="eg. Joe"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("firstName")}
                  className={`w-full px-3 py-2 border rounded-lg text-xs outline-none transition-all duration-200 placeholder-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 ${touched.firstName && errors.firstName ? "border-red-400 focus:ring-red-100 focus:border-red-400" : "border-gray-300"}`}
                />
                {touched.firstName && errors.firstName && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-800 mb-1">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="eg. William"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none transition-all duration-200 placeholder-gray-300 text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  Email ID <span className="text-orange-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="eg. joewilliam@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-3 py-2 border rounded-lg text-xs outline-none transition-all duration-200 placeholder-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 ${touched.email && errors.email ? "border-red-400 focus:ring-red-100 focus:border-red-400" : "border-gray-300"}`}
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 mb-3 tracking-wide disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending verification...
                  </>
                ) : (
                  "Verify Email ID"
                )}
              </button>



            </form>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-5">
          Have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Log-in
          </Link>
        </p>
      </div>
    </div>
  );
}