"use client";

interface StepIndicatorProps {
    steps: string[];
    currentIndex: number;
}

export default function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-2 mb-6">
            {steps.map((label, i) => {
                const done = i < currentIndex;
                const active = i === currentIndex;
                return (
                    <div key={label} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                ${done ? "bg-green-500 text-white" : active ? "bg-gray-900 text-white" : "bg-gray-300 text-gray-500"}`}
                            >
                                {done ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : i + 1}
                            </div>
                            <span className={`text-xs font-medium ${active ? "text-gray-900" : "text-gray-400"}`}>
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`w-8 h-px ${i < currentIndex ? "bg-green-400" : "bg-gray-300"}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}