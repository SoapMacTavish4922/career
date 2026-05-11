"use client";

import { useState } from "react";
import { useAppliedJobs } from "@/lib/hooks/useJobs";

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

// ── Applied Job Card ──────────────────────────────────────────────────────────
function AppliedJobCard({ item }: { item: any }) {
    const [expanded, setExpanded] = useState(false);
    const job = item.job;

    return (
        <div
            className="border border-orange-400 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-200"
        >
            {/* ── Collapsed header — always visible ── */}
            <div
                className="p-5 flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded((v) => !v)}
            >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-gray-800 leading-snug truncate">{job.title}</h2>
                    <p className="text-xs text-gray-400">{job.location}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
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

            {/* ── Expanded details ── */}
            {expanded && (
                <div className="px-5 pb-5 border-t border-gray-100 flex flex-col gap-4 pt-4">

                    {/* Experience + Qualification */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                        {job.experience_required && (
                            <p className="text-xs text-gray-500">
                                <span className="font-semibold text-gray-700">Experience: </span>
                                {job.experience_required} yrs
                            </p>
                        )}
                        {job.qualification && (
                            <p className="text-xs text-gray-500">
                                <span className="font-semibold text-gray-700">Qualification: </span>
                                {job.qualification}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    {job.description && (
                        <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Description</p>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">{job.description}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-700 mb-2">Skills Required</p>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill: string) => (
                                    <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Responsibilities */}
                    {job.responsibilities?.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Responsibilities</p>
                            <ul className="flex flex-col gap-1">
                                {job.responsibilities.map((r: string, i: number) => (
                                    <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                                        <span className="text-orange-400 mt-0.5 shrink-0">•</span>
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AppliedJobs() {
    const { data, isLoading, isError } = useAppliedJobs();
    const jobs = (data ?? []) as any[];

    if (isLoading) return <AppliedJobsSkeleton />;

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
            <div className="mb-2">
                <h1 className="text-xl font-bold text-gray-900">Applied Jobs</h1>
                <p className="text-sm text-gray-400 mt-0.5">Track the status of your job applications</p>
            </div>

            {jobs.length === 0 && <EmptyState />}

            {jobs.map((item) => (
                <AppliedJobCard key={item.id} item={item} />
            ))}
        </div>
    );
}