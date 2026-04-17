"use client";

interface OtpInputProps {
    value: string[];
    onChange: (index: number, value: string) => void;
    onKeyDown: (index: number, e: React.KeyboardEvent) => void;
    onPaste: (e: React.ClipboardEvent) => void;
    error?: string;
}

export default function OtpInput({ value, onChange, onKeyDown, onPaste, error }: OtpInputProps) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-gray-800">
                Enter the 6-digit OTP sent to your email ID <span className="text-orange-500">*</span>
            </label>

            <div className="flex gap-2 justify-between" onPaste={onPaste}>
                {value.map((digit, i) => (
                    <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => onChange(i, e.target.value)}
                        onKeyDown={(e) => onKeyDown(i, e)}
                        className={`w-11 h-12 text-center text-base font-bold border rounded-xl outline-none transition-all
                            focus:ring-2 focus:ring-orange-100 focus:border-orange-500
                            ${error ? "border-red-400" : digit ? "border-gray-900 bg-gray-50" : "border-gray-300"}`}
                    />
                ))}
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