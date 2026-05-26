const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api/v1/", "");

export const getAvatarUrl = (avatarUrl: string | null): string => {
    if (!avatarUrl){
        return `${API_BASE_URL}/uploads/avatars/default-avatar.png`;
    }

    return `${API_BASE_URL}${avatarUrl}`;
};