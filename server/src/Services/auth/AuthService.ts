import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import { UserRole } from "../../Domain/enums/UserRole";
import bcrypt from "bcryptjs";
import { AuthResultDto } from "../../Domain/DTOs/auth/AuthResultDto";

export class AuthService implements IAuthService {
  private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS || "10", 10);

  public constructor(private userRepository: IUserRepository) {}

  async prijava(korisnickoIme: string, lozinka: string): Promise<AuthResultDto> {
    const user = await this.userRepository.getByUsername(korisnickoIme);

    if (user.id === 0) {
      return new AuthResultDto(false, "Pogresno korisnicko ime ili lozinka");
    }

    const passwordMatch = await bcrypt.compare(lozinka, user.lozinka);

    if (!passwordMatch){
      return new AuthResultDto(false, "Pogresno korisnicko ime ili lozinka");
    }

    return new AuthResultDto(true, "Uspesna prijava", user.id, user.korisnickoIme, user.uloga);
  }

  async registracija(
    korisnickoIme: string,
    email: string,
    lozinka: string,
    ime: string,
    prezime: string
  ): Promise<AuthResultDto> {
    const existingUser = await this.userRepository.getByUsername(korisnickoIme);
    
    if (existingUser.id !== 0) {
      return new AuthResultDto(false, "Korisnicko ime vec postoji.");
    }

    const existingEmail = await this.userRepository.getByEmail(email);

    if (existingEmail.id !== 0){
      return new AuthResultDto(false, "Email vec postoji");
    }

    // Hash-ujemo lozinku pre čuvanja
    const hashedPassword = await bcrypt.hash(lozinka, this.saltRounds);

    const newUser = await this.userRepository.create(
      new User(
        0,
        korisnickoIme,
        email,
        UserRole.HIKER,
        hashedPassword,
        ime,
        prezime,
        null,
        null,
        null
      )
    );

    if (newUser.id === 0){
      return new AuthResultDto(false, "Registracija nije uspela.");
    }

    return new AuthResultDto(true, "Uspesna registracija", newUser.id, newUser.korisnickoIme, newUser.uloga);
  }
}
