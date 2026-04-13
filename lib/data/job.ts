export interface Job {
    id: number;
    title: string;
    location: string;
    experience: string;
    jobType: string;
    description: string;
    skills: string[];
    qualifications: string[];
    certifications: string[];
    responsibilities: string[];
    postedOn: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

export const ALL_JOBS: Job[] = [
    {
        id: 1,
        title: "Software Engineer - Backend and Database Technologies",
        location: "CBD Belapur",
        experience: "1 to 3 Years",
        jobType: "Full-time",
        description: "Technically proficient Software Engineer with strong PHP and SQL expertise to build, optimize, and maintain secure, scalable applications.",
        skills: ["PHP", "SQL", "MySQL", "REST APIs", "Git"],
        qualifications: ["B.E / B.Tech in Computer Science", "1+ year backend experience"],
        certifications: ["AWS Certified Developer (preferred)"],
        responsibilities: [
            "Develop backend services",
            "Optimize queries",
            "Integrate APIs",
            "Code reviews"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 2,
        title: "Frontend Developer - React.js",
        location: "Pune",
        experience: "1 to 2 Years",
        jobType: "Full-time",
        description: "Creative frontend developer skilled in React.js to build responsive and user-friendly interfaces.",
        skills: ["React.js", "JavaScript", "Tailwind CSS", "HTML", "CSS"],
        qualifications: ["B.Tech / BCA", "Experience with React"],
        certifications: ["Frontend Developer Certification (preferred)"],
        responsibilities: [
            "Build UI components",
            "Optimize performance",
            "Work with APIs",
            "Ensure responsiveness"
        ],
        postedOn: "23 Mar 2026"

    },
    {
        id: 3,
        title: "Full Stack Developer",
        location: "Mumbai",
        experience: "2 to 4 Years",
        jobType: "Full-time",
        description: "Looking for a full stack developer proficient in MERN stack to handle end-to-end development.",
        skills: ["MongoDB", "Express", "React", "Node.js"],
        qualifications: ["B.E / B.Tech", "2+ years experience"],
        certifications: ["MERN Certification (preferred)"],
        responsibilities: [
            "Develop frontend & backend",
            "Manage databases",
            "Build APIs",
            "Debug applications"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 4,
        title: "UI/UX Designer",
        location: "Bangalore",
        experience: "1 to 3 Years",
        jobType: "Full-time",
        description: "Creative UI/UX designer to design intuitive and engaging user experiences.",
        skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
        qualifications: ["Design degree or equivalent"],
        certifications: ["Google UX Certification"],
        responsibilities: [
            "Create wireframes",
            "Design UI layouts",
            "Conduct user research",
            "Collaborate with devs"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 5,
        title: "DevOps Engineer",
        location: "Hyderabad",
        experience: "2 to 5 Years",
        jobType: "Full-time",
        description: "DevOps engineer to automate deployment pipelines and manage cloud infrastructure.",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        qualifications: ["B.Tech", "DevOps experience"],
        certifications: ["AWS DevOps Engineer"],
        responsibilities: [
            "Manage CI/CD pipelines",
            "Monitor systems",
            "Automate deployments",
            "Ensure scalability"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 6,
        title: "Data Analyst",
        location: "Delhi",
        experience: "1 to 3 Years",
        jobType: "Full-time",
        description: "Data analyst to interpret data and provide insights using visualization tools.",
        skills: ["SQL", "Excel", "Power BI", "Python"],
        qualifications: ["B.Sc / B.Tech"],
        certifications: ["Google Data Analytics"],
        responsibilities: [
            "Analyze datasets",
            "Create dashboards",
            "Generate reports",
            "Support business decisions"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 7,
        title: "Mobile App Developer - Android",
        location: "Pune",
        experience: "1 to 3 Years",
        jobType: "Full-time",
        description: "Android developer to build high-performance mobile applications.",
        skills: ["Kotlin", "Java", "Android SDK"],
        qualifications: ["B.Tech / MCA"],
        certifications: ["Android Developer Certification"],
        responsibilities: [
            "Develop mobile apps",
            "Fix bugs",
            "Optimize performance",
            "Publish apps"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 8,
        title: "QA Engineer",
        location: "Noida",
        experience: "1 to 2 Years",
        jobType: "Full-time",
        description: "QA engineer to test applications and ensure high product quality.",
        skills: ["Manual Testing", "Automation", "Selenium"],
        qualifications: ["B.Tech"],
        certifications: ["ISTQB Certification"],
        responsibilities: [
            "Write test cases",
            "Perform testing",
            "Report bugs",
            "Ensure quality"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 9,
        title: "Cybersecurity Analyst",
        location: "Chennai",
        experience: "2 to 4 Years",
        jobType: "Full-time",
        description: "Security analyst to monitor systems and prevent cyber threats.",
        skills: ["Network Security", "Penetration Testing", "SIEM"],
        qualifications: ["B.Tech / Security background"],
        certifications: ["CEH Certification"],
        responsibilities: [
            "Monitor threats",
            "Perform audits",
            "Implement security measures",
            "Respond to incidents"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 10,
        title: "Cloud Engineer",
        location: "Gurgaon",
        experience: "2 to 5 Years",
        jobType: "Full-time",
        description: "Cloud engineer to design and manage scalable cloud infrastructure.",
        skills: ["AWS", "Azure", "Terraform"],
        qualifications: ["B.Tech"],
        certifications: ["AWS Solutions Architect"],
        responsibilities: [
            "Deploy cloud systems",
            "Manage infrastructure",
            "Optimize costs",
            "Ensure security"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 11,
        title: "Data Analyst",
        location: "Delhi",
        experience: "1 to 3 Years",
        jobType: "Full-time",
        description: "Data analyst to interpret data and provide insights using visualization tools.",
        skills: ["SQL", "Excel", "Power BI", "Python"],
        qualifications: ["B.Sc / B.Tech"],
        certifications: ["Google Data Analytics"],
        responsibilities: [
            "Analyze datasets",
            "Create dashboards",
            "Generate reports",
            "Support business decisions"
        ],
        postedOn: "23 Mar 2026"
    },
    {
        id: 12,
        title: "Data Analyst",
        location: "Delhi",
        experience: "1 to 3 Years",
        jobType: "Full-time",
        description: "Data analyst to interpret data and provide insights using visualization tools.",
        skills: ["SQL", "Excel", "Power BI", "Python"],
        qualifications: ["B.Sc / B.Tech"],
        certifications: ["Google Data Analytics"],
        responsibilities: [
            "Analyze datasets",
            "Create dashboards",
            "Generate reports",
            "Support business decisions"
        ],
        postedOn: "23 Mar 2026"
    },
];
