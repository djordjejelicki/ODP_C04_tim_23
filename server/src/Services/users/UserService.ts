import { PublicUserDto } from "../../Domain/DTOs/users/PublicUserDto";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { UserRole } from "../../Domain/enums/UserRole";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IUserService } from "../../Domain/services/users/IUserService";
import { ServiceResult } from "../../Domain/common/ServiceResult";

export class UserService implements IUserService {
  public constructor(private userRepository: IUserRepository) {}

  async getSviKorisnici(): Promise<UserDto[]> {
    const korisnici: User[] = await this.userRepository.getAll();
    const korisniciDto: UserDto[] = korisnici.map(
      (user) => new UserDto(
        user.id, 
        user.username, 
        user.first_name, 
        user.last_name, 
        user.email, 
        user.role,
        user.avatar_url
      )
    );

    return korisniciDto;
  }

  async promeniUlogu(id: number, role: UserRole): Promise<ServiceResult<null>> {
    const korisnik = await this.userRepository.getById(id);

    if (korisnik.id === 0){
      return ServiceResult.fail<null>("User not found");
    }

    if (korisnik.role === role){
      return ServiceResult.fail<null>("User already has this role");
    }

    const updated =  await this.userRepository.updateRole(id, role);

    if (!updated){
      return ServiceResult.fail<null>("Failed to update user role");
    }

    return ServiceResult.ok<null>("User role updated successfully");
  }

  async getKorisnikById(id: number): Promise<UserDto> {
    const user = await this.userRepository.getById(id);
    if (user.id === 0){
      return new UserDto();
    }

    return new UserDto(
      user.id,
      user.username,
      user.first_name,
      user.last_name,
      user.email,
      user.role,
      user.avatar_url
    );
  }

  async getPublicKorisnikById(id: number): Promise<PublicUserDto> {
    const user = await this.userRepository.getById(id);

    if (user.id === 0){
      return new PublicUserDto();
    }

    return new PublicUserDto(
      user.id,
      user.username,
      user.first_name,
      user.last_name,
      user.bio,
      user.avatar_url
    );
  }

  async searchPublicKorisnici(query: string): Promise<PublicUserDto[]> {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length === 1){
      return [];
    }

    const users = await this.userRepository.searchPublic(normalizedQuery);

    return users.map(
      (user) => new PublicUserDto(
        user.id,
        user.username,
        user.first_name,
        user.last_name,
        user.bio,
        user.avatar_url
      )
    );
  }
}
