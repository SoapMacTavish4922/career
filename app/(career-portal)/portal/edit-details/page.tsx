"use client";

import { useProfile } from "@/lib/hooks/useUser";
import RegistrationLayout from "@/app/(career-portal)/registration/layout";

export default function EditDetailsPage() {

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

    // Map API response to form shape
    // Update field names to match exactly what Laravel returns
    const defaultValues = {
        firstName: profile?.firstName ?? "",
        middleName: profile?.middleName ?? "",
        lastName: profile?.lastName ?? "",
        email: profile?.email ?? "",
        altEmail: profile?.altEmail ?? "",
        phone: profile?.phone ?? "",
        altPhone: profile?.altPhone ?? "",
        gender: profile?.gender ?? "",
        dob: profile?.dob ?? "",
        permanentAddress: profile?.permanentAddress ?? {
            line1: "", line2: "", line3: "", city: "", state: "", country: "", pinCode: "",
        },
        currentAddress: profile?.currentAddress ?? {
            line1: "", line2: "", line3: "", city: "", state: "", country: "", pinCode: "",
        },
        sameAsPermanent: profile?.sameAsPermanent ?? false,
        education: profile?.education ?? [],
        experience: profile?.experience ?? [],
        certifications: profile?.certifications ?? [],
    };

    return <RegistrationLayout defaultValues={defaultValues} isEditMode={true} />;
}