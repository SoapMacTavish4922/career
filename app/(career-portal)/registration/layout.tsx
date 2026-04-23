"use client";

import { useState, useEffect } from "react";
import BasicDetails from "@/components/registration/basicDetails";
import AddressDetails from "@/components/registration/addressDetails";
import EducationalDetails from "@/components/registration/educationalDetails";
import ExperienceDetails from "@/components/registration/experienceDetails";
import DeclareAndSubmit from "@/components/registration/submitDetails";
import { AllFormData } from "@/lib/types/registration";
import { saveFormProgress, loadFormProgress, clearFormProgress } from "@/lib/utils/formProgress";

const steps = [
    { id: 1, label: "Basic details" },
    { id: 2, label: "Address Details" },
    { id: 3, label: "Educational details" },
    { id: 4, label: "Experience details" },
    { id: 5, label: "Declare and Submit" },
];

interface Props {
    defaultValues?: AllFormData;
}

export default function RegistrationLayout({ defaultValues }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<AllFormData>(defaultValues ?? {});
    const [showResumePrompt, setShowResumePrompt] = useState(false);
    const [savedStep, setSavedStep] = useState(1);

    // ── On mount: check localStorage for saved progress ───────────────────────
    // Skip in edit mode (defaultValues passed from edit-details page)
    useEffect(() => {
        if (defaultValues) return;
        const saved = loadFormProgress();
        if (saved && saved.currentStep > 1) {
            setSavedStep(saved.currentStep);
            setShowResumePrompt(true);
        }
    }, []);

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

    // ── Save progress to localStorage on every step transition ───────────────
    const goNext = (stepData?: any) => {
        const updatedFormData = stepData
            ? { ...formData, ...stepData }
            : formData;

        setFormData(updatedFormData);
        const nextStep = Math.min(currentStep + 1, steps.length);
        setCurrentStep(nextStep);

        // Persist to localStorage so session expiry doesn't lose progress
        saveFormProgress(nextStep, updatedFormData);
    };

    const goBack = () => {
        setCurrentStep((s) => Math.max(s - 1, 1));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <BasicDetails onNext={goNext} defaultValues={formData} />;
            case 2: return <AddressDetails onNext={goNext} onBack={goBack} defaultValues={formData} />;
            case 3: return <EducationalDetails onNext={goNext} onBack={goBack} defaultValues={formData} />;
            case 4: return <ExperienceDetails onNext={goNext} onBack={goBack} defaultValues={formData} />;
            case 5: return <DeclareAndSubmit formData={formData} onBack={goBack} />;
            // Note: call clearFormProgress() inside DeclareAndSubmit after successful API submission
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">

            {/* ── Resume Prompt Modal ── */}
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
            <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between">
                    {steps.map(({ id, label }, index) => {
                        const isActive = currentStep === id;
                        const isCompleted = currentStep > id;
                        const isLast = index === steps.length - 1;

                        return (
                            <div key={id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center gap-1 flex-1">
                                    <div className="flex items-center justify-center">
                                        {isActive ? (
                                            <div className="h-7 w-7 rounded-full bg-white border-2 border-emerald-700 flex items-center justify-center shadow-[0_0_8px_3px_rgba(5,150,105,0.6)]">
                                                <div className="h-3 w-3 rounded-full bg-emerald-600" />
                                            </div>
                                        ) : isCompleted ? (
                                            <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center">
                                                <div className="h-4 w-4 rounded-full bg-white" />
                                            </div>
                                        ) : (
                                            <div className="h-7 w-7 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                                                <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-[9px] text-center leading-tight w-14 break-words
                                        ${isActive ? "text-emerald-700 font-bold" : isCompleted ? "text-gray-500" : "text-gray-300"}`}>
                                        {label}
                                    </span>
                                </div>
                                {!isLast && (
                                    <div className={`h-[2px] flex-1 mb-4 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-gray-200"}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Desktop: Vertical Sidebar (left) ── */}
            <aside className="hidden lg:flex w-64 bg-white flex-col justify-center py-10 px-6 shrink-0">
                {steps.map(({ id, label }, index) => {
                    const isActive = currentStep === id;
                    const isCompleted = currentStep > id;
                    const isLast = index === steps.length - 1;

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
                                        <div className={`w-[2px] h-10 mt-1 ${isCompleted ? "bg-emerald-600" : "bg-gray-200"}`} />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 flex justify-center items-start bg-gray-100 lg:rounded-3xl lg:overflow-hidden lg:my-3 lg:mr-3">
                <main className="w-full lg:max-w-3xl bg-white lg:rounded-2xl shadow-md p-6 lg:p-10 lg:my-6 min-h-screen lg:min-h-0">
                    {renderStep()}
                </main>
            </div>
        </div>
    );
}