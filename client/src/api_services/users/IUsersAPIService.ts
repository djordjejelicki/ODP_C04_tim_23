import type { UserDto } from "../../types/users/UserDto";
import type { UserRole } from "../../types/users/UserRole";
import type { PublicUser } from "../../types/users/PublicUser";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IUsersAPIService {
    getAll(): Promise<UserDto[]>;
    updateRole(id: number, role: UserRole): Promise<ApiResponse>;
    getMe(): Promise<UserDto | null>;
    searchPublic(query: string): Promise<PublicUser[]>;
    getPublicById(id: number): Promise<PublicUser | null>;
    updateProfile(
        username: string,
        email: string,
        first_name: string,
        last_name: string,
        bio: string | null,
        avatar: File | null
    ): Promise<ApiResponse>;
    changePassword(
        currentPassword: string,
        newPassword: string
    ): Promise<ApiResponse>;
}