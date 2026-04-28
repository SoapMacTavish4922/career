import api from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const userService = {

    // ── Get full profile ──────────────────────────────────────────────────────
    getProfile: async () => {
        const res = await api.get(ENDPOINTS.user.profile);
        const data = res.data;

        return {
            firstName: data.firstName ?? data.first_name,
            middleName: data.middleName ?? data.middle_name ?? "",
            lastName: data.lastName ?? data.last_name,
            email: data.email,
            phone: data.phone,
            altPhone: data.altPhone ?? data.alternate_mobile ?? "",
            gender: data.gender,
            dob: data.dob ?? data.date_of_birth,
            education: data.education?.map((edu: any) => ({
                school: edu.school ?? edu.institution,
                degree: edu.degree ?? edu.level,
                fieldOfStudy: edu.fieldOfStudy ?? edu.course,
                resultType: edu.resultType ?? edu.score_type,
                gpa: edu.gpa ?? edu.score,
                from: edu.from,
                to: edu.to,
            })),
            experience: data.experience?.map((exp: any) => ({
                experienceType: exp.experienceType ?? exp.experience_type,
                title: exp.title ?? exp.job_title,
                company: exp.company ?? exp.company_name,
                location: exp.location,
                from: exp.from ?? exp.start,
                to: exp.to ?? exp.end,
                current: exp.current,
                notice: exp.notice ?? exp.notice_period,
                isCurrentJob: exp.isCurrentJob ?? exp.is_current,
            })),
            currentAddress: data.currentAddress ?? data.current_address,
            permanentAddress: data.permanentAddress ?? data.permanent_address,
        };
    },

    // ── Update profile ────────────────────────────────────────────────────────
    updateProfile: async (data: any) => {
        const res = await api.patch(ENDPOINTS.user.update, data);
        return res.data;
    },

    // ── Update profile photo ──────────────────────────────────────────────────
    updatePhoto: async (file: File) => {
        const formData = new FormData();
        formData.append("profile_photo", file);
        const res = await api.post(ENDPOINTS.user.photo, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    // ── Update password ───────────────────────────────────────────────────────
    updatePassword: async (data: {
        current_password: string;
        password: string;
        password_confirmation: string;
    }) => {
        const res = await api.patch(ENDPOINTS.user.password, data);
        return res.data;
    },

    // ── Submit registration form ──────────────────────────────────────────────
    // Called from DeclareAndSubmit on first time registration
    // 3 sequential API calls — if any fails, the rest are skipped
    submitRegistration: async (data: any) => {

        // ── Call 1: Basic Details + Address ──────────────────────────────────
        try {
            const formData = new FormData();

            if (data.profilePhoto instanceof File) {
                formData.append("profile_path", data.profilePhoto);
            }

            formData.append("phone", data.phone);
            formData.append("alternate_mobile", data.altPhone ?? "");
            formData.append("gender", data.gender);
            formData.append("dob", data.dob);
            // formData.append("current_address", JSON.stringify(data.currentAddress));
            // formData.append("permanent_address", JSON.stringify(data.permanentAddress));
            formData.append("current_address[address]", data.currentAddress?.line1 ?? "");
            formData.append("current_address[city]", data.currentAddress?.city ?? "");
            formData.append("current_address[state]", data.currentAddress?.state ?? "");
            formData.append("current_address[country]", data.currentAddress?.country ?? "");
            formData.append("current_address[pincode]", data.currentAddress?.pinCode ?? "");

            formData.append("permanent_address[address]", data.permanentAddress?.line1 ?? "");
            formData.append("permanent_address[city]", data.permanentAddress?.city ?? "");
            formData.append("permanent_address[state]", data.permanentAddress?.state ?? "");
            formData.append("permanent_address[country]", data.permanentAddress?.country ?? "");
            formData.append("permanent_address[pincode]", data.permanentAddress?.pinCode ?? "");

            await api.post(ENDPOINTS.registration.basicDetails, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(" Basic details saved");

        } catch (error: any) {
            console.error(" Basic details failed:", error?.response?.data);
            throw new Error("Failed to save basic details. Please try again.");
        }

        // ── Call 2: Education ─────────────────────────────────────────────────
        try {
            await api.post(ENDPOINTS.registration.education, {
                education: data.education?.map((edu: any) => ({
                    institution: edu.school,
                    level: edu.degree,
                    course: edu.fieldOfStudy,
                    score_type: edu.resultType,
                    score: edu.gpa,
                })),
            });
            console.log(" Education saved");

        } catch (error: any) {
            console.error(" Education failed:", error?.response?.data);
            throw new Error("Failed to save education details. Please try again.");
        }

        // ── Call 3: Experience ────────────────────────────────────────────────
        try {
            const noticeToInt = (notice: string): number => {
                if (notice === "Immediate Joiner") return 0;
                if (notice === "90+") return 91;
                return parseInt(notice) || 0;
            };

            await api.post(ENDPOINTS.registration.experience, {
                employment: data.experience?.map((exp: any) => {
                    if (exp.experienceType === "fresher") {
                        return { experience_type: "fresher" };
                    }
                    return {
                        experience_type: exp.experienceType,
                        job_title: exp.title,
                        designation: exp.designation ?? "",
                        company_name: exp.company,
                        location: exp.location,
                        start_date: exp.from,
                        end_date: exp.to ?? "",
                        notice_period: exp.isCurrentJob ? noticeToInt(exp.notice) : 0,
                        is_current: exp.isCurrentJob ?? false,
                    };
                }),
            });
            console.log("✅ Experience saved");

        } catch (error: any) {
            console.error("❌ Experience failed:", error?.response?.data);
            throw new Error("Failed to save experience details. Please try again.");
        }
    },

    // ── Update registration ───────────────────────────────────────────────────
    // Called from DeclareAndSubmit on edit-details flow
    updateRegistration: async (data: any) => {
        const res = await api.patch(ENDPOINTS.registration.update, data);
        return res.data;
    },
};