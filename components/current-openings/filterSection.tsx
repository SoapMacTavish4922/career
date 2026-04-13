"use client";
import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Filters {
  keyword: string;
  location: string;
  jobType: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
  experience: string;
  jobType: string;
  description: string;
}

// ── Experience Parser ─────────────────────────────────────────────────────────

function parseExperience(exp: string): { min: number; max: number } {
  const s = exp.toLowerCase().trim();

  // "5+ years" / "3+ years"
  const plusMatch = s.match(/^(\d+)\+/);
  if (plusMatch) return { min: parseInt(plusMatch[1]), max: 99 };

  // "1 to 3 years" / "1-3 years" / "2 to 4 years"
  const rangeMatch = s.match(/(\d+)\s*(?:to|-)\s*(\d+)/);
  if (rangeMatch) return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };

  // "fresher" / "0-1 years"
  if (s.includes("fresher") || s.startsWith("0")) return { min: 0, max: 1 };

  // "5 years" — single number
  const singleMatch = s.match(/^(\d+)/);
  if (singleMatch) {
    const n = parseInt(singleMatch[1]);
    return { min: n, max: n };
  }

  return { min: 0, max: 99 };
}

const EXP_MIN = 0;
const EXP_MAX = 15;

// ── Data ─────────────────────────────────────────────────────────────────────

const ALL_JOBS: Job[] = [
  { id: 1, title: "Software Engineer - Backend and Database Technologies", location: "CBD Belapur", experience: "1 to 3 Years", jobType: "Full-time", description: "Technically proficient Software Engineer with strong PHP and SQL expertise to build, optimize, and maintain secure, scalable applications in a collaborative, fast-paced environment." },
  { id: 2, title: "PHP Developer", location: "CBD Belapur", experience: "3+ Years", jobType: "Full-time", description: "Technically proficient Software Engineer with strong PHP and SQL expertise to build, optimize, and maintain secure, scalable applications in a collaborative, fast-paced environment." },
  { id: 3, title: "Team Leader - Application Support", location: "CBD Belapur", experience: "5 to 7 Years", jobType: "Full-time", description: "Technically proficient Software Engineer with strong PHP and SQL expertise to build, optimize, and maintain secure, scalable applications in a collaborative, fast-paced environment." },
  { id: 4, title: "Oracle Database Administration", location: "DRC Chennai", experience: "3+ Years", jobType: "Contract", description: "Technically proficient Software Engineer with strong PHP and SQL expertise to build, optimize, and maintain secure, scalable applications in a collaborative, fast-paced environment." },
  { id: 5, title: "Software Engineer - Backend and Database Technologies", location: "CBD Belapur", experience: "1 to 3 Years", jobType: "Full-time", description: "Technically proficient Software Engineer with strong PHP and SQL expertise to build, optimize, and maintain secure, scalable applications in a collaborative, fast-paced environment." },
  { id: 6, title: "React Frontend Developer", location: "Mumbai", experience: "1 to 3 Years", jobType: "Full-time", description: "Build and maintain responsive, high-performance React applications. Collaborate with design and backend teams to deliver seamless user experiences." },
  { id: 7, title: "DevOps Engineer", location: "Pune", experience: "3+ Years", jobType: "Full-time", description: "Manage CI/CD pipelines, cloud infrastructure, and deployment automation to ensure reliable, scalable, and secure application delivery." },
  { id: 8, title: "UI/UX Design Intern", location: "Mumbai", experience: "0-1 Years", jobType: "Internship", description: "Assist in designing user interfaces and experiences for web and mobile products. Work closely with senior designers and product managers." },
  { id: 9, title: "Full Stack Developer (MERN)", location: "Mumbai", experience: "2 to 4 Years", jobType: "Full-time", description: "Develop and maintain full-stack applications using MongoDB, Express, React, and Node.js. Collaborate with cross-functional teams to deliver scalable solutions." },
  { id: 10, title: "Frontend Developer (Angular)", location: "Pune", experience: "2 to 5 Years", jobType: "Full-time", description: "Build dynamic and responsive web applications using Angular. Ensure performance optimization and seamless user experience across devices." },
  { id: 11, title: "Data Analyst", location: "Mumbai", experience: "1 to 3 Years", jobType: "Full-time", description: "Analyze datasets to generate insights and reports. Work with SQL, Excel, and BI tools to support business decision-making." },
  { id: 12, title: "QA Engineer (Automation)", location: "Pune", experience: "2 to 4 Years", jobType: "Full-time", description: "Design and execute automated test cases. Ensure software quality using Selenium, Cypress, and CI/CD integration." },
  { id: 13, title: "Cybersecurity Analyst", location: "Mumbai", experience: "3+ Years", jobType: "Full-time", description: "Monitor and protect systems against cyber threats. Conduct vulnerability assessments and implement security best practices." },
  { id: 14, title: "Node.js Backend Developer", location: "Bangalore", experience: "2 to 5 Years", jobType: "Full-time", description: "Develop scalable backend services using Node.js and Express. Optimize APIs and ensure secure data handling." },
  { id: 15, title: "Mobile App Developer (Flutter)", location: "Remote", experience: "1 to 3 Years", jobType: "Full-time", description: "Build cross-platform mobile applications using Flutter. Ensure high performance and responsive UI across devices." },
  { id: 16, title: "Technical Support Engineer", location: "Mumbai", experience: "1 to 2 Years", jobType: "Full-time", description: "Provide technical assistance to clients. Troubleshoot software issues and ensure timely resolution." },
  { id: 17, title: "Product Manager", location: "Mumbai", experience: "4 to 7 Years", jobType: "Full-time", description: "Lead product development lifecycle from ideation to launch. Coordinate with engineering, design, and business teams." },
  { id: 18, title: "Business Analyst", location: "Pune", experience: "2 to 5 Years", jobType: "Full-time", description: "Gather and analyze business requirements. Bridge communication between stakeholders and development teams." },
  { id: 19, title: "Cloud Engineer (AWS)", location: "Bangalore", experience: "3+ Years", jobType: "Full-time", description: "Design and manage cloud infrastructure on AWS. Ensure scalability, security, and cost optimization." },
  { id: 20, title: "SEO Specialist", location: "Mumbai", experience: "1 to 3 Years", jobType: "Full-time", description: "Optimize websites for search engines. Perform keyword research, technical SEO audits, and improve organic rankings." },
];

const CARDS_PER_PAGE = 10;

// ── Filter Section ────────────────────────────────────────────────────────────

function FilterSection({ title, isOpen, onToggle, children }: {
  title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200">
      <button onClick={onToggle} className="w-full flex items-center justify-between py-4 px-0 text-left focus:outline-none group">
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

interface SidebarFilters {
  locations: string[];
  jobTypes: string[];
  experienceMin: number;   // ✅ replaced experiences: string[]
  experienceMax: number;
}

function FilterSidebar({ sidebarFilters, onSidebarChange }: {
  sidebarFilters: SidebarFilters;
  onSidebarChange: (filters: SidebarFilters) => void;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    location: false,
    jobType: true,
    experience: true,
  });

  const toggleSection = (key: string) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleArrayFilter = (key: "locations" | "jobTypes", value: string) => {
    const current = sidebarFilters[key];
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onSidebarChange({ ...sidebarFilters, [key]: updated });
  };

  const locationCounts: Record<string, number> = {};
  const jobTypeCounts: Record<string, number> = {};

  ALL_JOBS.forEach((job) => {
    locationCounts[job.location] = (locationCounts[job.location] || 0) + 1;
    jobTypeCounts[job.jobType] = (jobTypeCounts[job.jobType] || 0) + 1;
  });

  const expIsDefault = sidebarFilters.experienceMin === EXP_MIN && sidebarFilters.experienceMax === EXP_MAX;
  const activeCount = sidebarFilters.locations.length + sidebarFilters.jobTypes.length + (expIsDefault ? 0 : 1);

  const clearAll = () => onSidebarChange({
    locations: [],
    jobTypes: [],
    experienceMin: EXP_MIN,
    experienceMax: EXP_MAX,
  });

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white rounded-2xl border border-[#F26F24] shadow-sm p-5 self-start sticky top-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 pb-4 border-b border-gray-200">
        <span className="text-sm font-bold text-gray-900">
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </span>
        {activeCount > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
            Clear filters
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Location */}
      <FilterSection title="Location" isOpen={openSections.location} onToggle={() => toggleSection("location")}>
        {Object.entries(locationCounts).map(([loc, count]) => (
          <CheckboxOption key={loc} label={loc} count={count}
            checked={sidebarFilters.locations.includes(loc)}
            onChange={() => toggleArrayFilter("locations", loc)}
          />
        ))}
      </FilterSection>

      {/* Job Type */}
      <FilterSection title="Job Type" isOpen={openSections.jobType} onToggle={() => toggleSection("jobType")}>
        {Object.entries(jobTypeCounts).map(([type, count]) => (
          <CheckboxOption key={type} label={type} count={count}
            checked={sidebarFilters.jobTypes.includes(type)}
            onChange={() => toggleArrayFilter("jobTypes", type)}
          />
        ))}
      </FilterSection>

      {/* ✅ Experience — Min/Max inputs */}
      <FilterSection title="Experience (Years)" isOpen={openSections.experience} onToggle={() => toggleSection("experience")}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="number"
              min={EXP_MIN}
              max={sidebarFilters.experienceMax}
              value={sidebarFilters.experienceMin}
              onChange={(e) => onSidebarChange({
                ...sidebarFilters,
                experienceMin: Math.min(Number(e.target.value), sidebarFilters.experienceMax),
              })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 w-full"
            />
          </div>

          <span className="text-gray-400 mt-5">—</span>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Max</label>
            <input
              type="number"
              min={sidebarFilters.experienceMin}
              max={EXP_MAX}
              value={sidebarFilters.experienceMax}
              onChange={(e) => onSidebarChange({
                ...sidebarFilters,
                experienceMax: Math.max(Number(e.target.value), sidebarFilters.experienceMin),
              })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 w-full"
            />
          </div>
        </div>

        {/* Visual hint */}
        <p className="text-xs text-gray-400 mt-2">
          {sidebarFilters.experienceMax >= EXP_MAX
            ? `${sidebarFilters.experienceMin}+ years`
            : `${sidebarFilters.experienceMin} – ${sidebarFilters.experienceMax} years`}
        </p>
      </FilterSection>
    </aside>
  );
}

// ── Search Bar ────────────────────────────────────────────────────────────────

function FilterDropdown({ keyword, setKeyword }: { keyword: string; setKeyword: (v: string) => void }) {
  return (
    <div className="w-full bg-gradient-to-br from-orange-50 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Find Your Dream Job</h1>
        <p className="text-gray-500 mb-8 text-sm md:text-base">Search across thousands of opportunities</p>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Job title, skills, or keywords"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full py-3 px-3 text-sm outline-none"
          />
          <button className="bg-orange-500 text-white px-6 py-3 rounded-xl text-sm">Search</button>
        </div>
      </div>
    </div>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white border border-[#F26F24] rounded-xl p-5 flex flex-col gap-3">
      <h3 className="text-sm md:text-base font-semibold">{job.title}</h3>
      <span className="text-xs text-gray-500">{job.location}</span>
      <span className="text-xs text-gray-400">{job.experience}</span>
      <p className="text-xs text-gray-500">{job.description}</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function JobBoard() {
  const [filters, setFilters] = useState<Filters>({ keyword: "", location: "", jobType: "" });
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>({
    locations: [],
    jobTypes: [],
    experienceMin: EXP_MIN,   // ✅
    experienceMax: EXP_MAX,   // ✅
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const update = (key: keyof Filters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setCurrentPage(1);
  };

  const handleSidebarChange = (filters: SidebarFilters) => {
    setSidebarFilters(filters);
    setCurrentPage(1);
  };

  const filtered = ALL_JOBS.filter((job) => {
    // Keyword
    const kw = filters.keyword.toLowerCase();
    if (kw && !job.title.toLowerCase().includes(kw) && !job.description.toLowerCase().includes(kw)) return false;

    // Location
    if (sidebarFilters.locations.length > 0 && !sidebarFilters.locations.includes(job.location)) return false;

    // Job type
    if (sidebarFilters.jobTypes.length > 0 && !sidebarFilters.jobTypes.includes(job.jobType)) return false;

    // ✅ Experience — parse string into range then check overlap
    const { min: jobMin, max: jobMax } = parseExperience(job.experience);
    if (jobMin > sidebarFilters.experienceMax || jobMax < sidebarFilters.experienceMin) return false;

    return true;
  });

  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterDropdown keyword={filters.keyword} setKeyword={(v) => update("keyword", v)} />

      {/* Mobile filter toggle */}
      <div className="md:hidden px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-sm active:scale-95 transition-transform duration-100"
          style={{ backgroundColor: "#F26F24" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          {showSidebar ? "Close Filters" : "Filters"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className={`${showSidebar ? "block" : "hidden"} md:block`}>
          <FilterSidebar sidebarFilters={sidebarFilters} onSidebarChange={handleSidebarChange} />
        </div>

        {/* Job Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24">
                <path d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-sm">No jobs match your filters.</p>
              <button
                onClick={() => { setSidebarFilters({ locations: [], jobTypes: [], experienceMin: EXP_MIN, experienceMax: EXP_MAX }); setCurrentPage(1); }}
                className="mt-3 text-xs text-orange-500 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {paginated.map((job) => <JobCard key={job.id} job={job} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                        ${currentPage === page ? "bg-orange-500 text-white" : "border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"}`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
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