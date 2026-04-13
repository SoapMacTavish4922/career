"use client";

import Image from "next/image";
import { useState } from "react";

interface Interview {
    id: number;
    role: string;
    date: string;
    time: string;
    contact: string;
}

const interviews: Interview[] = [
    { id: 1, role: "Software Engineer - Backend and Database Technologies", date: "25/02/26", time: "Between 11am to 2pm", contact: "9836480902" },
    { id: 2, role: "React", date: "25/02/26", time: "Between 11am to 2pm", contact: "9836480902" },
    { id: 3, role: "PHP Developer", date: "25/02/26", time: "Between 11am to 2pm", contact: "9836480902" },
    { id: 4, role: "Java Dev", date: "25/02/26", time: "Between 11am to 2pm", contact: "9836480902" },
];

const CARDS_PER_PAGE = 5;

export default function InterviewSchedule() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(interviews.length / CARDS_PER_PAGE);
    const paginated = interviews.slice(
        (currentPage - 1) * CARDS_PER_PAGE,
        currentPage * CARDS_PER_PAGE
    );

    return (
        <div className="flex flex-col gap-4">
            {interviews.length === 0 ? (
                <p className="text-sm text-gray-500">No interviews scheduled at the moment.</p>
            ) : (
                <>
                    {/* Cards */}
                    {paginated.map((interview) => (
                        <InterviewCard key={interview.id} interview={interview} />
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                            {/* Prev */}
                            <button
                                onClick={() => setCurrentPage((p) => p - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600
                                    hover:border-orange-400 hover:text-orange-500 disabled:opacity-30
                                    disabled:cursor-not-allowed transition-colors"
                            >
                                ← Prev
                            </button>

                            {/* Page numbers */}
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

                            {/* Next */}
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
                </>
            )}
        </div>
    );
}

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