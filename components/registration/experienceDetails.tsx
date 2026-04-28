"use client";

import { useState } from "react";
import { allowOnlyLetters, allowOnlyNumbers } from "@/lib/utils/keyboardHelpers";
import { ExperienceBlock } from "@/lib/types/registration";

interface Props {
    onNext: (data?: any) => void;
    onBack: () => void;
    defaultValues?: { experience?: ExperienceBlock[] };
}

const emptyExperience = (): ExperienceBlock => ({
    experienceType: "", title: "", designation: "", company: "",
    location: "", from: "", to: "", currentctc: "", notice: "Immediate Joiner",
    isCurrentJob: false,
});

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
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 w-full
                ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-teal-400"}`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

// ── Experience Card ──
const ExperienceCard = ({
    index, data, onChange, onDelete, onToggleCurrent,
    errors, showDelete, isFirst, hasCurrentJob,
    notice, onNoticeChange, noticeError,
}: {
    index: number;
    data: ExperienceBlock;
    onChange: (index: number, field: keyof ExperienceBlock, value: string) => void;
    onDelete: (index: number) => void;
    onToggleCurrent: (index: number) => void;
    errors: Partial<Record<string, string>>;
    showDelete: boolean;
    isFirst: boolean;
    hasCurrentJob: boolean;
    notice?: string;
    onNoticeChange?: (v: string) => void;
    noticeError?: string;
}) => {
    const isExperienced = data.experienceType === "experienced";
    const isCurrentJob = !!(data as any).isCurrentJob;

    return (
        <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 last:border-none">

            {/* ── Experience Type dropdown (first card only) + Delete ── */}
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
                    <p className="text-sm font-semibold text-gray-700">Experience {index + 1}</p>
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

            {/* ── Fresher message ── */}
            {data.experienceType === "fresher" && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-3 text-sm text-teal-700">
                    No work experience required for freshers.
                </div>
            )}

            {/* ── Experienced fields ── */}
            {isExperienced && (
                <>
                    {/* ── Current Job Toggle ── */}
                    <div
                        onClick={() => {
                            if (!isCurrentJob && hasCurrentJob) return;
                            onToggleCurrent(index);
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer select-none transition-all
                            ${isCurrentJob
                                ? "border-teal-500 bg-teal-50"
                                : hasCurrentJob
                                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                                    : "border-gray-200 bg-white hover:border-teal-300"
                            }`}
                    >
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Current Job</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {isCurrentJob
                                    ? "This is your current job"
                                    : hasCurrentJob
                                        ? "Another job is already marked as current"
                                        : "Mark this as your current job"
                                }
                            </p>
                        </div>
                        <div className={`w-11 h-6 rounded-full relative transition-colors duration-200
                            ${isCurrentJob ? "bg-teal-500" : "bg-gray-300"}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
                                ${isCurrentJob ? "left-6" : "left-1"}`} />
                        </div>
                    </div>

                    {/* ── Job Title ── */}
                    <Field
                        label="Job Title" required
                        placeholder="eg: Senior Developer"
                        value={data.title}
                        onChange={(v) => onChange(index, "title", v)}
                        onKeyDown={allowOnlyLetters}
                        error={errors[`${index}_title`]}
                    />

                    {/* ── Designation (optional) ── */}
                    <Field
                        label="Designation"
                        placeholder="eg: Tech Lead (optional)"
                        value={(data as any).designation ?? ""}
                        onChange={(v) => onChange(index, "designation" as any, v)}
                        onKeyDown={allowOnlyLetters}
                    />

                    {/* ── Company ── */}
                    <Field
                        label="Company Name" 
                        required
                        placeholder="eg: XYZ Tech"
                        value={data.company}
                        onChange={(v) => onChange(index, "company", v)}
                        error={errors[`${index}_company`]}
                    />

                    {/* ── Location ── */}
                    <Field
                        label="Location" required
                        placeholder="eg: Mumbai"
                        value={data.location}
                        onChange={(v) => onChange(index, "location", v)}
                        onKeyDown={allowOnlyLetters}
                        error={errors[`${index}_location`]}
                    />

                    {/* ── From + To ── */}
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
                                To {!isCurrentJob && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="month"
                                value={data.to}
                                disabled={isCurrentJob}
                                onChange={(e) => onChange(index, "to", e.target.value)}
                                className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                                    ${isCurrentJob
                                        ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                                        : errors[`${index}_to`]
                                            ? "border-red-400 focus:ring-red-300"
                                            : "border-gray-300 focus:ring-teal-400"
                                    }`}
                            />
                            {isCurrentJob && (
                                <p className="text-xs text-teal-500">Currently working here</p>
                            )}
                            {!isCurrentJob && errors[`${index}_to`] && (
                                <p className="text-xs text-red-500">{errors[`${index}_to`]}</p>
                            )}
                        </div>
                    </div>

                    {/* ── Current CTC + Notice Period — only for current job ── */}
                    {isCurrentJob && (
                        <>
                            {/* Current CTC */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700">
                                    Current CTC <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 500000"
                                    value={data.currentctc}
                                    onChange={(e) => onChange(index, "currentctc", e.target.value)}
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

                            {/* Notice Period */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700">
                                    Notice Period <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={notice}
                                    onChange={(e) => onNoticeChange?.(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-48"
                                >
                                    <option value="Immediate Joiner">Immediate Joiner</option>
                                    <option value="15">≤ 15 Days</option>
                                    <option value="30">≤ 30 Days</option>
                                    <option value="60">≤ 60 Days</option>
                                    <option value="90">≤ 90 Days</option>
                                    <option value="90+">&gt; 90 Days</option>
                                </select>
                                {noticeError && (
                                    <p className="text-xs text-red-500">{noticeError}</p>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default function ExperienceDetails({ onNext, onBack, defaultValues }: Props) {
    const [entries, setEntries] = useState<ExperienceBlock[]>(
        defaultValues?.experience?.length
            ? defaultValues.experience
            : [emptyExperience()]
    );
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
    const [notice, setNotice] = useState(
        defaultValues?.experience?.[0]?.notice ?? "Immediate Joiner"
    );

    const currentJobIndex = entries.findIndex((e) => (e as any).isCurrentJob === true);
    const hasCurrentJob = currentJobIndex !== -1;

    // ── Toggle current job ────────────────────────────────────────────────────
    const handleToggleCurrent = (index: number) => {
        setEntries((prev) => prev.map((e, i) => ({
            ...e,
            isCurrentJob: i === index ? !(e as any).isCurrentJob : false,
            to: i === index && !(e as any).isCurrentJob ? "" : e.to,
        })));
    };

    // ── Validate ──────────────────────────────────────────────────────────────
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

                if (!(entry as any).isCurrentJob) {
                    if (!entry.to) newErrors[`${i}_to`] = "End date is required";
                    if (entry.from && entry.to && entry.to < entry.from) {
                        newErrors[`${i}_to`] = "End date must be after start date";
                    }
                }

                if ((entry as any).isCurrentJob && !entry.currentctc.trim()) {
                    newErrors[`${i}_current`] = "Current CTC is required";
                }
            }
        });

        if (hasCurrentJob && !notice) {
            newErrors["notice"] = "Please select a notice period";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (index: number, field: keyof ExperienceBlock, value: string) => {
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
            const entriesWithNotice = entries.map((e) =>
                (e as any).isCurrentJob ? { ...e, notice } : e
            );
            onNext({ experience: entriesWithNotice });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter experience details</h2>
            <p className="text-sm text-gray-500 mb-6">Tell us about your work experience!</p>
            

            <div className="flex flex-col gap-6">
                {entries.map((entry, index) => (
                    <ExperienceCard
                        key={index}
                        index={index}
                        data={entry}
                        onChange={handleChange}
                        onDelete={handleDelete}
                        onToggleCurrent={handleToggleCurrent}
                        errors={errors}
                        showDelete={entries.length > 1}
                        isFirst={index === 0}
                        hasCurrentJob={hasCurrentJob && currentJobIndex !== index}
                        notice={notice}
                        onNoticeChange={setNotice}
                        noticeError={errors["notice"]}
                    />
                ))}
            </div>

            {/* ── Add Another ── */}
            {entries.some((e) => e.experienceType === "experienced") && (
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col items-end gap-1">
                        <button
                            type="button"
                            onClick={() => setEntries((prev) => [
                                ...prev,
                                { ...emptyExperience(), experienceType: "experienced" }
                            ])}
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
                </div>
            )}

            {/* ── Buttons ── */}
            <div className="flex gap-4 mt-8">
                <button
                    className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={onBack}
                >
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