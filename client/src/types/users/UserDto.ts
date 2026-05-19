
export type UserRole = "hiker" | "admin";

export type UserDto = {
    id: number;
    username: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
}