"use client";

import { useState } from "react";

interface Question {
    id: number;
    ques: string;
    ans: string;
}

const faq: Question[] = [
    {
        id: 1,
        ques: "How to Log-in to career portal?",
        ans: "Use this link for login http://xyz.com"
    },
    {
        id: 2,
        ques: "Error Signing-up for Job?",
        ans: "Please ensure your email is verified and try again. Contact HR if the issue persists."
    },
    {
        id: 3,
        ques: "Unable to view job details?",
        ans: "Try refreshing the page or clearing your browser cache. Make sure you are logged in."
    },
    {
        id: 4,
        ques: "Apply button not working?",
        ans: "Ensure your profile is complete before applying. If the issue persists, contact support."
    },
    {
        id: 5,
        ques: "How to Sign-in to career portal?",
        ans: "Visit the portal homepage and click 'Sign In'. Use your registered email and password."
    },
    {
        id: 6,
        ques: "Contact HR for job query?",
        ans: "You can reach HR at hr@company.com or call +91-XXXXXXXXXX during business hours."
    },
    {
        id: 7,
        ques: "Can I apply for 2 positions at the same time?",
        ans: "Yes, you can apply for multiple positions simultaneously from your dashboard."
    },
];

export default function FaqPage() {
    const [openId, setOpenId] = useState<number | null>(null);

    const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

    return (
        <div className="flex flex-col gap-4">
            {faq.length === 0 ? (
                <p className="text-sm text-gray-500">No FAQs available at the moment.</p>
            ) : (
                faq.map((item) => {
                    const isOpen = openId === item.id;

                    return (
                        <div
                            key={item.id}
                            className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden transition-all"
                        >
                            {/* Question Row */}
                            <button
                                onClick={() => toggle(item.id)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left"
                            >
                                <p className="text-sm font-medium text-gray-800">{item.ques}</p>

                               
                                <span
                                    className={`shrink-0 inline-block transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: "5px solid transparent",
                                        borderRight: "5px solid transparent",
                                        borderTop: "6px solid #9ca3af",
                                    }}
                                />
                            </button>

                            {/* Answer */}
                            <div
                                className={`px-6 text-sm text-gray-600 transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
                                    } overflow-hidden`}
                            >
                                <div className="border-t border-gray-100 pt-4">{item.ans}</div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}