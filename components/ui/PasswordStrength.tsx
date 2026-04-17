"use client";

interface PasswordStrengthProps {
    password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null;

    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^a-zA-Z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;
    const labels = ["Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
    const textColors = ["text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];

    return (
        <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-gray-200"}`}
                    />
                ))}
            </div>
            <p className={`text-xs font-medium ${textColors[score - 1] ?? ""}`}>
                {labels[score - 1] ?? ""}
            </p>
        </div>
    );
}