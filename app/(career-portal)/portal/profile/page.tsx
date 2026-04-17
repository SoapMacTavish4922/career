


"use client";

import { useState, useRef } from "react";
import { isStrongPassword } from "@/lib/validators/auth";
import PasswordStrength from "@/components/ui/PasswordStrength";
import PasswordField from "@/components/ui/PasswordField";

// ── Dummy user — replace with useAuth() when backend is ready ─────────────────
const DUMMY_USER = {
    firstName: "Raj",
    lastName: "Sharma",
    email: "raj.sharma@gmail.com",
    phone: "9876543210",
    gender: "Male",
    dob: "1998-08-15",
    location: "Mumbai, Maharashtra",
    experience: "Frontend Developer @ TechCorp",
    degree: "B.Tech · Computer Science",
    profilePhoto: null as string | null,
};

type ActiveModal = "photo" | "password" | null;

function getInitials(first: string, last: string) {
    return `${first[0]}${last[0]}`.toUpperCase();
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }: {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold
            ${type === "success" ? "bg-[#006256] text-white" : "bg-red-500 text-white"}`}
        >
            {type === "success" ? (
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
            {message}
            <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

// ── Profile Info Row ──────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
            <span className="text-sm font-medium text-gray-800">{value}</span>
        </div>
    );
}

// ── Change Photo Modal ────────────────────────────────────────────────────────

function ChangePhotoModal({ currentPhoto, initials, onClose, onSuccess }: {
    currentPhoto: string | null;
    initials: string;
    onClose: () => void;
    onSuccess: (url: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(currentPhoto);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFile = (f: File) => {
        if (!["image/jpeg", "image/png", "image/jpg"].includes(f.type)) {
            setError("Only JPG or PNG files are allowed."); return;
        }
        if (f.size > 2 * 1024 * 1024) {
            setError("File size must be under 2MB."); return;
        }
        setError("");
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) { setError("Please select a photo first."); return; }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500)); // replace with useUpdatePhoto()
        setLoading(false);
        onSuccess(preview!);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900">Update Profile Photo</h3>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
                    <div className="flex flex-col items-center gap-4">
                        <div onClick={() => inputRef.current?.click()}
                            className="relative w-24 h-24 rounded-full cursor-pointer group">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-[#006256] flex items-center justify-center text-white text-2xl font-bold">
                                    {initials}
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 text-center">Click photo to browse · JPG or PNG · Max 2MB</p>

                        <div className="flex gap-2">
                            <button type="button" onClick={() => inputRef.current?.click()}
                                className="text-xs font-semibold text-[#006256] border border-[#006256]/30 bg-[#006256]/5 hover:bg-[#006256]/10 px-4 py-2 rounded-xl transition-colors">
                                {file ? "Change Photo" : "Choose Photo"}
                            </button>
                            {file && (
                                <button type="button"
                                    onClick={() => { setFile(null); setPreview(currentPhoto); setError(""); }}
                                    className="text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 px-4 py-2 rounded-xl transition-colors">
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 text-center flex items-center justify-center gap-1">
                            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </p>
                    )}

                    <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading || !file}
                            className="flex-1 bg-[#F26F24] hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {loading ? (
                                <><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>Saving...</>
                            ) : "Save Photo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Change Password Modal ─────────────────────────────────────────────────────

function ChangePasswordModal({ onClose, onSuccess }: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const update = (field: string, value: string) => {
        setPasswords((p) => ({ ...p, [field]: value }));
        setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!passwords.current.trim()) errs.current = "Current password is required.";
        if (!isStrongPassword(passwords.new)) errs.new = "Min 8 chars, 1 uppercase, 1 number.";
        if (passwords.new !== passwords.confirm) errs.confirm = "Passwords do not match.";
        if (passwords.current === passwords.new) errs.new = "New password must differ from current.";
        // In handleSubmit inside ChangePasswordModal
        if (!isStrongPassword(passwords.new))
            errs.new = "Password must be Strong — min 8 chars, uppercase, number and special character.";
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500)); // replace with useUpdatePassword()
        setLoading(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900">Change Password</h3>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
                    <PasswordField
                        field="current"
                        label="Current Password"
                        placeholder="Enter current password"
                        value={passwords.current}
                        show={show.current}
                        error={errors.current}
                        onChange={(v) => update("current", v)}
                        onToggle={() => setShow((p) => ({ ...p, current: !p.current }))}
                    />

                    <PasswordField
                        field="new"
                        label="New Password"
                        placeholder="Min 8 chars, 1 uppercase, 1 number"
                        value={passwords.new}
                        show={show.new}
                        error={errors.new}
                        showStrength={true}
                        onChange={(v) => update("new", v)}
                        onToggle={() => setShow((p) => ({ ...p, new: !p.new }))}
                    />

                    <PasswordField
                        field="confirm"
                        label="Confirm New Password"
                        placeholder="Re-enter new password"
                        value={passwords.confirm}
                        show={show.confirm}
                        error={errors.confirm}
                        onChange={(v) => update("confirm", v)}
                        onToggle={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
                    />

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 bg-[#006256] hover:bg-[#004d45] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading ? (
                                <><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>Updating...</>
                            ) : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function MyProfilePage() {
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(DUMMY_USER.profilePhoto);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const initials = getInitials(DUMMY_USER.firstName, DUMMY_USER.lastName);
    const fullName = `${DUMMY_USER.firstName} ${DUMMY_USER.lastName}`;

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    return (
        <div className="max-w-2xl flex flex-col gap-6">

            {/* ── Header ── */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">My Account</h1>
                <p className="text-sm text-gray-400 mt-0.5">View your profile and manage account settings</p>
            </div>

            {/* ── Profile Card ── */}
            <div className="bg-white border border-gray-400 rounded-2xl overflow-hidden">
                {/* Teal banner */}
                <div className="h-24 bg-gradient-to-r from-[#006256] to-[#004d45]" />

                <div className="px-6 pb-5">
                    <div className="flex items-end justify-between -mt-10 mb-4">

                        {/* Avatar with camera badge */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-[#006256] flex items-center justify-center">
                                {photoPreview ? (
                                    <img src={photoPreview} alt={fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-xl font-bold">{initials}</span>
                                )}
                            </div>
                            <button onClick={() => setActiveModal("photo")}
                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#F26F24] rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors"
                                title="Change photo">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex gap-2 mb-1">
                            <button onClick={() => setActiveModal("photo")}
                                className="flex items-center gap-1.5 text-xs font-semibold text-[#006256] border border-[#006256]/30 bg-[#006256]/5 hover:bg-[#006256]/10 px-3 py-1.5 rounded-lg transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Change Photo
                            </button>

                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900">{fullName}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{DUMMY_USER.email}</p>
                </div>
            </div>

            {/* ── Profile Details Card ── */}
            <div className="bg-white border border-gray-400 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Profile Details</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Your personal information</p>
                    </div>
                    <a href="/portal/edit-details"
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#F26F24] hover:text-orange-600 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Details
                    </a>
                </div>
                <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-5">
                    <InfoRow label="Full Name" value={fullName} />
                    <InfoRow label="Email" value={DUMMY_USER.email} />
                    <InfoRow label="Phone" value={DUMMY_USER.phone} />
                    <InfoRow label="Gender" value={DUMMY_USER.gender} />
                    <InfoRow label="Date of Birth" value={DUMMY_USER.dob} />
                    <InfoRow label="Location" value={DUMMY_USER.location} />
                    <InfoRow label="Experience" value={DUMMY_USER.experience} />
                    <InfoRow label="Education" value={DUMMY_USER.degree} />
                </div>
            </div>

            {/* ── Security Card ── */}
            <div className="bg-white border border-gray-400 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-300">
                    <h3 className="text-sm font-bold text-gray-900">Security</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Manage your account security</p>
                </div>
                <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Password</p>
                            <p className="text-xs text-gray-400">Keep your account secure with a strong password</p>
                        </div>
                    </div>
                    <button onClick={() => setActiveModal("password")}
                        className="text-xs font-semibold text-[#006256] border border-[#006256]/30 bg-[#006256]/5 hover:bg-[#006256]/10 px-4 py-2 rounded-xl transition-colors">
                        Change Password
                    </button>
                </div>
            </div>

            {/* ── Modals ── */}
            {activeModal === "photo" && (
                <ChangePhotoModal
                    currentPhoto={photoPreview}
                    initials={initials}
                    onClose={() => setActiveModal(null)}
                    onSuccess={(url) => {
                        setPhotoPreview(url);
                        setActiveModal(null);
                        showToast("Profile photo updated successfully.", "success");
                    }}
                />
            )}

            {activeModal === "password" && (
                <ChangePasswordModal
                    onClose={() => setActiveModal(null)}
                    onSuccess={() => {
                        setActiveModal(null);
                        showToast("Password updated successfully.", "success");
                    }}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}