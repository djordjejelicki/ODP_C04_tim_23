import type { UserDto, UserRole } from "../../types/users/UserDto";

export interface IUsersAPIService {
    getAll(): Promise<UserDto[]>;
    updateRole(id: number, role: UserRole): Promise<boolean>;
    getMe(): Promise<UserDto | null>;
}