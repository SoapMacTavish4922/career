"use client";

import { useState } from "react";

interface ExperienceBlock {
    experienceType: string;
    title: string;
    company: string;
    location: string;
    from: string;
    to: string;
    current: string;
    notice: string;
}

interface Props {
    onNext: (data?: any) => void;
    onBack: () => void;
    defaultValues?: { experience?: ExperienceBlock[] };
}

const emptyExperience = (): ExperienceBlock => ({
    experienceType: "", title: "", company: "",
    location: "", from: "", to: "", current: "", notice: "Immediate Joiner",
});

// ── Key blockers ──
const allowOnlyLetters = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
        !/^[a-zA-Z\s]$/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) e.preventDefault();
};

const allowOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
        !/^\d$/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) e.preventDefault();
};

// ── Reusable Field ──
const Field = ({
    label, required, placeholder, value, onChange,
    error, onKeyDown, maxLength,
}: {
    label?: string;
    required?: boolean;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    maxLength?: number;
}) => (
    <div className="flex flex-col gap-1">
        {label && (
            <label className="text-sm text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
        )}
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={allowOnlyLetters}
            maxLength={maxLength}
            className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 w-full
        ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-teal-400"}`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

// ── Experience Card ──
const ExperienceCard = ({
    index, data, onChange, onDelete, errors, showDelete, isFirst
}: {
    index: number;
    data: ExperienceBlock;
    onChange: (index: number, field: keyof ExperienceBlock, value: string) => void;
    onDelete: (index: number) => void;
    errors: Partial<Record<string, string>>;
    showDelete: boolean;
    isFirst: boolean;

}) => {
    const isExperienced = data.experienceType === "experienced";

    return (
        <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 last:border-none">

            {/* Row: Dropdown + Delete button */}
            {/* Row: Dropdown (first entry only) + Delete button */}
            <div className="flex justify-between items-center">

                {isFirst ? (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">
                            Experience Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.experienceType}
                            onChange={(e) => onChange(index, "experienceType", e.target.value)}
                            className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 w-48
          ${errors[`${index}_experienceType`]
                                    ? "border-red-400 focus:ring-red-300"
                                    : "border-gray-300 focus:ring-teal-400"
                                }`}
                        >
                            <option value="">Select type</option>
                            <option value="fresher">Fresher</option>
                            <option value="experienced">Experienced</option>
                        </select>
                        {errors[`${index}_experienceType`] && (
                            <p className="text-xs text-red-500">{errors[`${index}_experienceType`]}</p>
                        )}
                    </div>
                ) : (

                    <p className="text-sm font-semibold text-gray-700">
                        Experience {index + 1}
                    </p>
                )}

                {showDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors mt-5"
                        title="Delete"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Fresher message */}
            {data.experienceType === "fresher" && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3 text-sm text-teal-700">
                    No work experience required for freshers.
                </div>
            )}

            {/* Experienced fields */}
            {isExperienced && (
                <>
                    {/* Job Title */}
                    <Field
                        label="Job Title" required
                        placeholder="eg:Sr Developer"
                        value={data.title}
                        onChange={(v) => onChange(index, "title", v)}
                        error={errors[`${index}_title`]}
                    />

                    {/* Company */}
                    <Field
                        label="Company" required
                        placeholder="eg: XYZ Tech"
                        value={data.company}
                        onChange={(v) => onChange(index, "company", v)}
                        error={errors[`${index}_company`]}
                    />

                    {/* Location */}
                    <Field
                        label="Location" required
                        placeholder="eg: Mumbai"
                        value={data.location}
                        onChange={(v) => onChange(index, "location", v)}
                        onKeyDown={allowOnlyLetters}
                        error={errors[`${index}_location`]}
                    />

                    {/* From + To */}
                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm text-gray-700">
                                From <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="month"
                                value={data.from}
                                onChange={(e) => onChange(index, "from", e.target.value)}
                                className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                  ${errors[`${index}_from`]
                                        ? "border-red-400 focus:ring-red-300"
                                        : "border-gray-300 focus:ring-teal-400"
                                    }`}
                            />
                            {errors[`${index}_from`] && (
                                <p className="text-xs text-red-500">{errors[`${index}_from`]}</p>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm text-gray-700">
                                To <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="month"
                                value={data.to}
                                onChange={(e) => onChange(index, "to", e.target.value)}
                                className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                  ${errors[`${index}_to`]
                                        ? "border-red-400 focus:ring-red-300"
                                        : "border-gray-300 focus:ring-teal-400"
                                    }`}
                            />
                            {errors[`${index}_to`] && (
                                <p className="text-xs text-red-500">{errors[`${index}_to`]}</p>
                            )}
                        </div>
                    </div>

                    {/* Current CTC + Notice Period */}
                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm text-gray-700">
                                Current CTC <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 500000"
                                value={data.current}
                                onChange={(e) => onChange(index, "current", e.target.value)}
                                onKeyDown={allowOnlyNumbers}
                                maxLength={10}
                                className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 w-full
                  ${errors[`${index}_current`]
                                        ? "border-red-400 focus:ring-red-300"
                                        : "border-gray-300 focus:ring-teal-400"
                                    }`}
                            />
                            {errors[`${index}_current`] && (
                                <p className="text-xs text-red-500">{errors[`${index}_current`]}</p>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <label className="text-sm text-gray-700">
                                Notice Period <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.notice}
                                onChange={(e) => onChange(index, "notice", e.target.value)}
                                className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 w-full
                  ${errors[`${index}_notice`]
                                        ? "border-red-400 focus:ring-red-300"
                                        : "border-gray-300 focus:ring-teal-400"
                                    }`}
                            >
                                <option value="Immediate Joiner">Immediate Joiner</option>
                                <option value="15">≤ 15 Days</option>
                                <option value="30">≤ 30 Days</option>
                                <option value="60">≤ 60 Days</option>
                                <option value="90">≤ 90 Days</option>
                                <option value="90+"> &gt; 90 Days</option>
                            </select>
                            {errors[`${index}_notice`] && (
                                <p className="text-xs text-red-500">{errors[`${index}_notice`]}</p>
                            )}
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default function ExperienceDetails({ onNext, onBack, defaultValues }: Props) {
    const [entries, setEntries] = useState<ExperienceBlock[]>(defaultValues?.experience ?? [emptyExperience()]);
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    // ── Validate ──
    const validate = () => {
        const newErrors: Partial<Record<string, string>> = {};

        entries.forEach((entry, i) => {
            if (!entry.experienceType) {
                newErrors[`${i}_experienceType`] = "Please select experience type";
            }
            if (entry.experienceType === "experienced") {
                if (!entry.title.trim()) newErrors[`${i}_title`] = "Job title is required";
                if (!entry.company.trim()) newErrors[`${i}_company`] = "Company is required";
                if (!entry.location.trim()) newErrors[`${i}_location`] = "Location is required";
                if (!entry.from) newErrors[`${i}_from`] = "Start date is required";
                if (!entry.to) newErrors[`${i}_to`] = "End date is required";
                if (entry.from && entry.to && entry.to < entry.from) {
                    newErrors[`${i}_to`] = "End date must be after start date";
                }
                if (!entry.current.trim()) newErrors[`${i}_current`] = "CTC is required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (index: number, field: keyof ExperienceBlock, value: string) => {
        // If first card switches to fresher, remove all extra cards and clear their errors
        if (index === 0 && field === "experienceType" && value === "fresher") {
            setEntries([{ ...emptyExperience(), experienceType: "fresher" }]);
            setErrors({});
            return;
        }

        setEntries((prev) => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
        setErrors((prev) => { const e = { ...prev }; delete e[`${index}_${field}`]; return e; });
    };

    const handleDelete = (index: number) => {
        setEntries((prev) => prev.filter((_, i) => i !== index));
        setErrors((prev) => {
            const e = { ...prev };
            Object.keys(e).forEach((key) => {
                if (key.startsWith(`${index}_`)) delete e[key];
            });
            return e;
        });
    };

    const handleSubmit = () => {
        if (validate()) {
            onNext({ experience: entries });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter experience details</h2>
            <p className="text-sm text-gray-500 mb-6">Tell us about your work experiences!</p>

            <div className="flex flex-col gap-6">
                {entries.map((entry, index) => (
                    <ExperienceCard
                        key={index}
                        index={index}
                        data={entry}
                        onChange={handleChange}
                        onDelete={handleDelete}
                        errors={errors}
                        showDelete={entries.length > 1}
                        isFirst={index === 0}
                    />
                ))}
            </div>


            {/* Add Another — only show if at least one entry is "experienced" */}
            {entries.some((e) => e.experienceType === "experienced") && (
                <div className="flex items-center justify-between mt-4">
                    <button
                        type="button"
                        onClick={() => setEntries((prev) => [...prev, { ...emptyExperience(), experienceType: "experienced" }])}
                        disabled={entries.length >= 5}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors
            ${entries.length >= 5
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-700 hover:text-orange-500"
                            }`}
                    >
                        <span className="text-xl font-bold leading-none">+</span>
                        Add Another
                    </button>
                    <span className="text-xs text-gray-400">{entries.length}/5</span>
                </div>


            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
                <button className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={onBack}>
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );
}