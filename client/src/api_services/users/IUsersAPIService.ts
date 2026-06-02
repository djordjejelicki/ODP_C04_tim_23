import type { UserDto, UserRole } from "../../types/users/UserDto";
import type { PublicUser } from "../../types/users/PublicUser";

export interface IUsersAPIService {
    getAll(): Promise<UserDto[]>;
    updateRole(id: number, role: UserRole): Promise<boolean>;
    getMe(): Promise<UserDto | null>;
    searchPublic(query: string): Promise<PublicUser[]>;
    getPublicById(id: number): Promise<PublicUser | null>;
}