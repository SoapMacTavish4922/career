"use client";

import Image from "next/image";
import { ReactNode, useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const collapsed = pathname.includes("/edit-details");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const menuItems = [
        { label: "Search Jobs", path: "/portal/search-jobs", icon: "/briefcase.svg" },
        { label: "Applied Jobs", path: "/portal/applied-jobs", icon: "/web-browser.svg" },
        { label: "Interview Schedule", path: "/portal/interview-schedule", icon: "/calendar1.svg" },
        { label: "FAQs", path: "/portal/FAQ", icon: "/question.svg" },
    ];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
                setDropdownOpen(false);
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node))
                setMobileMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        router.push("/login");
    };

    const handleEditDetails = () => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        router.push("/portal/edit-details");
    };

    const handleNavigate = (path: string) => {
        setMobileMenuOpen(false);
        router.push(path);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* DESKTOP SIDEBAR — hidden on mobile */}
            <aside className={`group hidden lg:flex fixed left-0 top-2 h-[calc(100vh-1rem)] ml-2 bg-[#006256]
                rounded-2xl text-white flex-col justify-between shadow-lg transition-all duration-300 z-40
                ${collapsed ? "w-16 hover:w-55" : "w-55"}`}
            >
                <div className="flex flex-col">
                    <div className="h-16 flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                            ${collapsed ? "flex group-hover:hidden" : "hidden"}`} />
                        <Image
                            src="/white-intech-logo.png"
                            alt="IDBI Intech"
                            width={110}
                            height={30}
                            onClick={() => router.push("/portal/search-jobs")}
                            className={`cursor-pointer ${collapsed ? "hidden group-hover:block" : "block"}`}
                        />
                    </div>

                    <nav className="flex flex-col gap-3 px-2 mt-6">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <div key={item.label} onClick={() => router.push(item.path)} title={item.label}
                                    className={`flex items-center py-3 rounded-xl cursor-pointer transition
                                        ${collapsed
                                            ? "justify-center px-0 gap-0 group-hover:px-3 group-hover:gap-3 group-hover:justify-start"
                                            : "px-3 gap-3"}
                                        ${isActive ? "bg-emerald-700" : "hover:bg-emerald-800"}`}
                                >
                                    <Image src={item.icon} alt={item.label} width={18} height={18} className="shrink-0" />
                                    <span className={`text-sm whitespace-nowrap transition-all duration-200
                                        ${collapsed
                                            ? "opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto"
                                            : "opacity-100 w-auto"}`}>
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </nav>
                </div>

                <div className="px-2 pb-4">
                    <div onClick={handleLogout} title="Logout"
                        className={`flex items-center py-3 rounded-xl cursor-pointer transition hover:bg-emerald-800
                            ${collapsed
                                ? "justify-center px-0 gap-0 group-hover:px-3 group-hover:gap-3 group-hover:justify-start"
                                : "px-3 gap-3"}`}
                    >
                        <Image src="/logout.svg" alt="logout" width={18} height={18} className="shrink-0" />
                        <span className={`text-sm transition-all duration-200
                            ${collapsed
                                ? "opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto"
                                : "opacity-100 w-auto"}`}>
                            Logout
                        </span>
                    </div>
                </div>
            </aside>

            {/* RIGHT CONTENT */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>

                {/* ── Topbar ── */}
                <header className="h-16 bg-gray-100 flex items-center justify-between lg:justify-end px-4 lg:px-6 border-b border-gray-200 sticky top-0 z-30">

                    {/* ── Mobile left: Hamburger button ── */}
                    <div className="lg:hidden relative" ref={mobileMenuRef}>
                        <button
                            onClick={() => setMobileMenuOpen((p) => !p)}
                            className="w-10 h-10 rounded-xl bg-[#006256] flex items-center justify-center text-white"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Mobile nav dropdown */}
                        {mobileMenuOpen && (
                            <div className="absolute left-0 top-12 w-56 bg-[#006256] border border-[#004d45] rounded-2xl shadow-xl overflow-hidden z-50">
                                <div className="py-1.5">
                                    {menuItems.map((item) => {
                                        const isActive = pathname === item.path;
                                        return (
                                            <button key={item.label} onClick={() => handleNavigate(item.path)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors
                                                        ${isActive
                                                        ? "bg-emerald-700 text-white font-semibold"
                                                        : "text-white/80 hover:bg-emerald-800 hover:text-white"}`}
                                            >
                                                <Image src={item.icon} alt={item.label} width={16} height={16} className="shrink-0" />
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Profile dropdown ── */}
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setDropdownOpen((p) => !p)}
                            className="flex items-center gap-2.5 cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-[#006256] flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-transparent group-hover:ring-[#006256]/30 transition-all overflow-hidden">
                                JW
                            </div>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-12 w-52 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                    <p className="text-xs font-bold text-gray-800">Joe William</p>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">joe.william@gmail.com</p>
                                </div>
                                <div className="py-1.5">
                                    <button onClick={() => { setDropdownOpen(false); router.push("/portal/profile"); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                                        <Image src="/user.svg" alt="profile" width={16} height={16} className="shrink-0" />
                                        My Profile
                                    </button>
                                    <div className="mx-3 my-1 h-px bg-gray-100" />
                                    <button onClick={handleEditDetails}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit Details
                                    </button>
                                    <div className="mx-3 my-1 h-px bg-gray-100" />
                                    <button onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
                                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* ── Page Content ── */}
                <main className="p-3 lg:p-6">
                    <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.14)] border border-gray-100 p-4 lg:p-6 min-h-[calc(100vh-5rem)]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}