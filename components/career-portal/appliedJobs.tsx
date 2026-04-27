"use client";

import Image from "next/image";
import { useAppliedJobs } from "@/lib/hooks/useJobs";

// ── Types ─────────────────────────────────────────────────────────────────────
// Update these fields to match whatever your Laravel API actually returns


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
    const jobs = (data ?? []) as any[];

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
            {jobs.map((item) => {
                return (
                    <div
                        key={item.id}
                        className="border border-orange-400 rounded-2xl p-5 flex items-center justify-between bg-white gap-4 shadow-sm"
                    >
                        <div className="flex flex-col gap-1 flex-1">
                            <h2 className="text-sm font-semibold text-gray-800 leading-snug">
                                {item.job.title}          {/* ← nested inside job object */}
                            </h2>
                            <p className="text-xs text-gray-400">{item.job.location}</p>
                        </div>
                        <div className="shrink-0">
                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize
                                ${item.status === "applied" ? "bg-orange-50 text-orange-500" : ""}
                                ${item.status === "shortlisted" ? "bg-blue-50 text-blue-500" : ""}
                                ${item.status === "rejected" ? "bg-red-50 text-red-500" : ""}
                                ${item.status === "hired" ? "bg-emerald-50 text-emerald-600" : ""}
                                `}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}