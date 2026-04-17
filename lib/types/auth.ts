export type AuthStep = "email" | "otp" | "password" | "success" ;
export type SignupStep = "details" | "otp" | "password" | "success";

export type SignupFormState = {
    userName: string;
    email: string;
    otp: string[];
    password: string;
    confirmPassword: string;
};

export type ForgotPasswordFormState = {
    email: string;
    otp: string[];
    password: string;
    confirmPassword: string;
};

export type AuthErrors = {
    email?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
    userName?: string;
    details?: string;
};