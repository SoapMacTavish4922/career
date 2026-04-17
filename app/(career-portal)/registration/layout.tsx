"use client";

import { useState } from "react";
import BasicDetails from "@/components/registration/basicDetails";
import AddressDetails from "@/components/registration/addressDetails";
import EducationalDetails from "@/components/registration/educationalDetails";
import ExperienceDetails from "@/components/registration/experienceDetails";
//import CertificationDetails from "@/components/registration/certificationDetails";
import DeclareAndSubmit from "@/components/registration/submitDetails";
import { AllFormData } from "@/lib/types/registration";
    


const steps = [
    { id: 1, label: "Basic details" },
    { id: 2, label: "Address Details" },
    { id: 3, label: "Educational details" },
    { id: 4, label: "Experience details" },
    // { id: 5, label: "Certification" },
    { id: 5, label: "Declare and Submit" },
];
interface Props {
    defaultValues?: AllFormData; // pass pre-fetched DB data here
}

export default function RegistrationLayout({ defaultValues }: Props) {
    const [currentStep, setCurrentStep] = useState(1);

    // ── Shared form data across all steps ──
    const [formData, setFormData] = useState<AllFormData>(defaultValues ?? {});

    const goNext = (stepData?: any) => {
        if (stepData) setFormData((prev: any) => ({ ...prev, ...stepData }));
        setCurrentStep((s) => Math.min(s + 1, steps.length));
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
            // case 5: return <CertificationDetails onNext={goNext} onBack={goBack} defaultValues={formData} />;
            case 5: return <DeclareAndSubmit formData={formData} onBack={goBack} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* ── Sidebar ── */}
            <aside className="w-64 bg-white flex flex-col justify-center py-10 px-6">
                {steps.map(({ id, label }, index) => {
                    const isActive = currentStep === id;
                    const isCompleted = currentStep > id;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={id} className="flex flex-col">

                            {/* Circle + Label */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 flex items-center justify-center flex-shrink-0">
                                    {isActive ? (
                                        <div className="relative flex items-center justify-center">
                                            <div className="absolute w-14 h-14 rounded-full bg-emerald-500 opacity-30 blur-2xl" />
                                            <div className="h-9 w-9 rounded-full bg-white border-2 border-emerald-700 flex items-center justify-center z-10">
                                                <div className="h-4 w-4 rounded-full bg-emerald-600" />
                                            </div>
                                        </div>
                                    ) : isCompleted ? (
                                        <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center">
                                            {/* Checkmark for completed */}
                                            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="h-9 w-9 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                                            <div className="h-3 w-3 rounded-full bg-gray-300" />
                                        </div>
                                    )}
                                </div>

                                <span className={`text-sm ${isActive
                                    ? "text-emerald-700 font-semibold"
                                    : isCompleted
                                        ? "text-gray-700"
                                        : "text-gray-400"
                                    }`}>
                                    {label}
                                </span>
                            </div>

                            {/* Connector line */}
                            {!isLast && (
                                <div className="flex">
                                    <div className="w-10 flex justify-center">
                                        <div className={`w-[2px] h-10 ${isCompleted ? "bg-emerald-600" : "bg-gray-300"}`} />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 flex justify-center items-start py-10 px-4">
                <main className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-10">
                    {renderStep()}
                </main>
            </div>
        </div>
    );
}