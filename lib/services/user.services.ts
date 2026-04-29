import api from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

export const userService = {

    // ── Get full profile ──────────────────────────────────────────────────────
    getProfile: async () => {
        const res = await api.get(ENDPOINTS.user.profile);
        const raw = res.data.data;
        console.log("data", res);
        

        return {
            photo_url: raw.photo_url ?? undefined,
            name: raw.basic?.name ?? "",
            fatherName: raw.basic?.father_name ?? "",
            motherName: raw.basic?.mother_name ?? "",
            email: raw.basic?.email ?? "",
            alternate_mobile: raw.basic?.alternate_mobile ?? "",
            phone: raw.basic?.phone ?? "",
            altPhone: raw.basic?.alternate_mobile ?? "",
            gender: raw.basic?.gender ?? "",
            dob: raw.basic?.dob ?? "",

            // ← flat address fields from Laravel
            currentAddress: {
                line1: raw.basic?.current_address ?? "",
                city: raw.basic?.current_city ?? "",
                state: raw.basic?.current_state ?? "",
                country: raw.basic?.current_country ?? "",
                pinCode: raw.basic?.current_pincode ?? "",
            },
            permanentAddress: {
                line1: raw.basic?.permanent_address ?? "",
                city: raw.basic?.permanent_city ?? "",
                state: raw.basic?.permanent_state ?? "",
                country: raw.basic?.permanent_country ?? "",
                pinCode: raw.basic?.permanent_pincode ?? "",
            },

            education: raw.educations?.map((edu: any) => ({
                school: edu.institution ?? "",
                degree: edu.level ?? "",
                fieldOfStudy: edu.course ?? "",
                resultType: edu.score_type ?? "",
                gpa: edu.score ?? "",
                yearOfPassing: edu.year_of_passing ?? "",
                mode: edu.mode ?? "",
            })),

            experience: raw.employments?.map((exp: any) => ({
                experienceType: exp.experience_type ?? "",
                title: exp.job_title ?? "",
                designation: exp.designation ?? "",
                company: exp.company_name ?? "",
                location: exp.location ?? "",
                from: exp.start_date ?? "",
                to: exp.end_date ?? "",
                currentctc: exp.current_ctc ?? "",
                notice: exp.notice_period ?? "",
                isCurrentJob: exp.is_current ?? false,
            })),
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

            formData.append("father_name", data.fatherName ?? "");
            formData.append("mother_name", data.motherName ?? "");
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
                    year_of_passing: edu.yearOfPassing,
                    mode: edu.mode,
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
                        current_ctc: exp.currentctc ?? "",
                        is_current: exp.isCurrentJob ?? false,
                    };
                }),
            });
            console.log("Experience saved");

        } catch (error: any) {
            console.error("Experience failed:", error?.response?.data);
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