const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api/v1/", "");

export const getImageUrl = (imageUrl: string): string => {
    return `${API_BASE_URL}${imageUrl}`;
};