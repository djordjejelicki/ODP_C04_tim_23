import { UserRole } from "../enums/UserRole";

export class User {
  public constructor(
    public id: number = 0,
    public username: string = '',
    public email: string = '',
    public role: UserRole = UserRole.HIKER,
    public password: string = '',
    public first_name: string = '',
    public last_name: string = '',
    public bio: string | null = null,
    public avatar_url: string | null = null,
    public created_at: Date | null = null
  ) {}
}