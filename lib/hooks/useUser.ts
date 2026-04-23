import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/lib/services/user.services";
import { useAuth } from "@/lib/context/AuthContext";
import Cookies from "js-cookie";

export const userKeys = {
    profile: ["user", "profile"] as const,
};

// Edit details page — pre-fill registration form
export function useProfile() {
    return useQuery({
        queryKey: userKeys.profile,
        queryFn: userService.getProfile,
    });
}

// Edit details submit
export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile });
        },
    });
}

// Profile page photo upload — also updates avatar in topbar instantly
export function useUpdatePhoto() {
    const queryClient = useQueryClient();
    const { setUser, user } = useAuth();
    return useMutation({
        mutationFn: userService.updatePhoto,
        onSuccess: (data) => {
            if (user) {
                const updatedUser = { ...user, profilePhoto: data.photo_url };
                setUser(updatedUser);
                Cookies.set("user_info", JSON.stringify(updatedUser), {
                    expires: 7,
                    sameSite: "Lax",
                    secure: process.env.NODE_ENV === "production",
                });
            }
            queryClient.invalidateQueries({ queryKey: userKeys.profile });
        },
    });
}

// Profile page password change
export function useUpdatePassword() {
    return useMutation({
        mutationFn: userService.updatePassword,
    });
}

// First time registration submit — marks profile as complete
export function useSubmitRegistration() {
    const { user, setUser } = useAuth();
    return useMutation({
        mutationFn: userService.submitRegistration,
        onSuccess: () => {
            if (user) {
                const updatedUser = { ...user, is_profile_complete: true };
                setUser(updatedUser);
                Cookies.set("user_info", JSON.stringify(updatedUser), {
                    expires: 7,
                    sameSite: "Lax",
                    secure: process.env.NODE_ENV === "production",
                });
            }
        },
    });
}

// Edit details update — for returning users editing existing profile
export function useUpdateRegistration() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.updateRegistration,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.profile });
        },
    });
}