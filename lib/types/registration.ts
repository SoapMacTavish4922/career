export interface AddressBlock {
    line1: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
}

export interface EducationBlock {
    school: string;
    degree: string;
    fieldOfStudy: string;
    resultType: "cgpa" | "percentage" | "";
    gpa: string;
    from: string;
    to: string;
    otherDegree?: string;
}

export interface ExperienceBlock {
    experienceType: string;
    title: string;
    company: string;
    location: string;
    from: string;
    to: string;
    current: string;
    notice: string;
}

export interface CertificationBlock {
    certification: string;
    institute: string;
    accreditedWith: string;
    yearOfPassing: string;
    marks: string;
    certificateFile: File | null;
}

export interface AllFormData {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    altEmail?: string;
    phone?: string;
    altPhone?: string;
    gender?: string;
    dob?: string;
    permanentAddress?: AddressBlock;
    currentAddress?: AddressBlock;
    sameAsPermanent?: boolean;
    education?: EducationBlock[];
    experience?: ExperienceBlock[];
    certifications?: CertificationBlock[];
}