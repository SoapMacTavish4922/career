"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ALL_JOBS } from "@/lib/data/job";

const toSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ── Dummy User Data — replace with API call ───────────────────────────────────

const DUMMY_USER = {
    firstName: "Raj",
    middleName: "Kumar",
    lastName: "Sharma",
    email: "raj.sharma@gmail.com",
    altEmail: "raj123@gmail.com",
    phone: "9876543210",
    altPhone: "9123456780",
    gender: "Male",
    dob: "1998-08-15",
    permanentAddress: {
        line1: "12, Green Park Colony",
        line2: "Near City Mall",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pinCode: "400001",
    },
    currentAddress: {
        line1: "45, Andheri West",
        line2: "Lokhandwala Complex",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pinCode: "400053",
    },
    education: [
        {
            school: "St. Xavier's College",
            degree: "Bachelor's",
            fieldOfStudy: "Computer Science",
            resultType: "cgpa",
            gpa: "8.5",
            from: "2016-07",
            to: "2020-05",
        },
    ],
    experience: [
        {
            experienceType: "experienced",
            title: "Frontend Developer",
            company: "TechCorp Solutions",
            location: "Mumbai",
            from: "2020-07",
            to: "2023-12",
            current: "800000",
            notice: "30 Days",
        },
    ],
    certifications: [
        {
            certification: "Cloud Computing",
            institute: "NPTEL",
            yearOfPassing: "2021",
            marks: "85",
        },
    ],
};

// ── Ticker ────────────────────────────────────────────────────────────────────

function Ticker() {
    const message = "⚠ Please review and update your profile information before applying for this role. Accurate details improve your chances of selection.";

    return (
        <div className="w-full bg-orange-500 py-2.5 px-4 rounded-3xl">
            <p className="text-xs font-medium text-white text-center">
                {message}
            </p>
        </div>
    );
}

// ── Info Row ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
        <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-none">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide min-w-[130px] shrink-0">
                {label}
            </span>
            <span className="text-sm text-gray-800 text-right">{value}</span>
        </div>
    );
}

// ── Section ───────────────────────────────────────────────────────────────────

function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#006256] mb-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#006256]" />
                {title}
            </h4>
            <div className="bg-gray-50 rounded-xl px-4 py-1">{children}</div>
        </div>
    );
}

// ── Review Modal ──────────────────────────────────────────────────────────────

function ReviewModal({
    user,
    onClose,
    onEdit,
}: {
    user: typeof DUMMY_USER;
    onClose: () => void;
    onEdit: () => void;
}) {
    const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");
    const permanentAddr = [
        user.permanentAddress.line1, user.permanentAddress.line2,
        user.permanentAddress.city, user.permanentAddress.state,
        user.permanentAddress.country, user.permanentAddress.pinCode,
    ].filter(Boolean).join(", ");
    const currentAddr = [
        user.currentAddress.line1, user.currentAddress.line2,
        user.currentAddress.city, user.currentAddress.state,
        user.currentAddress.country, user.currentAddress.pinCode,
    ].filter(Boolean).join(", ");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[88vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Your Profile Information</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Review your details before applying</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                    >
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-6 py-5">

                    <ModalSection title="Basic Details">
                        <InfoRow label="Full Name" value={fullName} />
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Alt Email" value={user.altEmail} />
                        <InfoRow label="Phone" value={user.phone} />
                        <InfoRow label="Alt Phone" value={user.altPhone} />
                        <InfoRow label="Gender" value={user.gender} />
                        <InfoRow label="Date of Birth" value={user.dob} />
                    </ModalSection>

                    <ModalSection title="Address">
                        <InfoRow label="Permanent" value={permanentAddr} />
                        <InfoRow label="Current" value={currentAddr} />
                    </ModalSection>

                    <ModalSection title="Education">
                        {user.education.map((edu, i) => (
                            <div key={i} className={i > 0 ? "pt-3 mt-3 border-t border-gray-200" : ""}>
                                <InfoRow label="School" value={edu.school} />
                                <InfoRow label="Degree" value={edu.degree} />
                                <InfoRow label="Field" value={edu.fieldOfStudy} />
                                <InfoRow label={edu.resultType === "cgpa" ? "CGPA" : "Percentage"} value={edu.gpa} />
                                <InfoRow label="Duration" value={`${edu.from} → ${edu.to}`} />
                            </div>
                        ))}
                    </ModalSection>

                    <ModalSection title="Experience">
                        {user.experience.map((exp, i) => (
                            <div key={i} className={i > 0 ? "pt-3 mt-3 border-t border-gray-200" : ""}>
                                {exp.experienceType === "fresher" ? (
                                    <InfoRow label="Type" value="Fresher" />
                                ) : (
                                    <>
                                        <InfoRow label="Title" value={exp.title} />
                                        <InfoRow label="Company" value={exp.company} />
                                        <InfoRow label="Location" value={exp.location} />
                                        <InfoRow label="Duration" value={`${exp.from} → ${exp.to}`} />
                                        <InfoRow label="CTC" value={`₹ ${exp.current}`} />
                                        <InfoRow label="Notice" value={exp.notice} />
                                    </>
                                )}
                            </div>
                        ))}
                    </ModalSection>

                    {user.certifications.length > 0 && (
                        <ModalSection title="Certifications">
                            {user.certifications.map((cert, i) => (
                                <div key={i} className={i > 0 ? "pt-3 mt-3 border-t border-gray-200" : ""}>
                                    <InfoRow label="Certification" value={cert.certification} />
                                    <InfoRow label="Institute" value={cert.institute} />
                                    <InfoRow label="Year" value={cert.yearOfPassing} />
                                    <InfoRow label="Marks" value={`${cert.marks} / 100`} />
                                </div>
                            ))}
                        </ModalSection>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
                    <button
                        onClick={onEdit}
                        className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Details
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#006256] hover:bg-[#004d45] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                        Looks Good
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ApplyPage() {
    const params = useParams();
    const router = useRouter();
    const job = ALL_JOBS.find((j) => toSlug(j.title) === String(params.slug));

    const [showModal, setShowModal] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [confirmError, setConfirmError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Show modal automatically on page load
    useEffect(() => {
        const timer = setTimeout(() => setShowModal(true), 600);
        return () => clearTimeout(timer);
    }, []);

    const handleApply = async () => {
        if (!confirmed) {
            setConfirmError(true);
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1800)); // replace with API call
        setLoading(false);
        setSubmitted(true);
    };

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <p className="text-gray-500 text-sm">Job not found.</p>
                <button onClick={() => router.back()} className="text-sm text-[#F26F24] hover:underline">
                    Go back
                </button>
            </div>
        );
    }

    // ── Success Screen ────────────────────────────────────────────────────────

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#006256] flex items-center justify-center shadow-lg">
                    <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Application Submitted!</h2>
                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                        You've successfully applied for{" "}
                        <span className="font-semibold text-gray-800">{job.title}</span>.
                        Our HR team will reach out to you at{" "}
                        <span className="font-semibold text-[#F26F24]">{DUMMY_USER.email}</span>.
                    </p>
                </div>
                <button
                    onClick={() => router.push("/portal/search-jobs")}
                    className="mt-2 bg-[#F26F24] hover:bg-orange-600 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-colors"
                >
                    Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Ticker */}
            <div className="-mx-6 -mt-6 mb-6">
                <Ticker />
            </div>

            <div className="max-w-2xl flex flex-col gap-6">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#006256] transition-colors w-fit font-medium"
                >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Back to Job
                </button>

                {/* Job Summary Card */}
                <div className="bg-gradient-to-br from-[#006256] to-[#004d45] rounded-2xl p-6 flex flex-col gap-4">
                    <span className="w-fit text-xs font-bold uppercase tracking-widest bg-white/15 text-white/90 px-3 py-1 rounded-full">
                        {job.jobType}
                    </span>
                    <h1 className="text-xl font-bold text-white leading-snug">{job.title}</h1>
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                        <span className="text-sm text-white/75">{job.location}</span>
                        <span className="text-sm text-white/75">{job.experience}</span>
                        <span className="text-sm text-white/75">Posted {job.postedOn}</span>
                    </div>
                </div>

                {/* Applicant Summary */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
                                Applying As
                            </p>
                            <p className="text-base font-bold text-gray-900">
                                {[DUMMY_USER.firstName, DUMMY_USER.middleName, DUMMY_USER.lastName].filter(Boolean).join(" ")}
                            </p>
                            <p className="text-sm text-gray-500">{DUMMY_USER.email}</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 text-xs font-semibold text-[#006256] border border-[#006256]/30 bg-[#006256]/5 hover:bg-[#006256]/10 px-4 py-2 rounded-xl transition-colors"
                        >
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            View Full Profile
                        </button>
                    </div>

                    {/* Quick info */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        {[
                            { label: "Phone", value: DUMMY_USER.phone },
                            { label: "Gender", value: DUMMY_USER.gender },
                            { label: "Latest Degree", value: DUMMY_USER.education[0]?.degree },
                            { label: "Experience", value: DUMMY_USER.experience[0]?.experienceType === "fresher" ? "Fresher" : DUMMY_USER.experience[0]?.title },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{item.label}</p>
                                <p className="text-sm text-gray-800 font-medium mt-0.5">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info notice */}
                <div className="flex items-start gap-3 bg-[#fdf8f4] border border-orange-100 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                    </svg>
                    <p className="text-xs text-orange-700 leading-relaxed">
                        Make sure your profile is up to date before applying. Click{" "}
                        <button onClick={() => setShowModal(true)} className="font-bold underline underline-offset-2 cursor-pointer">
                            View Full Profile
                        </button>{" "}
                        to review or{" "}
                        <button onClick={() => router.push("/portal/edit-details")} className="font-bold underline underline-offset-2 cursor-pointer">
                            Edit Details
                        </button>{" "}
                        to make changes.
                    </p>
                </div>

                {/* Confirmation Checkbox */}
                <div
                    onClick={() => { setConfirmed((v) => !v); setConfirmError(false); }}
                    className={`cursor-pointer rounded-xl border-2 px-5 py-4 transition-all select-none
                        ${confirmed
                            ? "border-[#006256] bg-[#006256]/5"
                            : confirmError
                                ? "border-red-400 bg-red-50"
                                : "border-gray-200 bg-white hover:border-[#006256]/40"
                        }`}
                >
                    <div className="flex gap-3 items-start">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                            ${confirmed ? "bg-[#006256] border-[#006256]" : "border-gray-300 bg-white"}`}
                        >
                            {confirmed && (
                                <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800 mb-1">
                                I confirm my information is accurate
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                I have reviewed all my profile details and confirm they are true and up to date.
                                I understand that inaccurate information may result in disqualification.
                            </p>
                        </div>
                    </div>
                </div>

                {confirmError && (
                    <p className="text-xs text-red-500 -mt-4 flex items-center gap-1.5">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                        </svg>
                        Please confirm your information before applying.
                    </p>
                )}

                {/* Apply Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleApply}
                        disabled={loading}
                        className="flex-1 bg-[#F26F24] hover:bg-orange-600 text-white text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Submitting Application...
                            </>
                        ) : "Submit Application"}
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Review Modal */}
            {showModal && (
                <ReviewModal
                    user={DUMMY_USER}
                    onClose={() => setShowModal(false)}
                    onEdit={() => router.push("/portal/edit-details")}
                />
            )}

            {/* Marquee animation */}
            <style jsx>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    animation: marquee 18s linear infinite;
                }
            `}</style>
        </>
    );
}