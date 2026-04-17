"use client";

interface FieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    onBlur?: () => void;
    error?: string;
    required?: boolean;
    rightSlot?: React.ReactNode;
}

export default function Field({
    label, name, type = "text", placeholder, value, onChange, onBlur, error, required, rightSlot,
}: FieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-800">
                {label} {required && <span className="text-orange-500">*</span>}
            </label>
            <div className="relative">
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={`w-full px-3 py-2.5 border rounded-lg text-xs outline-none transition-all duration-200
                        placeholder-gray-300 text-gray-800 focus:ring-2
                        ${error
                            ? "border-red-400 focus:ring-red-100 focus:border-red-400"
                            : "border-gray-300 focus:ring-orange-100 focus:border-orange-500"
                        }
                        ${rightSlot ? "pr-20" : ""}
                    `}
                />
                {rightSlot && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>
                )}
            </div>
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