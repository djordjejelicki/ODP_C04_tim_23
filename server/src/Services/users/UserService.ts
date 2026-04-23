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
      (user) => new UserDto(user.id, user.korisnickoIme, user.uloga)
    );

    return korisniciDto;
  }

  async promeniUlogu(id: number, uloga: UserRole): Promise<boolean> {
    const korisnik = await this.userRepository.getById(id);

    if (korisnik.id === 0){
      return false;
    }

    return await this.userRepository.updateRole(id, uloga);
  }
}
