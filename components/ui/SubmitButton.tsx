"use client";

interface SubmitButtonProps {
    loading: boolean;
    label: string;
}

export default function SubmitButton({ loading, label }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-semibold
                transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                flex items-center justify-center gap-2"
        >
            {loading ? (
                <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Please wait...
                </>
            ) : label}
        </button>
    );
}