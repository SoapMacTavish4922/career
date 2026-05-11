"use client";

import { useState } from "react";
import { useInterviews } from "@/lib/hooks/useJobs";

// ── Types ─────────────────────────────────────────────────────────────────────
// ── Update Interface ──
interface Interview {
    application_id: string;
    job_title: string | null;
    job_location: string | null;
    interview_date: string;
    interview_mode: "online" | "offline";
    interview_link: string | null;
    interview_address: string | null;
    hr_name: string;
    interview_scheduled_at: string;
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    // If already formatted like "10:00 AM" return as-is
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
    // Convert "10:00:00" → "10:00 AM"
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function InterviewSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl px-5 py-5 bg-white animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-28 mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-4 bg-gray-200 rounded w-20" />
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
    const isOnline = interview.interview_mode === "online";

    return (
        <div className="border border-orange-400 rounded-2xl px-5 py-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Interview Scheduled for</p>
                    <h2 className="text-base font-bold text-gray-900">
                        {interview.job_title ?? "Job Interview"}
                    </h2>
                    {interview.job_location && (
                        <p className="text-xs text-gray-400 mt-0.5">{interview.job_location}</p>
                    )}
                </div>
                <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full
                    ${isOnline ? "bg-blue-50 text-blue-500" : "bg-orange-50 text-orange-500"}`}>
                    {isOnline ? "Online" : "Onsite"}
                </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{formatDate(interview.interview_date)}</span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{formatTime(interview.interview_date)}</span>
                </div>

                {/* HR Name */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{interview.hr_name} (HR)</span>
                </div>

                {/* Online — meeting link */}
                {isOnline && interview.interview_link && (
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                        <a href={interview.interview_link} target="_blank" rel="noopener noreferrer"
                            className="text-blue-500 hover:underline font-medium">
                            Join Meeting
                        </a>
                    </div>
                )}

                {/* Offline — full address */}
                {!isOnline && interview.interview_address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 sm:col-span-2">
                        <svg className="w-4 h-4 shrink-0 text-orange-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="leading-relaxed">{interview.interview_address}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function InterviewSchedule() {
    const { data, isLoading, isError } = useInterviews();
    const interviews = (data ?? []) as Interview[];

    if (isLoading) return <InterviewSkeleton />;

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
            <div className="mb-2">
                <h1 className="text-xl font-bold text-gray-900">Interview Schedule</h1>
                <p className="text-sm text-gray-400 mt-0.5">Your upcoming interviews</p>
            </div>

            {interviews.map((interview) => (
                <InterviewCard key={interview.application_id} interview={interview} />
            ))}

            <p className="text-center text-xs text-gray-400">
                {interviews.length} interview{interviews.length !== 1 ? "s" : ""} scheduled
            </p>
        </div>
    );
}