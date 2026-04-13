import RegistrationLayout from "@/app/(career-portal)/registration/layout";

const dummyUser = {
    firstName: "Raj",
    middleName: "Kumar",
    lastName: "Sharma",
    email: "raj.sharma@gmail.com",
    altEmail: "raj123@gmail.com",
    phone: "9876543210",
    altPhone: "9123456780",
    gender: "Male",
    dob: "1998-08-15",

    permanentAddress: {
        line1: "12, Green Park Colony",
        line2: "Near City Mall",
        line3: "Sector 5",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pinCode: "400001",
    },
    currentAddress: {
        line1: "45, Andheri West",
        line2: "Lokhandwala Complex",
        line3: "",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pinCode: "400053",
    },
    sameAsPermanent: false,

    education: [
        {
            school: "St. Xavier's College",
            degree: "bachelors",
            fieldOfStudy: "Computer Science",
            resultType: "cgpa",
            gpa: "8.5",
            from: "2016-07",
            to: "2020-05",
        },
        {
            school: "Delhi Public School",
            degree: "12th",
            fieldOfStudy: "Science",
            resultType: "percentage",
            gpa: "88",
            from: "2014-06",
            to: "2016-03",
        },
    ],

    experience: [
        {
            experienceType: "experienced",
            title: "Frontend Developer",
            company: "TechCorp Solutions",
            location: "Mumbai",
            from: "2020-07",
            to: "2023-12",
            current: "800000",
            notice: "30",
        },
    ],

    certifications: [
        {
            certification: "Cloud Computing",
            institute: "NPTEL",
            accreditedWith: "NAAC",
            yearOfPassing: "2021",
            marks: "85",
            certificateFile: null,
        },
    ],
};

export default function EditDetailsPage() {
    const defaultValues = {
        firstName: dummyUser.firstName,
        middleName: dummyUser.middleName,
        lastName: dummyUser.lastName,
        email: dummyUser.email,
        altEmail: dummyUser.altEmail,
        phone: dummyUser.phone,
        altPhone: dummyUser.altPhone,
        gender: dummyUser.gender,
        dob: dummyUser.dob,
        permanentAddress: dummyUser.permanentAddress,
        currentAddress: dummyUser.currentAddress,
        sameAsPermanent: dummyUser.sameAsPermanent,
        education: dummyUser.education,
        experience: dummyUser.experience,
        certifications: dummyUser.certifications,
    };

    return <RegistrationLayout defaultValues={defaultValues} />;
}