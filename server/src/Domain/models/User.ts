import { UserRole } from "../enums/UserRole";

export class User {
  public constructor(
    public id: number = 0,
    public korisnickoIme: string = '',
    public email: string = '',
    public uloga: UserRole = UserRole.HIKER,
    public lozinka: string = '',
    public ime: string = '',
    public prezime: string = '',
    public bio: string | null = null,
    public avatar_url: string | null = null,
    public created_at: Date | null = null
  ) {}
}