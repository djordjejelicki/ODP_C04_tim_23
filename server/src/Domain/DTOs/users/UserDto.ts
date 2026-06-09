import { UserRole } from "../../enums/UserRole";

export class UserDto {
  public constructor(
    public id: number = 0,
    public username: string = "",
    public first_name: string = "",
    public last_name: string = "",
    public email: string = "",
    public role: UserRole = UserRole.HIKER,
    public avatar_url: string = "",
    public bio: string = ""
  ) {}
}
