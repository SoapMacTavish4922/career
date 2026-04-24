"use client";

import Image from "next/image";
import { useAppliedJobs } from "@/lib/hooks/useJobs";
import { AppliedJob } from "@/lib/types/job";

// ── Types ─────────────────────────────────────────────────────────────────────
// Update these fields to match whatever your Laravel API actually returns
type Job = {
    id: number;
    title: string;
    status: "In progress" | "Accepted" | "Rejected";
};

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    "In progress": {
        icon: "/processing.svg",
        alt: "In Progress",
        textColor: "text-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-400",
    },
    "Accepted": {
        icon: "/checked.svg",
        alt: "Accepted",
        textColor: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-400",
    },
    "Rejected": {
        icon: "/reject.svg",
        alt: "Rejected",
        textColor: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-300",
    },
} as const;

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Job["status"] }) {
    const config = STATUS_CONFIG[status];
    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bgColor}`}>
            <Image src={config.icon} alt={config.alt} width={14} height={14} />
            <span className={`text-xs font-semibold ${config.textColor}`}>
                {status}
            </span>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function AppliedJobsSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl p-6 flex items-center justify-between bg-white animate-pulse">
                    <div className="flex flex-col gap-2 flex-1 mr-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="h-7 w-24 bg-gray-200 rounded-full shrink-0" />
                </div>
            ))}
        </div>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700">No applications yet</p>
                <p className="text-xs text-gray-400 mt-1">Jobs you apply for will appear here</p>
            </div>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function AppliedJobs() {

    // ── Axios + React Query ───────────────────────────────────────────────────
    // useAppliedJobs calls GET /jobs/applied via axios
    // Bearer token attached automatically by axios request interceptor
    // Result cached by React Query — won't refetch on every render
    const { data, isLoading, isError } = useAppliedJobs();

    // ── Parse response ────────────────────────────────────────────────────────
    // Laravel paginated response shape: { data: Job[], meta: { total, ... } }
    // If your Laravel returns a plain array instead, change to: data ?? []
    const jobs = (data?.data ?? []) as AppliedJob[];

    // ── Loading state ─────────────────────────────────────────────────────────
    if (isLoading) return <AppliedJobsSkeleton />;

    // ── Error state ───────────────────────────────────────────────────────────
    if (isError) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700">Failed to load applications</p>
                <p className="text-xs text-gray-400 mt-1">Please refresh the page and try again</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">

            {/* ── Header ── */}
            <div className="mb-2">
                <h1 className="text-xl font-bold text-gray-900">Applied Jobs</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                    Track the status of your job applications
                </p>
            </div>

            {/* ── Empty state ── */}
            {jobs.length === 0 && <EmptyState />}

            {/* ── Job cards ── */}
            {jobs.map((job) => {
                const config = STATUS_CONFIG[job.status];
                return (
                    <div
                        key={job.id}
                        className={`border ${config.borderColor} rounded-2xl p-5 flex items-center justify-between bg-white gap-4 shadow-sm`}
                    >
                        <h2 className="text-sm font-semibold text-gray-800 leading-snug flex-1">
                            {job.title}
                        </h2>
                        <div className="shrink-0">
                            <StatusBadge status={job.status} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}