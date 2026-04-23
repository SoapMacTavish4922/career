import api from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Job } from "@/lib/types/job";

interface JobFilters {
    keyword?: string;
    location?: string;
    jobType?: string;
    experience?: string;
    page?: number;
}

export const jobsService = {

    // ── Get all jobs with optional filters ────────────────────────────────────
    // Called on search jobs page
    // Laravel returns paginated list { data: Job[], meta: { total, per_page, current_page } }

    getAll: async (filters?: JobFilters): Promise<{ data: Job[]; meta: any }> => {
        const res = await api.get(ENDPOINTS.jobs.list, { params: filters });
        return res.data;
    },

    // ── Get single job by slug ────────────────────────────────────────────────
    // Called on job detail page [slug]

    getBySlug: async (slug: string): Promise<Job> => {
        const res = await api.get(ENDPOINTS.jobs.detail(slug));
        return res.data;
    },

    // ── Apply for a job ───────────────────────────────────────────────────────
    // Called on apply page submit button
    // jobId comes from the job object

    apply: async (jobId: number) => {
        const res = await api.post(ENDPOINTS.jobs.apply(jobId));
        return res.data;
    },

    // ── Get applied jobs ──────────────────────────────────────────────────────
    // Called on applied jobs page

    getApplied: async (): Promise<{ data: Job[] }> => {
        const res = await api.get(ENDPOINTS.jobs.applied);
        return res.data;
    },

    // ── Get interview schedule ────────────────────────────────────────────────
    // Called on interview schedule page

    getInterviews: async () => {
        const res = await api.get(ENDPOINTS.jobs.interviewSchedule);
        return res.data;
    },
};