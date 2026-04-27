"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobs } from "@/lib/hooks/useJobs";
import { Job } from "@/lib/types/job";

const toSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ── Types ─────────────────────────────────────────────────────────────────────

interface SidebarFilters {
    locations: string[];
    jobTypes: string[];
    experiences: string[];
}

// ── Filter Section ────────────────────────────────────────────────────────────

function FilterSection({ title, isOpen, onToggle, children }: {
    title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) {
    return (
        <div className="border-b border-gray-200">
            <button onClick={onToggle}
                className="w-full flex items-center justify-between py-4 px-0 text-left focus:outline-none group">
                <span className="text-sm font-semibold text-gray-800">{title}</span>
                <span className="text-xl font-light text-gray-500 group-hover:text-orange-500 transition-colors leading-none">
                    {isOpen ? "−" : "+"}
                </span>
            </button>
            <div style={{ maxHeight: isOpen ? "400px" : "0px", overflow: "hidden", transition: "max-height 0.3s ease" }}>
                <div className="pb-4 space-y-3">{children}</div>
            </div>
        </div>
    );
}

// ── Checkbox Option ───────────────────────────────────────────────────────────

function CheckboxOption({ label, count, checked, onChange }: {
    label: string; count: number; checked: boolean; onChange: () => void;
}) {
    return (
        <label onClick={onChange} className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer
                    ${checked ? "bg-orange-500 border-orange-500" : "border-gray-300 group-hover:border-orange-400"}`}>
                    {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
            </div>
            <span className="text-xs text-gray-400">{count}</span>
        </label>
    );
}

// ── Filter Sidebar ────────────────────────────────────────────────────────────
// Filter counts are computed from the API response instead of ALL_JOBS

function FilterSidebar({ jobs, sidebarFilters, onSidebarChange }: {
    jobs: Job[]; sidebarFilters: SidebarFilters; onSidebarChange: (f: SidebarFilters) => void;
}) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        location: false, jobType: false, experience: false,
    });

    const toggleSection = (key: string) =>
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

    const toggleArrayFilter = (key: keyof SidebarFilters, value: string) => {
        const current = sidebarFilters[key];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        onSidebarChange({ ...sidebarFilters, [key]: updated });
    };

    // Build counts from API data
    const locationCounts: Record<string, number> = {};
    const jobTypeCounts: Record<string, number> = {};
    const experienceCounts: Record<string, number> = {};

    jobs.forEach((job) => {
        locationCounts[job.location] = (locationCounts[job.location] || 0) + 1;
        jobTypeCounts[job.job_type] = (jobTypeCounts[job.job_type] || 0) + 1;
        experienceCounts[job.experience_required] = (experienceCounts[job.experience_required] || 0) + 1;
    });

    const activeCount =
        sidebarFilters.locations.length +
        sidebarFilters.jobTypes.length +
        sidebarFilters.experiences.length;

    return (
        <aside className="w-full md:w-64 shrink-0 bg-white rounded-2xl border border-[#F26F24] shadow-sm p-5 self-start sticky top-4 md:p-6">
            <div className="flex items-center justify-between mb-1 pb-4 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-900">
                    Filters{activeCount > 0 ? ` (${activeCount})` : ""}
                </span>
                {activeCount > 0 && (
                    <button
                        onClick={() => onSidebarChange({ locations: [], jobTypes: [], experiences: [] })}
                        className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
                    >
                        Clear filters
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
                            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                )}
            </div>

            <FilterSection title="Location" isOpen={openSections.location} onToggle={() => toggleSection("location")}>
                {Object.entries(locationCounts).map(([loc, count]) => (
                    <CheckboxOption key={loc} label={loc} count={count}
                        checked={sidebarFilters.locations.includes(loc)}
                        onChange={() => toggleArrayFilter("locations", loc)} />
                ))}
            </FilterSection>

            <FilterSection title="Job Type" isOpen={openSections.jobType} onToggle={() => toggleSection("jobType")}>
                {Object.entries(jobTypeCounts).map(([type, count]) => (
                    <CheckboxOption key={type} label={type} count={count}
                        checked={sidebarFilters.jobTypes.includes(type)}
                        onChange={() => toggleArrayFilter("jobTypes", type)} />
                ))}
            </FilterSection>

            <FilterSection title="Experience" isOpen={openSections.experience} onToggle={() => toggleSection("experience")}>
                {Object.entries(experienceCounts).map(([exp, count]) => (
                    <CheckboxOption key={exp} label={exp} count={count}
                        checked={sidebarFilters.experiences.includes(exp)}
                        onChange={() => toggleArrayFilter("experiences", exp)} />
                ))}
            </FilterSection>
        </aside>
    );
}

// ── Search Bar ────────────────────────────────────────────────────────────────

function FilterDropdown({ keyword, setKeyword }: { keyword: string; setKeyword: (v: string) => void }) {
    return (
        <div className="w-full bg-white py-16 px-4">
            <div className="max-w-5xl mx-auto text-center">
                <p className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    Search across thousands of opportunities
                </p>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        placeholder="Job title, skills, or keywords"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full py-3 px-3 text-sm outline-none"
                    />
                </div>
            </div>
        </div>
    );
}

// ── Job Card ──────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: Job }) {
    const router = useRouter();
    return (
        <div className="bg-white border border-[#F26F24] rounded-xl p-5 flex flex-col gap-3">
            <h3 className="text-sm md:text-base font-semibold">{job.title}</h3>
            <span className="text-xs text-gray-500">{job.location}</span>
            <p className="text-xs text-gray-500 line-clamp-2">{job.description}</p>
            <button

                onClick={() => router.push(`/portal/search-jobs/${toSlug(job.title)}?id=${job.id}`)}
                className="mt-auto self-end text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
            >
                Apply
            </button>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function JobCardSkeleton() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="space-y-1.5">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
            <div className="self-end h-8 w-16 bg-gray-200 rounded-lg mt-auto" />
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const CARDS_PER_PAGE = 10;

export default function SearchJobs() {
    const [keyword, setKeyword] = useState("");
    const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>({
        locations: [], jobTypes: [], experiences: [],
    });
    const [showSidebar, setShowSidebar] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // ── Axios + React Query ───────────────────────────────────────────────────
    // useJobs calls GET /jobs with filters via axios
    // Bearer token attached automatically by request interceptor
    // React Query caches — won't refetch on every render
    // Passing keyword to API so backend handles search
    const { data, isLoading, isError } = useJobs({ keyword: keyword || undefined });

    // Laravel paginated: { data: Job[], meta: {...} }
    // If plain array: (data ?? []) as Job[]
    const allJobs = (data?.data ?? []) as Job[];

    // Client-side sidebar filtering on top of API results
    const filtered = allJobs.filter((job) => {
        if (sidebarFilters.locations.length > 0 && !sidebarFilters.locations.includes(job.location))
            return false;
        if (sidebarFilters.jobTypes.length > 0 && !sidebarFilters.jobTypes.includes(job.job_type))
            return false;
        if (sidebarFilters.experiences.length > 0 && !sidebarFilters.experiences.includes(String(job.experience_required)))
            return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * CARDS_PER_PAGE,
        currentPage * CARDS_PER_PAGE
    );

    const handleKeywordChange = (v: string) => {
        setKeyword(v);
        setCurrentPage(1);
    };

    const handleSidebarChange = (filters: SidebarFilters) => {
        setSidebarFilters(filters);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-white">
            <FilterDropdown keyword={keyword} setKeyword={handleKeywordChange} />

            {/* Mobile filter toggle */}
            <div className="md:hidden px-4 py-3 border-b border-gray-100">
                <button
                    onClick={() => setShowSidebar((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-sm active:scale-95 transition-transform duration-100"
                    style={{ backgroundColor: "#F26F24" }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                        <line x1="11" y1="18" x2="13" y2="18" />
                    </svg>
                    {showSidebar ? "Close Filters" : "Filters"}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:p-6 p-4 max-w-7xl mx-auto">

                {/* Sidebar */}
                <div className={`${showSidebar ? "block" : "hidden"} md:block`}>
                    {isLoading ? (
                        <div className="w-full md:w-64 h-64 bg-gray-100 rounded-2xl animate-pulse" />
                    ) : (
                        <FilterSidebar
                            jobs={allJobs}
                            sidebarFilters={sidebarFilters}
                            onSidebarChange={handleSidebarChange}
                        />
                    )}
                </div>

                {/* Job Grid */}
                <div className="flex-1">

                    {/* Loading skeleton */}
                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
                        </div>
                    )}

                    {/* Error */}
                    {isError && (
                        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Failed to load jobs</p>
                            <p className="text-xs text-gray-400">Please refresh the page and try again</p>
                        </div>
                    )}

                    {/* No results */}
                    {!isLoading && !isError && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24">
                                <path d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <p className="text-sm">No jobs match your filters.</p>
                            <button
                                onClick={() => { setSidebarFilters({ locations: [], jobTypes: [], experiences: [] }); setCurrentPage(1); }}
                                className="mt-3 text-xs text-orange-500 hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Cards */}
                    {!isLoading && !isError && filtered.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                {paginated.map((job) => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}
                                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600
                                            hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                        ← Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button key={page} onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                                                ${currentPage === page
                                                    ? "bg-orange-500 text-white"
                                                    : "border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                                                }`}>
                                            {page}
                                        </button>
                                    ))}
                                    <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600
                                            hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                        Next →
                                    </button>
                                </div>
                            )}

                            <p className="text-center text-xs text-gray-400 mt-3">
                                Showing {(currentPage - 1) * CARDS_PER_PAGE + 1}–{Math.min(currentPage * CARDS_PER_PAGE, filtered.length)} of {filtered.length} jobs
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}