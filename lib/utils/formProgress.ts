// lib/utils/formProgress.ts
// Saves and restores registration form progress using localStorage
// localStorage is the right choice here because:
// - Cookies have 4KB size limit — form data is larger
// - sessionStorage clears on tab close — we need data to persist across login
// - localStorage survives page refresh and tab close — perfect for this use case

const STORAGE_KEY = "registration_progress";
const MAX_AGE_HOURS = 24; // discard if older than 24 hours

interface ProgressData {
    currentStep: number;
    formData: any;
    savedAt: number; // timestamp ms
}

// ── Save progress on every step ───────────────────────────────────────────────
export function saveFormProgress(step: number, formData: any): void {
    try {
        const data: ProgressData = {
            currentStep: step,
            formData,
            savedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // localStorage might be full or unavailable — fail silently
        console.warn("Could not save form progress to localStorage.");
    }
}

// ── Load progress — returns null if not found or expired ──────────────────────
export function loadFormProgress(): ProgressData | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const data: ProgressData = JSON.parse(raw);

        // Discard if older than MAX_AGE_HOURS
        const maxAge = MAX_AGE_HOURS * 60 * 60 * 1000;
        if (Date.now() - data.savedAt > maxAge) {
            clearFormProgress();
            return null;
        }

        return data;
    } catch {
        return null;
    }
}

// ── Clear progress — called after successful submission ───────────────────────
export function clearFormProgress(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // fail silently
    }
}

export function hasFormProgress(): boolean {
    return !!loadFormProgress();
}