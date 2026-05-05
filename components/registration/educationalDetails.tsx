"use client";

import { useState } from "react";
import { allowOnlyLetters, allowDecimal, allowOnlyNumbers } from "@/lib/utils/keyboardHelpers";
import { EducationBlock } from "@/lib/types/registration";
import { userService } from "@/lib/services/user.services";


interface Props {
    onNext: (data?: any) => void;
    onBack: () => void;
    defaultValues?: { education?: EducationBlock[] };
    isEditMode?: boolean;
}

const emptyEducation = (): EducationBlock => ({
    id: "", school: "", degree: "", otherDegree: "", fieldOfStudy: "",
    resultType: "", gpa: "", yearOfPassing: "", mode: ""
});

// ── Reusable Field ──
const Field = ({
    placeholder, value, onChange, error, onKeyDown, maxLength, type = "text",
}: {
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    maxLength?: number;
    type?: string;
}) => (
    <div className="flex flex-col gap-0.5">
        <input
            type={type}
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


// ── Single Education Entry Card ──
const EducationCard = ({
    index, data, onChange, onDelete, errors, showDelete, onSave, isSaving, isSaved, isEditMode
}: {
    index: number;
    data: EducationBlock;
    onChange: (index: number, field: keyof EducationBlock, value: string) => void;
    onDelete: (index: number) => void;
    errors: Partial<Record<string, string>>;
    showDelete: boolean;
    onSave?: () => void;
    isSaving?: boolean;
    isSaved?: boolean;
    isEditMode?: boolean;
}) => {
    const isOther = data.degree === "others";
    const is10th = data.degree === "10th";
    return (
        <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 last:border-none">


            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-700">
                        School / University <span className="text-red-500">*</span>
                    </label>
                    {showDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                        >
                            {/* Trash icon SVG */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4h6v2" />
                            </svg>
                        </button>
                    )}
                </div>
                <Field
                    placeholder="eg: XYZ Public School"
                    value={data.school}
                    onChange={(v) => onChange(index, "school", v)}
                    error={errors[`${index}_school`]}
                />
            </div>

            {/* Degree */}
            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">
                    Degree <span className="text-red-500">*</span>
                </label>

                <select
                    value={data.degree}
                    onChange={(e) => {
                        const value = e.target.value;

                        onChange(index, "degree", value);


                        if (value !== "others") {
                            onChange(index, "otherDegree", "");
                        }
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                >
                    <option value="">Select Degree</option>
                    <option value="10th">10th (SSC)</option>
                    <option value="12th">12th (HSC)</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelors">Bachelor's</option>
                    <option value="masters">Master's</option>
                    <option value="phd">PhD</option>
                    <option value="technical">Technical Diploma</option>
                    <option value="others">Others</option>
                </select>

                {errors[`${index}_degree`] && (
                    <p className="text-red-500 text-sm">
                        {errors[`${index}_degree`]}
                    </p>
                )}
            </div>

            {/* ✅ CONDITIONAL FIELD */}
            {isOther && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700">
                        Specify Degree <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your degree"
                        value={data.otherDegree || ""}
                        onChange={(e) =>
                            onChange(index, "otherDegree", e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                    />

                    {errors[`${index}_otherDegree`] && (
                        <p className="text-red-500 text-sm">
                            {errors[`${index}_otherDegree`]}
                        </p>
                    )}
                </div>
            )}

            {/* Field of Study */}
            {!is10th && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700">
                        Field of study <span className="text-red-500">*</span>
                    </label>
                    <Field
                        placeholder="eg: Science"
                        value={data.fieldOfStudy}
                        onChange={(v) => onChange(index, "fieldOfStudy", v)}
                        onKeyDown={allowOnlyLetters}
                        error={errors[`${index}_fieldOfStudy`]}
                    />
                </div>
            )}

            {/* Result Type + Value */}
            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Overall Result</label>

                <div className="flex gap-3 items-start">

                    {/* Dropdown: CGPA or Percentage */}
                    <div className="w-40 flex flex-col gap-0.5">
                        <select
                            value={data.resultType}
                            onChange={(e) => {
                                onChange(index, "resultType", e.target.value);
                                onChange(index, "gpa", ""); // clear value on switch
                            }}
                            className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2
          ${errors[`${index}_resultType`]
                                    ? "border-red-400 focus:ring-red-300"
                                    : "border-gray-300 focus:ring-teal-400"
                                }`}
                        >
                            <option value="">Select type</option>
                            <option value="cgpa">CGPA</option>
                            <option value="percentage">Percentage</option>
                        </select>
                        {errors[`${index}_resultType`] && (
                            <p className="text-xs text-red-500">{errors[`${index}_resultType`]}</p>
                        )}
                    </div>

                    {/* Value input — only shows after type is selected */}
                    {data.resultType && (
                        <div className="w-36 flex flex-col gap-0.5">
                            <Field
                                placeholder={data.resultType === "cgpa" ? "0.0 – 10.0" : "0 – 100"}
                                value={data.gpa}
                                onChange={(v) => {
                                    const num = parseFloat(v);
                                    if (data.resultType === "cgpa" && num > 10.0 && v !== "") return;
                                    if (data.resultType === "percentage" && num > 100 && v !== "") return;
                                    onChange(index, "gpa", v);
                                }}
                                onKeyDown={allowDecimal}
                                maxLength={data.resultType === "percentage" ? 5 : 4}
                                error={errors[`${index}_gpa`]}
                            />
                        </div>
                    )}

                </div>
            </div>

            {/* Year of Passing + Mode */}
            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm text-gray-700">
                        Year of Passing <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="eg: 2022"
                        value={data.yearOfPassing}
                        maxLength={4}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 4) {
                                onChange(index, "yearOfPassing", val);
                            }
                        }}
                        onKeyDown={allowOnlyNumbers}
                        className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
        ${errors[`${index}_yearOfPassing`]
                                ? "border-red-400 focus:ring-red-300"
                                : "border-gray-300 focus:ring-teal-400"
                            }`}
                    />
                    {errors[`${index}_yearOfPassing`] && (
                        <p className="text-xs text-red-500">{errors[`${index}_yearOfPassing`]}</p>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm text-gray-700">
                        Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={data.mode}
                        onChange={(e) => onChange(index, "mode", e.target.value)}
                        className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                ${errors[`${index}_mode`]
                                ? "border-red-400 focus:ring-red-300"
                                : "border-gray-300 focus:ring-teal-400"
                            }`}
                    >
                        <option value="">Select Mode</option>
                        <option value="regular">Regular</option>
                        <option value="part_time">Part Time</option>
                        <option value="distance">Distance</option>
                    </select>
                    {errors[`${index}_mode`] && (
                        <p className="text-xs text-red-500">{errors[`${index}_mode`]}</p>
                    )}
                </div>
            </div>

            {isEditMode && (
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="self-end flex items-center gap-2 text-xs font-semibold bg-[#006256] hover:bg-[#004d45] text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                        </>
                    ) : isSaved ? (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Saved!
                        </>
                    ) : "Save"}
                </button>
            )}
        </div>
    )
};

export default function EducationalDetails({ onNext, onBack, defaultValues, isEditMode }: Props) {
    const [entries, setEntries] = useState<EducationBlock[]>(
        defaultValues?.education?.length
            ? defaultValues.education.map((e) => ({
                id: e.id ?? "",
                school: e.school ?? "",
                degree: e.degree ?? "",
                otherDegree: e.otherDegree ?? "",
                fieldOfStudy: e.fieldOfStudy ?? "",
                resultType: e.resultType ?? "",
                gpa: e.gpa ?? "",
                yearOfPassing: e.yearOfPassing ? String(e.yearOfPassing) : "",
                mode: e.mode ?? "",
            }))
            : [emptyEducation()]
    );
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
    const [savingIndex, setSavingIndex] = useState<number | null>(null);
    const [savedIndex, setSavedIndex] = useState<number | null>(null);
    const handleSaveCard = async (index: number) => {
        const entry = entries[index];
        const newErrors: Partial<Record<string, string>> = {};

        // School
        if (!entry.school.trim()) newErrors[`${index}_school`] = "School is required";

        // Degree
        if (!entry.degree.trim()) newErrors[`${index}_degree`] = "Degree is required";
        if (entry.degree === "others" && !(entry.otherDegree ?? "").trim()) {
            newErrors[`${index}_otherDegree`] = "Please specify your degree";
        }

        // Field of study
        if (entry.degree !== "10th" && !entry.fieldOfStudy.trim()) {
            newErrors[`${index}_fieldOfStudy`] = "Field of study is required";
        }

        // Result
        if (entry.gpa && !entry.resultType) {
            newErrors[`${index}_resultType`] = "Please select CGPA or Percentage";
        }
        if (entry.resultType && !(entry.gpa ?? "").trim()) {
            newErrors[`${index}_gpa`] = "Please enter a value";
        }
        if (entry.resultType === "cgpa" && entry.gpa) {
            const val = parseFloat(entry.gpa);
            if (isNaN(val) || val < 0 || val > 10.0) {
                newErrors[`${index}_gpa`] = "CGPA must be between 0 and 10.0";
            }
        }
        if (entry.resultType === "percentage" && entry.gpa) {
            const val = parseFloat(entry.gpa);
            if (isNaN(val) || val < 0 || val > 100) {
                newErrors[`${index}_gpa`] = "Percentage must be between 0 and 100";
            }
        }

        // Year of passing
        if (!entry.yearOfPassing) {
            newErrors[`${index}_yearOfPassing`] = "Year of passing is required";
        } else {
            const year = parseInt(entry.yearOfPassing);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year < 1950) {
                newErrors[`${index}_yearOfPassing`] = "Enter a valid year of passing";
            } else if (year > currentYear) {
                newErrors[`${index}_yearOfPassing`] = `Year of passing cannot be greater than ${currentYear}`;
            }
        }
        await userService.saveEducation(entry.id, {
            ...entry,
            yearOfPassing: entry.yearOfPassing ? parseInt(entry.yearOfPassing) : "",
        });

        // Mode
        if (!entry.mode) newErrors[`${index}_mode`] = "Mode is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors((p) => ({ ...p, ...newErrors }));
            return;
        }

        if (!entry.id) { alert("Cannot save — missing record ID."); return; }

        setSavingIndex(index);
        try {
            await userService.saveEducation(entry.id, {
                ...entry,
                yearOfPassing: entry.yearOfPassing ? parseInt(entry.yearOfPassing) : "",
            });
            setSavedIndex(index);
            setTimeout(() => setSavedIndex(null), 2000);
        } catch {
            alert("Failed to save. Please try again.");
        } finally {
            setSavingIndex(null);
        }
    };

    // ── Validate ──
    const validate = () => {
        const newErrors: Partial<Record<string, string>> = {};

        entries.forEach((entry, i) => {
            if (!entry.school.trim()) newErrors[`${i}_school`] = "School is required";
            if (!entry.degree.trim()) newErrors[`${i}_degree`] = "Degree is required";
            if (entry.degree !== "10th" && !entry.fieldOfStudy.trim()) {
                newErrors[`${i}_fieldOfStudy`] = "Field of study is required";
            }
            if (entry.gpa && !entry.resultType) {
                newErrors[`${i}_resultType`] = "Please select CGPA or Percentage";
            }
            if (entry.resultType && !(entry.gpa ?? "").trim()) {
                newErrors[`${i}_gpa`] = "Please enter a value";
            }
            if (entry.resultType === "cgpa" && entry.gpa) {
                const val = parseFloat(entry.gpa ?? "");
                if (isNaN(val) || val < 0 || val > 10.0) {
                    newErrors[`${i}_gpa`] = "CGPA must be between 0 and 10.0";
                }
            }
            if (entry.resultType === "percentage" && entry.gpa) {
                const val = parseFloat(entry.gpa ?? "");
                if (isNaN(val) || val < 0 || val > 100) {
                    newErrors[`${i}_gpa`] = "Percentage must be between 0 and 100";
                }
            }
            if (!entry.yearOfPassing) {
                newErrors[`${i}_yearOfPassing`] = "Year of passing is required";
            } else {
                const year = parseInt(entry.yearOfPassing);
                const currentYear = new Date().getFullYear();
                if (isNaN(year) || year < 1950) {
                    newErrors[`${i}_yearOfPassing`] = "Enter a valid year of passing";
                } else if (year > currentYear) {
                    newErrors[`${i}_yearOfPassing`] = `Year of passing cannot be greater than ${currentYear}`;
                }
            }
            if (!entry.mode) newErrors[`${i}_mode`] = "Mode is required"
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (index: number, field: keyof EducationBlock, value: string) => {
        setEntries((prev) => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
        setErrors((prev) => { const e = { ...prev }; delete e[`${index}_${field}`]; return e; });
    };

    const handleAddAnother = () => {
        if (entries.length >= 5) return;
        setEntries((prev) => [...prev, emptyEducation()]);
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
            onNext({
                education: entries.map((e) => ({
                    ...e,
                    yearOfPassing: e.yearOfPassing ? parseInt(e.yearOfPassing) : "",
                })),
            });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter education details</h2>
            <p className="text-sm text-gray-500 mb-6">
                Please list your highest level of education first, followed by the rest in descending order
            </p>

            {/* Education Cards */}
            <div className="flex flex-col gap-6">
                {entries.map((entry, index) => (
                    <EducationCard
                        key={index}
                        index={index}
                        data={entry}
                        onChange={handleChange}
                        onDelete={handleDelete}
                        errors={errors}
                        showDelete={entries.length > 1}
                        isEditMode={isEditMode}
                        onSave={() => handleSaveCard(index)}
                        isSaving={savingIndex === index}
                        isSaved={savedIndex === index}
                    />
                ))}
            </div>

            {/* Add Another */}
            <div className="flex items-center justify-between mt-4">
                <button
                    type="button"
                    onClick={handleAddAnother}
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

            {/* Buttons */}
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
                    {isEditMode ? "Next" : "Save & Continue"}
                </button>
            </div>
        </div>
    );
}
