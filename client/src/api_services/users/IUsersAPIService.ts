import type { UserDto, UserRole } from "../../types/users/UserDto";
import type { PublicUser } from "../../types/users/PublicUser";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IUsersAPIService {
    getAll(): Promise<UserDto[]>;
    updateRole(id: number, role: UserRole): Promise<ApiResponse>;
    getMe(): Promise<UserDto | null>;
    searchPublic(query: string): Promise<PublicUser[]>;
    getPublicById(id: number): Promise<PublicUser | null>;
}