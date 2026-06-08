import { UserRole } from "../../enums/UserRole";
import { User } from "../../models/User";


export interface IUserRepository {
  create(user: User): Promise<User>;
  getById(id: number): Promise<User>;
  getByUsername(username: string): Promise<User>;
  getAll(): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<boolean>;
  exists(id: number): Promise<boolean>;
  getByEmail(email: string): Promise<User>;
  updateRole(id: number, role: UserRole): Promise<boolean>;
  searchPublic(query: string): Promise<User[]>;
  updateProfile(
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    bio: string | null,
    avatar_url: string | null
  ): Promise<boolean>;
  updatePassword(
    id: number,
    hashedPassword: string
  ): Promise<boolean>;
}