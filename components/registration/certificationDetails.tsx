"use client";

import { useState, useRef } from "react";
import { allowOnlyLetters, allowOnlyNumbers } from "@/lib/utils/keyboardHelpers";
import { CertificationBlock } from "@/lib/types/registration";


interface Props {
    onNext: (data?: any) => void;
    onBack: () => void;
    defaultValues?: { certifications?: CertificationBlock[] };
}

const emptyCertification = (): CertificationBlock => ({
    certification: "",
    institute: "",
    accreditedWith: "",
    yearOfPassing: "",
    marks: "",
    certificateFile: null,
});
const allowYYYY = (e: React.KeyboardEvent<HTMLInputElement>) => {
    allowOnlyNumbers(e);
};

// Auto-insert "/" for MM/YYYY
const handleValidateDateKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string,
    onChange: (v: string) => void
) => {
    if (
        /^\d$/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
        const next = value + e.key;
        if (next.length === 2) {
            e.preventDefault();
            onChange(next + "/");
        }
    } else if (
        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key) &&
        !/^\d$/.test(e.key)
    ) {
        e.preventDefault();
    }
};

// ── Reusable Field ──
const Field = ({
    label,
    required,
    placeholder,
    value,
    onChange,
    error,
    onKeyDown,
    maxLength,
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
        ${error
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-teal-400"
                }`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

// ── Upload Area ──
const UploadArea = ({
    file,
    onFileChange,
    error,
}: {
    file: File | null;
    onFileChange: (f: File | null) => void;
    error?: string;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => {
        if (f.size > 2097152) {
            alert("File size must be under 2MB.");
            return;
        }
        onFileChange(f);
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Add your certificate</label>
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    const dropped = e.dataTransfer.files[0];
                    if (dropped) handleFile(dropped);
                }}
                className={`border-2 border-dashed rounded-xl px-4 py-6 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${error ? "border-red-400 bg-red-50" : "border-purple-300 bg-purple-50 hover:bg-purple-100"}`}
            >
                {file ? (
                    <div className="flex flex-col items-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7c3aed"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <p className="text-xs text-purple-700 font-medium">{file.name}</p>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onFileChange(null);
                            }}
                            className="text-xs text-gray-400 hover:text-red-500 mt-1 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center mb-2 bg-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-500"
                            >
                                <polyline points="16 16 12 12 8 16" />
                                <line x1="12" y1="12" x2="12" y2="21" />
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                            </svg>
                        </div>
                        <p className="text-xs text-gray-400">Upload (jpeg, pdf upto 2MB)</p>
                    </>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept=".jpeg,.jpg,.pdf"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                        e.target.value = "";
                    }}
                />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

// ── Certification Card ──
const CertificationCard = ({
    index,
    data,
    onChange,
    onDelete,
    errors,
    showDelete,
}: {
    index: number;
    data: CertificationBlock;
    onChange: (index: number, field: keyof CertificationBlock, value: string | File | null) => void;
    onDelete: (index: number) => void;
    errors: Partial<Record<string, string>>;
    showDelete: boolean;
}) => (
    <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 last:border-none">

        {/* Header row */}
        <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">
                {index === 0 ? "Certification 1" : `Certification ${index + 1}`}
            </h3>
            {showDelete && (
                <button
                    type="button"
                    onClick={() => onDelete(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                    </svg>
                </button>
            )}
        </div>

        {/* Certification name */}
        <Field
            label="Certification"
            placeholder="eg: Cloud Computing"
            value={data.certification}
            onChange={(v) => onChange(index, "certification", v)}
            error={errors[`${index}_certification`]}

        />

        {/* Institute / Company */}
        <Field
            label="Institute / Company"
            placeholder="eg: NPTEL"
            value={data.institute}
            onChange={(v) => onChange(index, "institute", v)}
            error={errors[`${index}_institute`]}
            onKeyDown={allowOnlyLetters}
        />

        {/* Accredited with */}
        <Field
            label="Accredited with"
            placeholder="eg: NAAC"
            value={data.accreditedWith}
            onChange={(v) => onChange(index, "accreditedWith", v)}
            error={errors[`${index}_accreditedWith`]}
            onKeyDown={allowOnlyLetters}
        />

        {/* Year of passing + Marks */}
        <div className="flex gap-4">
            <div className="flex-1">
                <Field
                    label="Year of passing"
                    placeholder="YYYY"
                    value={data.yearOfPassing}
                    onChange={(v) => onChange(index, "yearOfPassing", v)}
                    onKeyDown={allowYYYY}
                    maxLength={4}
                    error={errors[`${index}_yearOfPassing`]}
                />
            </div>
            <div className="flex-1">
                <Field
                    label="Marks"
                    placeholder="out of 100"
                    value={data.marks}
                    onChange={(v) => onChange(index, "marks", v)}
                    onKeyDown={allowYYYY}
                    maxLength={2}
                    error={errors[`${index}_marks`]}
                />
            </div>
        </div>

        {/* File upload
        <UploadArea
            file={data.certificateFile}
            onFileChange={(f) => onChange(index, "certificateFile", f)}
            error={errors[`${index}_certificateFile`]}
        /> */}
    </div>
);

// ── Main Component ──
export default function CertificationDetails({ onNext, onBack, defaultValues }: Props) {
    const [entries, setEntries] = useState<CertificationBlock[]>(defaultValues?.certifications ?? [emptyCertification()]);
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    // ── Validate ──
    const validate = () => {
        const newErrors: Partial<Record<string, string>> = {};

        entries.forEach((entry, i) => {
            if (!entry.certification.trim())
                newErrors[`${i}_certification`] = "Certification name is required";
            if (!entry.institute.trim())
                newErrors[`${i}_institute`] = "Institute / Company is required";
            if (!entry.yearOfPassing.trim())
                newErrors[`${i}_yearOfPassing`] = "Year of passing is required";
            else if (!/^\d{4}$/.test(entry.yearOfPassing))
                newErrors[`${i}_yearOfPassing`] = "Enter a valid 4-digit year";
            if (!entry.marks?.toString().trim()) {
                newErrors[`${i}_marks`] = "Marks are required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        index: number,
        field: keyof CertificationBlock,
        value: string | File | null
    ) => {
        setEntries((prev) =>
            prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
        );
        setErrors((prev) => {
            const e = { ...prev };
            delete e[`${index}_${field}`];
            return e;
        });
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
            onNext({ certifications: entries });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter certification details</h2>
            <p className="text-sm text-gray-500 mb-6">Add your certifications and credentials!</p>

            <div className="flex flex-col gap-6">
                {entries.map((entry, index) => (
                    <CertificationCard
                        key={index}
                        index={index}
                        data={entry}
                        onChange={handleChange}
                        onDelete={handleDelete}
                        errors={errors}
                        showDelete={entries.length > 1}
                    />
                ))}
            </div>

            {/* Add Another */}
            <div className="flex items-center justify-between mt-4">
                <button
                    type="button"
                    onClick={() => setEntries((prev) => [...prev, emptyCertification()])}
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