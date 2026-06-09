import { AuthResultDto } from "../../DTOs/auth/AuthResultDto";

export interface IAuthService {

  prijava(username: string, password: string): Promise<AuthResultDto>;
  registracija(
    username: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    avatar_url: string 
  ): Promise<AuthResultDto>;
  logout(user_id: number): Promise<boolean>;
}
