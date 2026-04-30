"use client";

import { useProfile } from "@/lib/hooks/useUser";
import { useAuth } from "@/lib/context/AuthContext";
import RegistrationLayout from "@/app/(career-portal)/registration/layout";

export default function EditDetailsPage() {

    const { user: authUser } = useAuth();
    const { data: profile, isLoading, isError } = useProfile();

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-sm text-gray-500">Loading your details...</p>
        </div>
    );

    if (isError) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-sm text-red-500">Failed to load details. Please refresh.</p>
        </div>
    );

    // ── Map profile response to AllFormData shape ─────────────────────────────
    // name + email come from AuthContext (set at login, always reliable)
    // photo_url — prefer AuthContext.profilePhoto (already fetched at login)
    //             fall back to profile API response
    // Basic details and address are locked — user cannot change them
    // Only education and experience are editable
    const defaultValues = {

        // ── Locked — from AuthContext ──────────────────────────────────────────
        name: authUser?.name ?? (profile as any)?.name ?? "",
        email: authUser?.email ?? (profile as any)?.email ?? "",

        // ── Photo — prefer AuthContext, fall back to profile API ──────────────
        photo_url: authUser?.profilePhoto
            ?? (profile as any)?.photo_url
            ?? "",

        // ── Locked — from profile API ─────────────────────────────────────────
        fatherName: (profile as any)?.fatherName ?? "",
        motherName: (profile as any)?.motherName ?? "",
        altEmail: (profile as any)?.altEmail ?? "",
        phone: (profile as any)?.phone ?? "",
        altPhone: (profile as any)?.altPhone ?? "",
        gender: (profile as any)?.gender ?? "",
        dob: (profile as any)?.dob ?? "",

        currentAddress: (profile as any)?.currentAddress ?? {
            line1: "", city: "", state: "", country: "", pinCode: "",
        },
        permanentAddress: (profile as any)?.permanentAddress ?? {
            line1: "", city: "", state: "", country: "", pinCode: "",
        },
        sameAsPermanent: (profile as any)?.sameAsPermanent ?? false,

        // ── Editable ──────────────────────────────────────────────────────────
        education: (profile as any)?.education ?? [],
        experience: (profile as any)?.experience ?? [],
        certifications: (profile as any)?.certifications ?? [],
    };

    return (
        <RegistrationLayout
            defaultValues={defaultValues}
            isEditMode={true}
            lockedEmail={authUser?.email ?? (profile as any)?.email ?? ""}
            lockedName={authUser?.name ?? (profile as any)?.name ?? ""}
            editableSteps={[3, 4]}
        />
    );
}