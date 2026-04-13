"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const collapsed = pathname.includes("/edit-details");

    const menuItems = [
        { label: "Search Jobs", path: "/portal/search-jobs", icon: "/briefcase.svg" },
        { label: "Applied Jobs", path: "/portal/applied-jobs", icon: "/web-browser.svg" },
        { label: "Interview Schedule", path: "/portal/interview-schedule", icon: "/calendar1.svg" },
        { label: "FAQs", path: "/portal/FAQ", icon: "/question.svg" },
    ];

    return (
        <div className="flex min-h-screen bg-white">

            {/* ───────── Sidebar ───────── */}
            <aside className={`fixed left-0 top-2 h-[calc(100vh-1rem)] ml-2 bg-[#006256] 
                rounded-2xl text-white flex flex-col justify-between shadow-lg transition-all 
                duration-300 ${collapsed ? "w-16" : "w-55"}`}
            >
                {/* ───────── Top Section ───────── */}
                <div className="flex flex-col">

                    {/* Logo */}
                    <div className="h-16 flex items-center justify-center">
                        {collapsed ? (
                            <div
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                                onClick={() => router.push("/portal/search-jobs")}
                            >
                                <img
                                    src="/menu.svg"
                                    alt="menu"
                                    className="w-4 h-4"
                                />
                            </div>
                        ) : (
                            <Image
                                src="/white-intech-logo.png"
                                alt="IDBI Intech"
                                width={110}
                                height={30}
                                className="cursor-pointer"
                                onClick={() => router.push("/portal/dashboard")}
                            />
                        )}
                    </div>

                    {/* Menu */}
                    <nav className="flex flex-col gap-3 px-2 mt-6">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;

                            return (
                                <div
                                    key={item.label}
                                    onClick={() => router.push(item.path)}
                                    title={item.label}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition
                                        ${collapsed ? "justify-center" : ""}
                                        ${isActive ? "bg-emerald-700" : "hover:bg-emerald-800"}`}
                                >
                                    <Image
                                        src={item.icon}
                                        alt={item.label}
                                        width={18}
                                        height={18}
                                    />
                                    {!collapsed && <span className="text-sm">{item.label}</span>}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* ───────── Bottom Section ───────── */}
                <div className="px-2 pb-4">
                    <div
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer 
                        transition hover:bg-emerald-800 ${collapsed ? "justify-center" : ""}`}
                        title="Logout"
                    >
                        <Image src="/logout.svg" alt="logout" width={18} height={18} />
                        {!collapsed && <span className="text-sm">Logout</span>}
                    </div>
                </div>
            </aside>

            {/* ───────── Right Content ───────── */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>

                {/* Topbar */}
                <header className="h-16 bg-white flex items-center justify-end px-6">
                    <button
                        onClick={() => router.push("/portal/dashboard")}
                        className="flex justify-end items-center gap-4 cursor-pointer"
                    >
                        <span className="text-sm font-medium">Joe William</span>
                    </button>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 min-h-125">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}