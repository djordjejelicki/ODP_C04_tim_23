import { UserDto } from "../../DTOs/users/UserDto";
import { UserRole } from "../../enums/UserRole";
import { PublicUSerDto } from "../../DTOs/users/PublicUserDto";


export interface IUserService { 
  getSviKorisnici(): Promise<UserDto[]>;
  promeniUlogu(id: number, role: UserRole): Promise<boolean>;
  getKorisnikById(id: number): Promise<UserDto>;
  getPublicKorisnikById(id: number): Promise<PublicUSerDto>;
  searchPublicKorisnici(query: string): Promise<PublicUSerDto[]>;
}