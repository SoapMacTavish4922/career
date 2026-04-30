export interface AddressBlock {
    line1: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
}

export interface EducationBlock {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    resultType: "cgpa" | "percentage" | "";
    gpa: string;
    otherDegree?: string;
    yearOfPassing: string;
    mode:          string;
}

export interface ExperienceBlock {
    id: string;
    experienceType: string;
    title: string;
    designation?: string;
    company: string;
    location: string;
    from: string;
    to: string;
    isCurrentJob?: boolean;
    currentctc: string;
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
    name?: string;
    fatherName?:  string;   // ← add
    motherName?:  string;
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