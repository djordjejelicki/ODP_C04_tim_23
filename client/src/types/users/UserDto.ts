import type { UserRole } from "./UserRole";

export type UserDto = {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
}