"use client";

import { useState } from "react";
import { useSavedJobsList, useToggleSaveJob } from "@/lib/hooks/useJobs";
import { useRouter } from "next/navigation";

const toSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ── Saved Job Card ────────────────────────────────────────────────────────────
function SavedJobCard({ item, onToggle }: { item: any; onToggle: (id: string) => void }) {
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();
    const job = item.job;

    return (
        <div className="border border-orange-400 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-200">

            {/* ── Collapsed header — always visible, no buttons ── */}
            <div
                className="p-5 flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded((v) => !v)}
            >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-gray-800 leading-snug truncate">{job.title}</h2>
                    <p className="text-xs text-gray-400">{job.location}</p>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* ── Expanded details + buttons ── */}
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

                    {/* ── Action buttons — only in expanded view ── */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
                        {/* Bookmark toggle */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggle(job.id); }}
                            className="flex items-center gap-2 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                            title="Remove from saved"
                        >
                            <svg width="16" height="16" fill="#F26F24" stroke="#F26F24" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                            </svg>
                            Unsave
                        </button>

                        {/* Apply button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/portal/search-jobs/${toSlug(job.title)}?id=${job.id}`);
                            }}
                            className="text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function SavedJobs() {
    const { data, isLoading, isError } = useSavedJobsList();
    const { mutate: toggleSaveJob } = useToggleSaveJob();
    const jobs = (data?.data ?? []) as any[];

    if (isLoading) return (
        <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl p-6 animate-pulse h-20 bg-white" />
            ))}
        </div>
    );

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-semibold text-gray-700">Failed to load saved jobs</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="mb-2">
                <h1 className="text-xl font-bold text-gray-900">Saved Jobs</h1>
                <p className="text-sm text-gray-400 mt-0.5">Jobs you've bookmarked for later</p>
            </div>

            {jobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21l-5-3-5 3V5a2 2 0 012-2h6a2 2 0 012 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">No saved jobs yet</p>
                        <p className="text-xs text-gray-400 mt-1">Bookmark jobs to view them here</p>
                    </div>
                </div>
            )}

            {jobs.map((item) => (
                <SavedJobCard
                    key={item.id}
                    item={item}
                    onToggle={toggleSaveJob}
                />
            ))}
        </div>
    );
}