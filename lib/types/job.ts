

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

export interface AppliedJob extends Job {
    status: "In progress" | "Accepted" | "Rejected";
}