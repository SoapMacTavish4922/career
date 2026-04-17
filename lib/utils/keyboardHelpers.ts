export const allowOnlyLetters = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
        !/^[a-zA-Z\s]$/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) e.preventDefault();
};

export const allowOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
        !/^\d$/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Enter", "Home", "End"].includes(e.key)
    ) e.preventDefault();
};

export const allowDecimal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
        !/[\d.]$/.test(e.key) &&
        !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) e.preventDefault();
};