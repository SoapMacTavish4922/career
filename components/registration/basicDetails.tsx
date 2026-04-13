"use client";

import { useForm } from "react-hook-form";

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

const allowOnlyLetters = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
        !/^[a-zA-Z\s]$/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
        e.preventDefault();
    }
};

const allowOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
        !/^\d$/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
        e.preventDefault();
    }
};

export default function BasicDetails({ onNext, defaultValues }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: defaultValues ?? {},   // ✅ pre-fills all fields including email
    });

    const onSubmit = (data: FormData) => {
        onNext(data);
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
                                minLength: { value: 2, message: "Minimum 2 characters" },
                            })}
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
                            })}
                            onKeyDown={allowOnlyLetters}
                            className={inputClass(!!errors.lastName)}
                        />
                        <ErrorText error={errors.lastName} />
                    </div>
                </div>
                {/* Row 3: Email  */}
                <div className="flex gap-4">
                    {/* Email — autofetched, read-only */}
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
                            readOnly                          // ✅ not editable
                            className={`${inputClass(!!errors.email)} bg-gray-100 cursor-not-allowed`}
                        />
                        <ErrorText error={errors.email} />
                    </div>

                    {/* Alt Email — only render if value exists */}
                    {defaultValues?.altEmail && (  // ✅ fixed: was fetchedData
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm text-gray-700">Alternative Email ID</label>
                            <input
                                type="email"
                                placeholder="123@gmail.com"
                                {...register("altEmail", {
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                                className={inputClass(!!errors.altEmail)}
                            />
                            <ErrorText error={errors.altEmail} />
                        </div>
                    )}
                </div>

                {/* Row 4: Phone + Alt Phone */}
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

                {/* Row 5: Gender */}
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
                                    {...register("gender", {
                                        required: "Please select a gender",
                                    })}
                                    className="w-4 h-4 accent-orange-500"
                                />
                                <span className="text-sm text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                    <ErrorText error={errors.gender} />
                </div>

                {/* Row 6: Date of Birth */}
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
                            {...register("terms", {
                                required: "You must accept the terms",
                            })}
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