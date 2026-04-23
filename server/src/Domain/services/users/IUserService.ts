import { UserDto } from "../../DTOs/users/UserDto";
import { UserRole } from "../../enums/UserRole";

export interface IUserService { 
  getSviKorisnici(): Promise<UserDto[]>;
  promeniUlogu(id: number, uloga: UserRole): Promise<boolean>;
}