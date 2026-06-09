import { UserDto } from "../../DTOs/users/UserDto";
import { UserRole } from "../../enums/UserRole";
import { PublicUserDto } from "../../DTOs/users/PublicUserDto";
import { ServiceResult } from "../../common/ServiceResult";

export interface IUserService { 
  getSviKorisnici(): Promise<UserDto[]>;
  promeniUlogu(id: number, role: UserRole): Promise<ServiceResult>;
  getKorisnikById(id: number): Promise<UserDto>;
  getPublicKorisnikById(id: number): Promise<PublicUserDto>;
  searchPublicKorisnici(query: string): Promise<PublicUserDto[]>;
  updateProfile(
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    bio: string,
    avatar_url: string
  ): Promise<ServiceResult>;
  changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<ServiceResult>;
}