"use client";

import { useParams, useRouter } from "next/navigation";
import { useJob } from "@/lib/hooks/useJobs";

// ── Helpers ───────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="flex flex-col gap-3">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F26F24] shrink-0" />
                    {item}
                </li>
            ))}
        </ul>
    );
}

function TagList({ items }: { items: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
                <span
                    key={i}
                    className="text-xs font-semibold bg-[#006256]/8 text-[#006256] border border-[#006256]/20 px-3 py-1.5 rounded-lg"
                >
                    {item}
                </span>
            ))}
        </div>
    );
}

function Divider() {
    return <div className="h-px bg-gray-100" />;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function JobDetailSkeleton() {
    return (
        <div className="max-w-3xl flex flex-col gap-7 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="bg-gray-200 rounded-2xl p-7 flex flex-col gap-4">
                <div className="h-5 bg-gray-300 rounded w-20" />
                <div className="h-8 bg-gray-300 rounded w-3/4" />
                <div className="flex gap-6">
                    <div className="h-4 bg-gray-300 rounded w-28" />
                    <div className="h-4 bg-gray-300 rounded w-24" />
                </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-6 flex flex-col gap-3">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-4/6" />
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        <div className="h-4 bg-gray-200 rounded w-40" />
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-4/5" />
                        </div>
                        {i < 2 && <div className="h-px bg-gray-100 mt-2" />}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug   = String(params.slug);

    // ── Axios + React Query ───────────────────────────────────────────────────
    // useJob calls GET /jobs/{slug} via axios
    // Bearer token attached automatically by request interceptor
    // Result cached by React Query — won't refetch on every render
    const { data: job, isLoading, isError } = useJob(slug);

    // ── Loading state ─────────────────────────────────────────────────────────
    if (isLoading) return (
        <div className="p-6">
            <JobDetailSkeleton />
        </div>
    );

    // ── Error / Not found state ───────────────────────────────────────────────
    if (isError || !job) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <p className="text-gray-500 text-sm">Job not found.</p>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-[#F26F24] hover:underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl flex flex-col gap-7">

            {/* ── Back ── */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#006256] transition-colors w-fit font-medium"
            >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back to Jobs
            </button>

            {/* ── Header Card ── */}
            <div className="bg-gradient-to-br from-[#006256] to-[#004d45] rounded-2xl p-7 flex flex-col gap-5">
                <span className="w-fit text-xs font-bold uppercase tracking-widest bg-white/15 text-white/90 px-3 py-1 rounded-full">
                    {job.jobType}
                </span>
                <h1 className="text-2xl font-bold text-white leading-snug">
                    {job.title}
                </h1>
                <div className="flex flex-wrap gap-x-8 gap-y-1.5">
                    <span className="flex items-center gap-1.5 text-sm text-white/75">
                        <img src="/location.svg" alt="location" className="w-4 h-4" />
                        {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-white/75">
                        <img src="/briefcase.svg" alt="experience" className="w-4 h-4" />
                        {job.experience}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-white/75">
                        <img src="/calendar4.svg" alt="posted" className="w-4 h-4" />
                        Posted On: {job.postedOn}
                    </span>
                </div>
            </div>

            {/* ── Description ── */}
            <div className="bg-[#fdf8f4] border border-orange-100 rounded-2xl px-6 py-6 flex flex-col gap-3">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Job Description</h2>
                <p className="text-sm text-gray-700 leading-7">{job.description}</p>
            </div>

            {/* ── Content sections ── */}
            <div className="bg-white border border-gray-200 rounded-2xl px-6 py-6 flex flex-col gap-7">

                <Section title="Key Responsibilities">
                    <BulletList items={job.responsibilities} />
                </Section>

                <Divider />

                <Section title="Required Skills">
                    <TagList items={job.skills} />
                </Section>

                <Divider />

                <Section title="Qualifications">
                    <BulletList items={job.qualifications} />
                </Section>

                {job.certifications.length > 0 && (
                    <>
                        <Divider />
                        <Section title="Certifications">
                            <BulletList items={job.certifications} />
                        </Section>
                    </>
                )}
            </div>

            {/* ── Apply ── */}
            <div className="flex items-center gap-4 pb-4">
                <button
                    onClick={() => router.push(`/portal/search-jobs/${slug}/apply-now`)}
                    className="bg-[#F26F24] hover:bg-orange-600 text-white text-sm font-bold px-10 py-3 rounded-xl transition-colors shadow-sm"
                >
                    Apply Now
                </button>
                <button
                    onClick={() => router.back()}
                    className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                >
                    Maybe later
                </button>
            </div>
        </div>
    );
}