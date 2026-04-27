"use client";

import Image from "next/image";
import { useState } from "react";
import { useInterviews } from "@/lib/hooks/useJobs";

// ── Types ─────────────────────────────────────────────────────────────────────
// Update fields to match what Laravel actually returns
interface Interview {
    id: number;
    role: string;
    date: string;
    time: string;
    contact: string;
}

const CARDS_PER_PAGE = 5;

// ── Skeleton ──────────────────────────────────────────────────────────────────

function InterviewSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl px-6 py-5 bg-white animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-40 mb-3" />
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="flex flex-wrap gap-4">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-4 bg-gray-200 rounded w-28" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Interview Card ────────────────────────────────────────────────────────────

function InterviewCard({ interview }: { interview: Interview }) {
    return (
        <div className="border border-orange-400 rounded-2xl px-6 py-5 bg-white shadow-sm hover:shadow-md transition-shadow">
            <h1 className="text-sm pb-3 text-gray-800">Interview Scheduled for</h1>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{interview.role}</h2>
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Image src="/interview-schedule-page/calendar (3).svg" alt="calendar icon" width={16} height={16} />
                    <span>On {interview.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src="/interview-schedule-page/clock.svg" alt="clock icon" width={16} height={16} />
                    <span>{interview.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src="/interview-schedule-page/telephone.svg" alt="phone icon" width={16} height={16} />
                    <span>Contact: {interview.contact}</span>
                </div>
            </div>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function InterviewSchedule() {
    const [currentPage, setCurrentPage] = useState(1);

    // ── Axios + React Query ───────────────────────────────────────────────────
    // useInterviews calls GET /jobs/interviews via axios
    // Bearer token attached automatically by request interceptor
    const { data, isLoading, isError } = useInterviews();

    // Laravel paginated: { data: Interview[], meta: {...} }
    // If Laravel returns plain array: (data ?? []) as Interview[]
    const interviews = (data?.data ?? []) as Interview[];

    const totalPages = Math.ceil(interviews.length / CARDS_PER_PAGE);
    const paginated = interviews.slice(
        (currentPage - 1) * CARDS_PER_PAGE,
        currentPage * CARDS_PER_PAGE
    );

    // ── Loading ───────────────────────────────────────────────────────────────
    if (isLoading) return <InterviewSkeleton />;

    // ── Error ─────────────────────────────────────────────────────────────────
    if (isError) return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700">Failed to load interview schedule</p>
                <p className="text-xs text-gray-400 mt-1">Please refresh the page and try again</p>
            </div>
        </div>
    );

    // ── Empty ─────────────────────────────────────────────────────────────────
    if (interviews.length === 0) return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                </svg>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700">No interviews scheduled</p>
                <p className="text-xs text-gray-400 mt-1">Your upcoming interviews will appear here</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">

            {/* Cards */}
            {paginated.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600
                            hover:border-orange-400 hover:text-orange-500 disabled:opacity-30
                            disabled:cursor-not-allowed transition-colors"
                    >
                        ← Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                                ${currentPage === page
                                    ? "bg-orange-500 text-white"
                                    : "border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600
                            hover:border-orange-400 hover:text-orange-500 disabled:opacity-30
                            disabled:cursor-not-allowed transition-colors"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Results count */}
            <p className="text-center text-xs text-gray-400">
                Showing {(currentPage - 1) * CARDS_PER_PAGE + 1}–{Math.min(currentPage * CARDS_PER_PAGE, interviews.length)} of {interviews.length} interviews
            </p>
        </div>
    );
} 