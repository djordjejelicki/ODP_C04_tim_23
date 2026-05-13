export const formatDate = (date: string | null): string => {
    if (!date) {
        return "N/A";
    }

    return String(date).replace("T", " ").slice(0, 16);
};