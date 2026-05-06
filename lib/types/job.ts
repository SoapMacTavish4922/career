export interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    department: string;
    job_type: string;
    experience_required: number;
    salary_min: string;
    salary_max: string;
    is_active: number;
    created_at: string;
    skills: string[];
    qualifications: string[];
    responsibilities: string[];
    certifications: string[];
}

export interface AppliedJob {
    id: string;
    user_id: string;
    job_post_id: string;
    status: string;
    applied_at: string;
    job: {
        id: string;
        title: string;
        description: string;
        location: string;
        department: string;
    };
}