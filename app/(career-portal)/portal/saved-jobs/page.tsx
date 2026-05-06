"use client";

import { useSavedJobsList, useToggleSaveJob } from "@/lib/hooks/useJobs";
import { useRouter } from "next/navigation";

const toSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function SavedJobs() {
    const router = useRouter();
    const { data, isLoading, isError } = useSavedJobsList();
    const { mutate: toggleSaveJob } = useToggleSaveJob();
    const jobs = (data?.data ?? []) as any[];

    if (isLoading) return <div className="flex flex-col gap-4">{[...Array(3)].map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl p-6 animate-pulse h-24 bg-white" />
    ))}</div>;

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
                <div key={item.id} className="border border-orange-400 rounded-2xl p-5 flex items-center justify-between bg-white gap-4 shadow-sm">
                    <div className="flex flex-col gap-1 flex-1">
                        <h2 className="text-sm font-semibold text-gray-800">{item.title}</h2>
                        <p className="text-xs text-gray-400">{item.location}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Unsave button */}
                        <button
                            onClick={() => toggleSaveJob(item.id)}
                            className="text-orange-500 hover:text-gray-400 transition-colors"
                            title="Remove from saved"
                        >
                            <svg width="18" height="18" fill="#F26F24" stroke="#F26F24" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                            </svg>
                        </button>
                        {/* Apply button */}
                        <button
                            onClick={() => router.push(`/portal/search-jobs/${toSlug(item.title)}?id=${item.id}`)}
                            className="text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}