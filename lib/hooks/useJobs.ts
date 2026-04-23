import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/lib/services/jobs.services";

export const jobKeys = {
    all: ["jobs"] as const,
    list: (filters: any) => ["jobs", "list", filters] as const,
    detail: (slug: string) => ["jobs", "detail", slug] as const,
    applied: ["jobs", "applied"] as const,
    interviews: ["jobs", "interviews"] as const,
};

// Search jobs page
export function useJobs(filters?: any) {
    return useQuery({
        queryKey: jobKeys.list(filters),
        queryFn: () => jobsService.getAll(filters),
    });
}

// Job detail page
export function useJob(slug: string) {
    return useQuery({
        queryKey: jobKeys.detail(slug),
        queryFn: () => jobsService.getBySlug(slug),
        enabled: !!slug,
    });
}

// Applied jobs page
export function useAppliedJobs() {
    return useQuery({
        queryKey: jobKeys.applied,
        queryFn: jobsService.getApplied,
    });
}

// Interview schedule page
export function useInterviews() {
    return useQuery({
        queryKey: jobKeys.interviews,
        queryFn: jobsService.getInterviews,
    });
}

// Apply for job — after success, refresh applied jobs cache
export function useApplyJob() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (jobId: number) => jobsService.apply(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: jobKeys.applied });
        },
    });
}