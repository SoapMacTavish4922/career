"use client";

import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { allowOnlyLetters, allowOnlyNumbers } from "@/lib/utils/keyboardHelpers";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    altEmail?: string;
    phone: string;
    altPhone?: string;
    gender: string;
    dob: string;
    notifications?: boolean;
    terms: boolean;
};

interface Props {
    onNext: (data?: any) => void;
    defaultValues?: Partial<FormData>;
}

const ErrorText = ({ error }: { error?: any }) => {
    if (!error) return null;
    return <p className="text-red-500 text-xs mt-1">{error.message}</p>;
};

// ── Profile Photo Upload ──────────────────────────────────────────────────────

function ProfilePhotoUpload({
    photo,
    onPhotoChange,
    error,
}: {
    photo: File | null;
    onPhotoChange: (f: File | null) => void;
    error?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previewUrl = photo ? URL.createObjectURL(photo) : null;

    const handleFile = (f: File) => {
        if (!["image/jpeg", "image/png", "image/jpg"].includes(f.type)) {
            alert("Only JPG or PNG files are allowed.");
            return;
        }
        if (f.size > 2 * 1024 * 1024) {
            alert("File size must be under 2MB.");
            return;
        }
        onPhotoChange(f);
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">
                Profile Photo <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-5">
                {/* Avatar preview */}
                <div
                    onClick={() => inputRef.current?.click()}
                    className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all shrink-0
                        ${error ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50"}`}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    )}
                </div>

                {/* Upload actions */}
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="text-xs font-semibold text-white bg-[#006256] hover:bg-[#004d45] px-4 py-2 rounded-lg transition-colors w-fit"
                    >
                        {photo ? "Change Photo" : "Upload Photo"}
                    </button>
                    {photo && (
                        <button
                            type="button"
                            onClick={() => onPhotoChange(null)}
                            className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors w-fit"
                        >
                            Remove
                        </button>
                    )}
                    <p className="text-xs text-gray-400">JPG or PNG, max 2MB</p>
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                    e.target.value = "";
                }}
            />
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BasicDetails({ onNext, defaultValues }: Props) {
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoError, setPhotoError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: defaultValues ?? {},
    });

    const onSubmit = (data: FormData) => {
        if (!photo) {
            setPhotoError("Profile photo is required.");
            return;
        }
        setPhotoError("");
        onNext({ ...data, profilePhoto: photo });
    };

    const inputClass = (hasError: boolean) =>
        `border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 w-full
        ${hasError
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-300 focus:ring-teal-400"
        }`;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter your details!</h2>
            <p className="text-sm text-gray-500 mb-8">
                Tell us about you and enter your personal information here
            </p>

            <div className="flex flex-col gap-5">

                {/* Profile Photo */}
                <ProfilePhotoUpload
                    photo={photo}
                    onPhotoChange={(f) => { setPhoto(f); if (f) setPhotoError(""); }}
                    error={photoError}

                />

                <div className="h-px bg-gray-100" />

                {/* Row 1: First Name + Last Name */}
                <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm text-gray-700">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Raj"
                            {...register("firstName", {
                                required: "First name is required",

                                minLength: {
                                    value: 2,
                                    message: "Must be at least 2 characters",
                                },

                                maxLength: {
                                    value: 30,
                                    message: "Must be under 30 characters",
                                },

                                pattern: {
                                    value: /^[A-Za-z]+$/,
                                    message: "Only letters allowed",
                                },

                                validate: {
                                    noSpaces: (value: string) =>
                                        value.trim() === value || "No leading or trailing spaces",

                                    onlyLetters: (value: string) =>
                                        /^[A-Za-z]+$/.test(value) || "Only letters allowed",
                                },

                                setValueAs: (value: string) =>
                                    (value || "")
                                        .trim()
                                        .replace(/\b\w/g, (char: string) => char.toUpperCase()),

                            })}
                            maxLength={30}
                            onKeyDown={allowOnlyLetters}
                            className={inputClass(!!errors.firstName)}
                        />
                        
                        <ErrorText error={errors.firstName} />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Kapoor"
                            {...register("lastName", {
                                required: "Last name is required",

                                minLength: {
                                    value: 2,
                                    message: "Must be at least 2 characters",
                                },

                                maxLength: {
                                    value: 30,
                                    message: "Must be under 30 characters",
                                },

                                pattern: {
                                    value: /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
                                    message: "Only letters, spaces, hyphens, and apostrophes allowed",
                                },

                                validate: (value) => {
                                    if (value.trim() !== value) {
                                        return "No leading or trailing spaces";
                                    }
                                    return true;
                                },

                                setValueAs: (value: string) =>
                                    (value || "")
                                        .trim()
                                        .toLowerCase()
                                        .replace(/\b\w/g, (char: string) => char.toUpperCase()),
                            })}
                            maxLength={30}
                            onKeyDown={allowOnlyLetters}
                            className={inputClass(!!errors.lastName)}
                        />
                        <ErrorText error={errors.lastName} />
                    </div>
                </div>

                {/* Row 2: Email */}
                <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm text-gray-700">
                            Email ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="name12@gmail.com"
                            {...register("email", {
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email address",
                                },
                            })}
                            readOnly
                            className={`${inputClass(!!errors.email)} bg-gray-100 cursor-not-allowed`}
                        />
                        <ErrorText error={errors.email} />
                    </div>
                </div>

                {/* Row 3: Phone + Alt Phone */}
                <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm text-gray-700">
                            Phone no. <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="+91"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[6-9]\d{9}$/,
                                    message: "Enter a valid 10-digit Indian number",
                                },
                            })}
                            onKeyDown={allowOnlyNumbers}
                            maxLength={10}
                            className={inputClass(!!errors.phone)}
                        />
                        <ErrorText error={errors.phone} />
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Alternative Phone no.</label>
                        <input
                            type="tel"
                            placeholder="+91"
                            {...register("altPhone", {
                                pattern: {
                                    value: /^[6-9]\d{9}$/,
                                    message: "Enter a valid 10-digit Indian number",
                                },
                            })}
                            onKeyDown={allowOnlyNumbers}
                            maxLength={10}
                            className={inputClass(!!errors.altPhone)}
                        />
                        <ErrorText error={errors.altPhone} />
                    </div>
                </div>

                {/* Row 4: Gender */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col gap-2">
                        {["Male", "Female", "Other"].map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value={option}
                                    {...register("gender", { required: "Please select a gender" })}
                                    className="w-4 h-4 accent-orange-500"
                                />
                                <span className="text-sm text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                    <ErrorText error={errors.gender} />
                </div>

                {/* Row 5: Date of Birth */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700">
                        Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative w-64">
                        <input
                            type="date"
                            {...register("dob", {
                                required: "Date of birth is required",
                                validate: (value) => {
                                    const date = new Date(value);
                                    const today = new Date();
                                    const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                                    const maxAge = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
                                    if (date > today) return "Date cannot be in the future";
                                    if (date > minAge) return "You must be at least 18 years old";
                                    if (date < maxAge) return "Enter a valid date of birth";
                                    return true;
                                },
                            })}
                            className={inputClass(!!errors.dob)}
                        />
                    </div>
                    <ErrorText error={errors.dob} />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col gap-3 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("notifications")}
                            className="w-4 h-4 accent-orange-500"
                        />
                        <span className="text-sm text-gray-600">Receive new job notifications</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register("terms", { required: "You must accept the terms" })}
                            className="w-4 h-4 accent-orange-500"
                        />
                        <span className="text-sm text-gray-600">
                            Terms of user: read and accept the{" "}
                            <a href="#" className="text-blue-500 underline">data privacy</a>{" "}
                            statement.
                        </span>
                    </label>
                    <ErrorText error={errors.terms} />
                </div>

                {/* Save & Continue */}
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-16 py-3 rounded-xl transition-colors"
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        </form>
    );
}