"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AllFormData } from "@/lib/types/registration";



interface Props {
    formData?: AllFormData;
    onBack?: () => void;
    onSubmitSuccess?: () => void;
}

const ReviewRow = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-none">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide min-w-[140px]">
                {label}
            </span>
            <span className="text-sm text-gray-800 font-medium text-right">{value}</span>
        </div>
    );
};

const ReviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
            {title}
        </h4>
        <div className="bg-gray-50 rounded-xl px-4 py-1">{children}</div>
    </div>
);

const formatAddress = (addr?: AllFormData["permanentAddress"]) => {
    if (!addr) return undefined;
    return [addr.line1, addr.city, addr.state, addr.country, addr.pinCode]
        .filter(Boolean)
        .join(", ");
};

function ReviewModal({
    formData, onClose, onConfirm, loading,
}: {
    formData: AllFormData;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {
    const fullName = [formData.firstName, formData.middleName, formData.lastName]
        .filter(Boolean).join(" ");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[88vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Review Your Application</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Please verify all details before final submission
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-6 py-5">

                    <ReviewSection title="Basic Details">
                        <ReviewRow label="Full Name" value={fullName || undefined} />
                        <ReviewRow label="Email" value={formData.email} />
                        <ReviewRow label="Alt Email" value={formData.altEmail} />
                        <ReviewRow label="Phone" value={formData.phone} />
                        <ReviewRow label="Alt Phone" value={formData.altPhone} />
                        <ReviewRow label="Gender" value={formData.gender} />
                        <ReviewRow label="Date of Birth" value={formData.dob} />
                    </ReviewSection>

                    <ReviewSection title="Address Details">
                        <ReviewRow label="Permanent Address" value={formatAddress(formData.permanentAddress)} />
                        <ReviewRow
                            label="Current Address"
                            value={
                                formData.sameAsPermanent
                                    ? "Same as permanent address"
                                    : formatAddress(formData.currentAddress)
                            }
                        />
                    </ReviewSection>

                    {formData.education && formData.education.length > 0 && (
                        <ReviewSection title="Educational Details">
                            {formData.education.map((edu, i) => (
                                <div key={i} className={i > 0 ? "pt-3 mt-3 border-t border-gray-200" : ""}>
                                    {formData.education!.length > 1 && (
                                        <p className="text-xs font-bold text-gray-500 mb-1">Education {i + 1}</p>
                                    )}
                                    <ReviewRow label="School / University" value={edu.school} />
                                    <ReviewRow label="Degree" value={edu.degree} />
                                    <ReviewRow label="Field of Study" value={edu.fieldOfStudy} />
                                    <ReviewRow
                                        label={edu.resultType === "cgpa" ? "CGPA" : "Percentage"}
                                        value={edu.gpa}
                                    />
                                    <ReviewRow label="From" value={edu.from} />
                                    <ReviewRow label="To" value={edu.to} />
                                </div>
                            ))}
                        </ReviewSection>
                    )}

                    {formData.experience && formData.experience.length > 0 && (
                        <ReviewSection title="Experience Details">
                            {formData.experience.map((exp, i) => (
                                <div key={i} className={i > 0 ? "pt-3 mt-3 border-t border-gray-200" : ""}>
                                    {exp.experienceType === "fresher" ? (
                                        <ReviewRow label="Experience Type" value="Fresher" />
                                    ) : (
                                        <>
                                            {formData.experience!.length > 1 && (
                                                <p className="text-xs font-bold text-gray-500 mb-1">Experience {i + 1}</p>
                                            )}
                                            <ReviewRow label="Job Title" value={exp.title} />
                                            <ReviewRow label="Company" value={exp.company} />
                                            <ReviewRow label="Location" value={exp.location} />
                                            <ReviewRow label="From" value={exp.from} />
                                            <ReviewRow label="To" value={exp.to} />
                                            <ReviewRow label="Current CTC" value={exp.current ? `₹ ${exp.current}` : undefined} />
                                            <ReviewRow label="Notice Period" value={exp.notice} />
                                        </>
                                    )}
                                </div>
                            ))}
                        </ReviewSection>
                    )}

                    {formData.certifications && formData.certifications.length > 0 && (
                        <ReviewSection title="Certifications">
                            {formData.certifications.map((cert, i) => (
                                <div key={i} className={i > 0 ? "pt-3 mt-3 border-t border-gray-200" : ""}>
                                    {formData.certifications!.length > 1 && (
                                        <p className="text-xs font-bold text-gray-500 mb-1">Certification {i + 1}</p>
                                    )}
                                    <ReviewRow label="Certification" value={cert.certification} />
                                    <ReviewRow label="Institute" value={cert.institute} />
                                    <ReviewRow label="Accredited With" value={cert.accreditedWith} />
                                    <ReviewRow label="Year of Passing" value={cert.yearOfPassing} />
                                    <ReviewRow label="Marks" value={cert.marks ? `${cert.marks} / 100` : undefined} />
                                </div>
                            ))}
                        </ReviewSection>
                    )}

                    <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-orange-500 flex-shrink-0 mt-0.5">
                            <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        </div>
                        <p className="text-xs text-orange-700 leading-relaxed">
                            <span className="font-bold">Declaration accepted.</span> You have confirmed that all
                            information is true and correct. Submission is final and cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        ← Edit Details
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin" width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Submitting…
                            </>
                        ) : (
                            "Confirm & Submit"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN — DeclareAndSubmit
───────────────────────────────────────────────────────────────────────────── */
export default function DeclareAndSubmit({
    formData = {},
    onBack,
    onSubmitSuccess,
}: Props) {
    const router = useRouter();   // ✅ always at top level — never inside a condition

    const [declared, setDeclared] = useState(false);
    const [declError, setDeclError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fullName = [formData.firstName, formData.middleName, formData.lastName]
        .filter(Boolean).join(" ");

    // ✅ always at top level — runs only when submitted becomes true
    useEffect(() => {
        if (!submitted) return;
        const timer = setTimeout(() => {
            router.push("/portal/search-jobs");
        }, 3000);
        return () => clearTimeout(timer);
    }, [submitted]);

    const handleReviewClick = () => {
        if (!declared) {
            setDeclError("You must accept the declaration to proceed.");
            return;
        }
        setDeclError("");
        setShowModal(true);
    };

    const handleFinalSubmit = async () => {
        setLoading(true);
        try {
            // await fetch("/api/submit", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(formData),
            // });
            await new Promise((r) => setTimeout(r, 1800));
            setShowModal(false);
            setSubmitted(true);
            onSubmitSuccess?.();
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ── Success screen ── */
    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center mb-6 shadow-lg">
                    <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
                    Thank you{fullName ? `, ${fullName}` : ""}. Your application has been received. Our
                    HR team will reach out to you at{" "}
                    <span className="font-semibold text-orange-500">{formData.email}</span>.
                    <br />
                    <span className="text-xs text-gray-400 mt-1 block">
                        Redirecting you to job listings in a few seconds...
                    </span>
                </p>
                <button
                    onClick={() => router.push("/portal/search-jobs")}
                    className="text-xs text-orange-500 hover:underline mt-1"
                >
                    Go now →
                </button>
            </div>
        );
    }

    /* ── Main declaration UI ── */
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Declare & Submit</h2>
            <p className="text-sm text-gray-500 mb-8">
                Review your declaration and submit your application.
            </p>

            {/* Quick summary strip */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-6 flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Application Summary
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {[
                        { label: "Name", value: fullName },
                        { label: "Email", value: formData.email },
                        { label: "Phone", value: formData.phone },
                        { label: "Gender", value: formData.gender },
                        { label: "City", value: formData.permanentAddress?.city },
                        { label: "State", value: formData.permanentAddress?.state },
                        {
                            label: "Education",
                            value: formData.education?.[0]?.degree
                                ? `${formData.education[0].degree}${formData.education[0].school ? ` · ${formData.education[0].school}` : ""}`
                                : undefined,
                        },
                        {
                            label: "Experience",
                            value: formData.experience?.[0]?.experienceType === "fresher"
                                ? "Fresher"
                                : formData.experience?.[0]?.title
                                    ? `${formData.experience[0].title} @ ${formData.experience[0].company}`
                                    : undefined,
                        },
                    ]
                        .filter((r) => r.value)
                        .map((r) => (
                            <div key={r.label}>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                    {r.label}
                                </p>
                                <p className="text-sm text-gray-800 font-medium truncate">{r.value}</p>
                            </div>
                        ))}
                </div>
            </div>

            {/* Declaration checkbox block */}
            <div
                onClick={() => {
                    setDeclared((v) => !v);
                    if (declError) setDeclError("");
                }}
                className={`cursor-pointer rounded-xl border-2 px-5 py-4 transition-all select-none mb-1
                    ${declared
                        ? "border-orange-400 bg-orange-50"
                        : declError
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
            >
                <div className="flex gap-3 items-start">
                    <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                            ${declared ? "bg-orange-500 border-orange-500" : "border-gray-300 bg-white"}`}
                    >
                        {declared && (
                            <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800 mb-1.5">
                            Declaration by Applicant
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            I hereby declare that the information provided above is true, accurate, and complete to the best of my knowledge. I understand that providing false or misleading information may result in disqualification from consideration.
                        </p>
                    </div>
                </div>
            </div>

            {declError && (
                <p className="text-xs text-red-500 mb-4 flex items-center gap-1.5">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                    </svg>
                    {declError}
                </p>
            )}

            {!declared && !declError && (
                <p className="text-xs text-gray-400 mb-6 mt-1">
                    Click the box above to accept the declaration before submitting.
                </p>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={onBack}
                    className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleReviewClick}
                    disabled={!declared}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    Review & Submit
                </button>
            </div>

            {showModal && (
                <ReviewModal
                    formData={formData}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleFinalSubmit}
                    loading={loading}
                />
            )}
        </div>
    );
}