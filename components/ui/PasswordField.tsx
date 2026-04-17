"use client";

import PasswordStrength from "@/components/ui/PasswordStrength";

interface PasswordFieldProps {
    field: string;
    label: string;
    placeholder: string;
    value: string;
    show: boolean;
    error?: string;
    onChange: (v: string) => void;
    onToggle: () => void;
    showStrength?: boolean; // only show bar on new password field, not current/confirm
}

export default function PasswordField({
    field,
    label,
    placeholder,
    value,
    show,
    error,
    onChange,
    onToggle,
    showStrength = false,
}: PasswordFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-3 py-2.5 pr-16 border rounded-xl text-sm outline-none transition-all
                        ${error
                            ? "border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-400"
                            : "border-gray-300 focus:ring-2 focus:ring-[#006256]/20 focus:border-[#006256]"
                        }`}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-medium"
                >
                    {show ? "Hide" : "Show"}
                </button>
            </div>

            {/* Strength bar — only on new password field */}
            {showStrength && <PasswordStrength password={value} />}

            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}