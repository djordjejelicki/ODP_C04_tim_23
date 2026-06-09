import { PublicUserDto } from "../../Domain/DTOs/users/PublicUserDto";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { UserRole } from "../../Domain/enums/UserRole";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import { IUserService } from "../../Domain/services/users/IUserService";
import { ServiceResult } from "../../Domain/common/ServiceResult";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export class UserService implements IUserService {
  public constructor(private userRepository: IUserRepository) {}
  
  private readonly saltRounds: number = parseInt(
    process.env.SALT_ROUNDS || "10",
    10
  );

  private deleteAvatar(avatarUrl: string): void {
    if (avatarUrl.trim().length === 0 || !avatarUrl.startsWith("/uploads/avatars/")){
      return;
    }

    const relativePath = avatarUrl.replace("/uploads/", "");
    const filePath = path.join(__dirname, "../../../uploads", relativePath);

    if (fs.existsSync(filePath)){
      fs.unlinkSync(filePath);
    }
  }

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
        user.avatar_url,
        user.bio
      )
    );

    return korisniciDto;
  }

  async promeniUlogu(id: number, role: UserRole): Promise<ServiceResult> {
    const korisnik = await this.userRepository.getById(id);

    if (korisnik.id === 0){
      return ServiceResult.fail("User not found");
    }

    if (korisnik.role === role){
      return ServiceResult.fail("User already has this role");
    }

    const updated =  await this.userRepository.updateRole(id, role);

    if (!updated){
      return ServiceResult.fail("Failed to update user role");
    }

    return ServiceResult.ok("User role updated successfully");
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
      user.avatar_url,
      user.bio
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

  async updateProfile(
    id: number, 
    username: string, 
    email: string, 
    first_name: string, 
    last_name: string, 
    bio: string, 
    avatar_url: string
  ): Promise<ServiceResult> {
      const user = await this.userRepository.getById(id);

      if (user.id === 0){
        return ServiceResult.fail("User not found");
      }

      const existingUsername = await this.userRepository.getByUsername(username);

      if (existingUsername.id !== 0 && existingUsername.id !== id) {
        return ServiceResult.fail("Username is already taken");
      }

      const existingEmail = await this.userRepository.getByEmail(email);

      if (existingEmail.id !== 0 && existingEmail.id !== id){
        return ServiceResult.fail("Email is already taken");
      }

      const newAvatarUrl = avatar_url.trim().length > 0 ? avatar_url : user.avatar_url;

      const updated = await this.userRepository.updateProfile(
        id,
        username,
        email,
        first_name,
        last_name,
        bio,
        newAvatarUrl
      );

      if (!updated) {
        return ServiceResult.fail("Failed to update profile");
      }

      if (avatar_url.trim().length > 0 && user.avatar_url !== avatar_url){
        this.deleteAvatar(user.avatar_url);
      }

      return ServiceResult.ok("Profile updated successfully");
  }

  async changePassword(
    id: number, 
    currentPassword: string, 
    newPassword: string
  ): Promise<ServiceResult> {
    const user = await this.userRepository.getById(id);
    
    if (user.id === 0){
      return ServiceResult.fail("User not found");
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch){
      return ServiceResult.fail("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

    const updated = await this.userRepository.updatePassword(id, hashedPassword);

    if (!updated){
      return ServiceResult.fail("Failed to update password");
    }

    return ServiceResult.ok("Password updated successfully");
  }
}
