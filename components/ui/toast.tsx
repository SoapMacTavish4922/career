"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
    // ← parse Laravel error response and show appropriate toast
    apiError: (error: any, fallback?: string) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextType | null>(null);

// ── Single Toast Item ─────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    const icons = {
        success: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
            </svg>
        ),
        warning: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
        ),
        info: (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
            </svg>
        ),
    };

    const styles = {
        success: "bg-emerald-50 border-emerald-200 text-emerald-700",
        error: "bg-red-50 border-red-200 text-red-700",
        warning: "bg-orange-50 border-orange-200 text-orange-700",
        info: "bg-blue-50 border-blue-200 text-blue-700",
    };

    const iconStyles = {
        success: "text-emerald-500",
        error: "text-red-500",
        warning: "text-orange-500",
        info: "text-blue-500",
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium
                        max-w-sm w-full ${styles[toast.type]}`}>
            <span className={`${iconStyles[toast.type]} shrink-0`}>{icons[toast.type]}</span>
            <p className="flex-1 leading-relaxed">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="opacity-50 hover:opacity-100 transition-opacity shrink-0"
            >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev.slice(-4), { id, type, message, duration }]);
    }, []);

    const success = useCallback((msg: string) => showToast(msg, "success"), [showToast]);
    const error = useCallback((msg: string) => showToast(msg, "error", 5000), [showToast]);
    const warning = useCallback((msg: string) => showToast(msg, "warning"), [showToast]);
    const info = useCallback((msg: string) => showToast(msg, "info"), [showToast]);

    // ── Parse Laravel API error and show toast ────────────────────────────────
    const apiError = useCallback((err: any, fallback = "Something went wrong. Please try again.") => {
        const status = err?.response?.status;
        const data = err?.response?.data;

        // Laravel validation errors — { errors: { field: ["message"] } }
        if (data?.errors) {
            const messages = Object.values(data.errors).flat() as string[];
            messages.forEach((msg) => showToast(msg, "error", 6000));
            return;
        }

        // Laravel message — { message: "..." }
        if (data?.message) {
            showToast(data.message, "error", 5000);
            return;
        }

        // HTTP status fallbacks
        if (status === 401) { showToast("Unauthorized. Please log in again.", "error"); return; }
        if (status === 403) { showToast("You don't have permission to do this.", "error"); return; }
        if (status === 404) { showToast("Resource not found.", "error"); return; }
        if (status === 409) { showToast("Conflict — this action cannot be completed.", "warning"); return; }
        if (status === 422) { showToast("Please check your input and try again.", "warning"); return; }
        if (status === 429) { showToast("Too many requests. Please wait and try again.", "warning"); return; }
        if (status >= 500) { showToast("Server error. Please try again later.", "error"); return; }

        showToast(fallback, "error");
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info, apiError }}>
            {children}
            {/* Toast container — fixed bottom right */}
            <div className="fixed bottom-6 right-4 z-[200] flex flex-col gap-2 items-end pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onRemove={removeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}