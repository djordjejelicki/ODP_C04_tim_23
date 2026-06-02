import { PublicUSerDto } from "../../Domain/DTOs/users/PublicUserDto";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { UserRole } from "../../Domain/enums/UserRole";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IUserService } from "../../Domain/services/users/IUserService";

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

  async promeniUlogu(id: number, role: UserRole): Promise<boolean> {
    const korisnik = await this.userRepository.getById(id);

    if (korisnik.id === 0){
      return false;
    }

    return await this.userRepository.updateRole(id, role);
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

  async getPublicKorisnikById(id: number): Promise<PublicUSerDto> {
    const user = await this.userRepository.getById(id);

    if (user.id === 0){
      return new PublicUSerDto();
    }

    return new PublicUSerDto(
      user.id,
      user.username,
      user.first_name,
      user.last_name,
      user.bio,
      user.avatar_url
    );
  }

  async searchPublicKorisnici(query: string): Promise<PublicUSerDto[]> {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length === 1){
      return [];
    }

    const users = await this.userRepository.searchPublic(normalizedQuery);

    return users.map(
      (user) => new PublicUSerDto(
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
