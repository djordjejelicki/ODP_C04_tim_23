import { AuthResultDto } from "../../DTOs/auth/AuthResultDto";

export interface IAuthService {

  prijava(korisnickoIme: string, lozinka: string): Promise<AuthResultDto>;
  registracija(
    korisnickoIme: string,
    email: string,
    lozinka: string,
    ime: string,
    prezime: string
  ): Promise<AuthResultDto>;
  logout(user_id: number): Promise<boolean>;
}
