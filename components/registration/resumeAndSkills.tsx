"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface Props {
    onNext: (data?: any) => void;
    onBack: () => void;
    defaultValues?: { resume?: File | null; skills?: string[] };
    isEditMode?: boolean;
}

export default function ResumeAndSkills({ onNext, onBack, defaultValues, isEditMode }: Props) {
    const [resume, setResume] = useState<File | null>(defaultValues?.resume ?? null);
    const [resumeError, setResumeError] = useState("");
    //const [skills, setSkills] = useState<string[]>(defaultValues?.skills ?? []);
    //const [skillInput, setSkillInput] = useState("");
    //const [skillError, setSkillError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Resume handling ───────────────────────────────────────────────────────
    const handleFileChange = (file: File) => {
        if (file.type !== "application/pdf") {
            setResumeError("Only PDF files are allowed.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setResumeError("File size must be under 2MB.");
            return;
        }
        setResume(file);
        setResumeError("");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileChange(file);
    };

    // // ── Skills handling ───────────────────────────────────────────────────────
    // const addSkill = () => {
    //     const trimmed = skillInput.trim();
    //     if (!trimmed) return;
    //     if (skills.length >= 20) {
    //         setSkillError("Maximum 20 skills allowed.");
    //         return;
    //     }
    //     if (skills.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) {
    //         setSkillError("Skill already added.");
    //         return;
    //     }
    //     setSkills((prev) => [...prev, trimmed]);
    //     setSkillInput("");
    //     setSkillError("");
    // };

    // const removeSkill = (index: number) => {
    //     setSkills((prev) => prev.filter((_, i) => i !== index));
    //     setSkillError("");
    // };

    // const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === "Enter" || e.key === ",") {
    //         e.preventDefault();
    //         addSkill();
    //     }
    //     if (e.key === "Backspace" && skillInput === "" && skills.length > 0) {
    //         removeSkill(skills.length - 1);
    //     }
    // };

    // ── Validation ────────────────────────────────────────────────────────────
    const handleSubmit = () => {

        if (!resume) {
            setResumeError("Resume is required. Please upload a PDF file.");
            return;
        }


        // if (skills.length === 0) {
        //     setSkillError("Please add at least one skill.");
        //     valid = false;
        // }

        // if (!valid) return;

        onNext({ resume }); //,skills
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Resume </h2>
            <p className="text-sm text-gray-500 mb-8">
                Upload your resume and tell us what you're good at
            </p>

            <div className="flex flex-col gap-8">

                {/* ── Resume Upload ── */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Resume <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-400 font-normal ml-2">PDF only, max 2MB</span>
                    </label>

                    {!resume ? (
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                                ${resumeError
                                    ? "border-red-400 bg-red-50"
                                    : "border-gray-300 bg-gray-50 hover:border-[#006256] hover:bg-teal-50"
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700">
                                    Drag & drop your resume here
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">or click to browse files</p>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-[#006256] bg-teal-50 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#006256] flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{resume.name}</p>
                                    <p className="text-xs text-gray-400">{formatFileSize(resume.size)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs font-semibold text-[#006256] hover:underline"
                                >
                                    Change
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setResume(null)}
                                    className="text-xs font-semibold text-red-400 hover:text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}

                    {resumeError && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {resumeError}
                        </p>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        required
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange(file);
                            e.target.value = "";
                        }}
                    />
                </div>
            </div>

            {/* ── Buttons ── */}
            <div className="flex gap-4 mt-10">
                <button
                    onClick={onBack}
                    className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
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