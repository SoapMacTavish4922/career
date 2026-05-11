"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import BasicDetails from "@/components/registration/basicDetails";
import AddressDetails from "@/components/registration/addressDetails";
import EducationalDetails from "@/components/registration/educationalDetails";
import ExperienceDetails from "@/components/registration/experienceDetails";
import ResumeAndSkills from "@/components/registration/resumeAndSkills";
import DeclareAndSubmit from "@/components/registration/submitDetails";
import { AllFormData } from "@/lib/types/registration";
import { saveFormProgress, loadFormProgress, clearFormProgress } from "@/lib/utils/formProgress";
import { useRouter } from "next/navigation";
import { useSubmitRegistration } from "@/lib/hooks/useUser";
import { useToast } from "@/components/ui/toast";
import { ApiError } from "next/dist/server/api-utils";

const steps = [
    { id: 1, label: "Basic details" },
    { id: 2, label: "Address Details" },
    { id: 3, label: "Educational details" },
    { id: 4, label: "Experience details" },
    { id: 5, label: "Resume " }, //& Skills
    { id: 6, label: "Declare and Submit" },
];

interface Props {
    defaultValues?: AllFormData;
    isEditMode?: boolean;
    lockedEmail?: string;
    lockedName?: string;
    editableSteps?: number[];

}


export default function RegistrationLayout({ defaultValues, isEditMode = false, lockedEmail = "", lockedName = "", editableSteps, }: Props) {
    const visibleSteps = editableSteps
        ? steps.filter((s) => [...editableSteps, steps.length].includes(s.id))
        : steps;
    const [currentStep, setCurrentStep] = useState(
        editableSteps?.length ? editableSteps[0] : 1
    );
    const router = useRouter();
    const { mutate: submitRegistration, isPending: submitting } = useSubmitRegistration();
    const [formData, setFormData] = useState<AllFormData>(defaultValues ?? {});
    const [showResumePrompt, setShowResumePrompt] = useState(false);
    const [savedStep, setSavedStep] = useState(1);
    const { user } = useAuth();
    const { success, apiError } = useToast();

    // ── Resume from saved step ────────────────────────────────────────────────
    const handleResume = () => {
        const saved = loadFormProgress();
        if (saved) {
            setFormData(saved.formData);
            setCurrentStep(saved.currentStep);
        }
        setShowResumePrompt(false);
    };

    // ── Start fresh — clears saved progress ──────────────────────────────────
    const handleStartFresh = () => {
        clearFormProgress();
        setShowResumePrompt(false);
    };

    useEffect(() => {
        if (defaultValues) return;
        const saved = loadFormProgress();
        if (saved && saved.currentStep > 1) {
            setSavedStep(saved.currentStep);
            setShowResumePrompt(true);
        }
    }, []);

    // ── Save progress to localStorage on every step transition ───────────────
    const goNext = (stepData?: any) => {
        const updatedFormData = stepData
            ? { ...formData, ...stepData }
            : formData;

        setFormData(updatedFormData);
        saveFormProgress(currentStep, updatedFormData);

        if (editableSteps?.length) {
            const currentIndex = editableSteps.indexOf(currentStep);
            const nextStep = editableSteps[currentIndex + 1];
            if (nextStep) {
                setCurrentStep(nextStep);
            } else {
                setCurrentStep(steps.length);
            }
        } else {
            setCurrentStep(Math.min(currentStep + 1, steps.length));
        }
    };

    const goBack = () => {
        if (editableSteps?.length) {
            const currentIndex = editableSteps.indexOf(currentStep);
            if (currentIndex > 0) {
                setCurrentStep(editableSteps[currentIndex - 1]);
            }
        } else {
            setCurrentStep((s) => Math.max(s - 1, 1));
        }
    };
    const handleFinalSubmit = (data: AllFormData) => {
        if (isEditMode) {
            router.push("/portal/profile");
        } else {

            submitRegistration(data, {
                onSuccess: async () => {
                    clearFormProgress();
                    router.refresh();
                    router.push("/portal/search-jobs");
                },
                onError: (error) => apiError(error, "Failed to submit. Please try again."),
            });
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <BasicDetails onNext={goNext} defaultValues={formData} lockedEmail={user?.email ?? ""} lockedName={user?.name ?? ""} />;
            case 2: return <AddressDetails onNext={goNext} onBack={goBack} defaultValues={formData} />;
            case 3: return <EducationalDetails onNext={goNext} onBack={goBack} defaultValues={formData} isEditMode={isEditMode} />;
            case 4: return <ExperienceDetails onNext={goNext} onBack={goBack} defaultValues={formData} isEditMode={isEditMode} />;
            case 5: return <ResumeAndSkills onNext={goNext} onBack={goBack} defaultValues={formData} isEditMode={isEditMode} />;
            case 6: return (
                <DeclareAndSubmit
                    formData={formData}
                    onBack={goBack}
                    onSubmit={handleFinalSubmit}
                    isLoading={submitting}
                    isEditMode={isEditMode}
                />
            );

            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row overflow-hidden">

            {/* ── Resume Modal ── */}
            {showResumePrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full flex flex-col gap-4">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Resume your application?</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                You have an unfinished application saved at step {savedStep}.
                                Continue from where you left off?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleStartFresh}
                                className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Start Fresh
                            </button>
                            <button
                                onClick={handleResume}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                            >
                                Resume
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Mobile: Horizontal Stepper (top) ── */}
            <div className="lg:hidden bg-white border-b border-gray-100 px-3 py-3 sticky top-0 z-10 shadow-sm -mx-4 -mt-4 mb-4">
                <div className="flex items-center w-full">
                    {visibleSteps.map(({ id, label }, index) => {
                        const isActive = currentStep === id;
                        const isCompleted = currentStep > id;
                        const isLast = index === visibleSteps.length - 1;

                        return (
                            <div key={id} className="flex items-center flex-1 min-w-0">
                                <div className="flex flex-col items-center gap-1 min-w-0 shrink-0">
                                    {isActive ? (
                                        <div className="h-6 w-6 rounded-full bg-white border-2 border-emerald-700 flex items-center justify-center shadow-[0_0_8px_3px_rgba(5,150,105,0.6)]">
                                            <span className="text-[9px] font-bold text-emerald-700">{id}</span>
                                        </div>
                                    ) : isCompleted ? (
                                        <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                                            <span className="text-[9px] text-gray-400">{id}</span>
                                        </div>
                                    )}
                                    <span className={`text-[8px] text-center leading-tight max-w-[40px] truncate
                            ${isActive ? "text-emerald-700 font-bold" : isCompleted ? "text-gray-500" : "text-gray-300"}`}>
                                        {label.split(" ")[0]}
                                    </span>
                                </div>
                                {!isLast && (
                                    <div className={`h-[2px] flex-1 rounded-full mx-1 mb-4 ${isCompleted ? "bg-emerald-500" : "bg-gray-200"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Desktop: Vertical Sidebar (left) ── */}
            <aside className="hidden lg:flex w-64 bg-white flex-col justify-center py-10 px-6 shrink-0">
                {visibleSteps.map(({ id, label }, index) => {
                    const isActive = currentStep === id;
                    const isCompleted = currentStep > id;
                    const isLast = index === visibleSteps.length - 1;

                    return (
                        <div key={id} className="flex flex-col">
                            <div className="flex items-center gap-4">
                                <div className="w-10 flex items-center justify-center shrink-0">
                                    {isActive ? (
                                        <div className="relative flex items-center justify-center z-10">
                                            <div className="h-9 w-9 rounded-full bg-white border-2 border-emerald-700 flex items-center justify-center shadow-[0_0_12px_4px_rgba(5,150,105,0.8)]">
                                                <div className="h-4 w-4 rounded-full bg-emerald-600" />
                                            </div>
                                        </div>
                                    ) : isCompleted ? (
                                        <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center">
                                            <div className="h-4 w-4 rounded-full bg-white" />
                                        </div>
                                    ) : (
                                        <div className="h-9 w-9 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                                            <div className="h-3 w-3 rounded-full bg-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <span className={`text-sm ${isActive
                                    ? "text-emerald-700 font-semibold"
                                    : isCompleted ? "text-gray-700"
                                        : "text-gray-400"}`}>
                                    {label}
                                </span>
                            </div>
                            {!isLast && (
                                <div className="flex">
                                    <div className="w-10 flex justify-center">
                                        <div className={`w-0.5 h-10 mt-1 mb-1 ${isCompleted ? "bg-emerald-600" : "bg-gray-200"}`} />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 flex justify-center items-start bg-gray-100 lg:rounded-3xl lg:overflow-hidden lg:my-3 lg:mr-3 overflow-hidden">
                <main className="w-full lg:max-w-3xl bg-white lg:rounded-2xl shadow-md p-4 lg:p-10 lg:my-6 min-h-screen lg:min-h-0 overflow-hidden">
                    {renderStep()}
                </main>
            </div>
        </div>
    );
}