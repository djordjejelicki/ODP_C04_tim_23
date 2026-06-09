import { Request, Response, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { uploadAvatar } from "../../Middlewares/uploads/UploadAvatarMiddleware";
import { validateUpdateProfile, validateChangePassword } from "../validators/userValidator";

export class UserController {
  private router: Router;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.router = Router();
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/users", authenticate, authorize(UserRole.ADMIN), this.korisnici.bind(this));
    this.router.put("/users/:id/role", authenticate, authorize(UserRole.ADMIN), this.promeniUlogu.bind(this));
    this.router.get("/users/me", authenticate, this.me.bind(this));
    this.router.get("/users/search", this.searchPublic.bind(this));
    this.router.put("/users/me", authenticate, uploadAvatar.single("avatar"), this.updateProfile.bind(this));
    this.router.put("/users/me/password", authenticate, this.changePassword.bind(this));
    this.router.get("/users/:id", this.getPublicById.bind(this));
  }

  private async korisnici(req: Request, res: Response): Promise<void> {
    try {
      const korisniciPodaci: UserDto[] =
        await this.userService.getSviKorisnici();

      res.status(200).json(korisniciPodaci);
      return;
    } catch {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  private async promeniUlogu(req: Request, res: Response): Promise<void> {
    try{
      const adminId = req.user?.id;
      const id = Number(req.params.id);
      const {role} = req.body;

      if (!adminId){
        res.status(401).json({ success: false, message: "Unauthorized access"});
        return;
      }

      if (!Number.isInteger(id) || id <= 0){
        res.status(400).json({ success: false, message: "Invalid user id"});
        return;
      }

      if (adminId === id){
        res.status(400).json({ success: false, message: "You can not change your own role"});
        return;
      }

      const normalizedRole = typeof role === "string" ? role.trim() : "";
      const validRole = normalizedRole === UserRole.ADMIN || normalizedRole === UserRole.HIKER;

      if (!validRole) {
        res.status(400).json({ success: false, message: "Invalid role" });
        return;
      }

      const result = await this.userService.promeniUlogu(id, normalizedRole as UserRole);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }
      
      res.status(200).json(result);
    } catch {
      res.status(500).json({ success: false, message: "Internal server error"});
    }
  }

  private async me(req: Request, res: Response): Promise<void>{
    try{
      const userId = req.user?.id;

      if (!userId){
        res.status(401).json({ success: false, message: "Unauthorized access"});
        return;
      }

      const user = await this.userService.getKorisnikById(userId);

      if (user.id === 0){
        res.status(404).json({ success: false, message: "User not found"});
        return;
      }

      res.status(200).json(user);
    } catch{  
      res.status(500).json({ success: false, message: "Internal server error"});
    }
  }

  private async searchPublic(req: Request, res: Response): Promise<void> {
    try{
      const query = typeof req.query.q === "string" ? req.query.q : "";

      const users = await this.userService.searchPublicKorisnici(query);

      res.status(200).json(users);
    } catch {
      res.status(500).json({ success: false, message: "Internal server error"});
    }
  }

  private async getPublicById(req: Request, res: Response): Promise<void> {
    try{
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0){
        res.status(400).json({ success: false, message: "Invalid user id"});
        return;
      }

      const user = await this.userService.getPublicKorisnikById(id);

      if (user.id === 0){
        res.status(404).json({ success: false, message: "User not found"});
        return;
      }

      res.status(200).json(user);
    } catch {
      res.status(500).json({ success: false, message: "Internal server error"});
    }
  }

  private async updateProfile(req: Request, res: Response): Promise<void> {
    try{
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized access"});
        return;
      }

      const {
        username,
        email,
        first_name,
        last_name,
        bio
      } = req.body;

      const avatarUrl = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : "";

      const validation = validateUpdateProfile(
        username,
        email,
        first_name,
        last_name,
        bio ?? ""
      );

      if (!validation.valid){
        res.status(400).json({ success: false, message: validation.message});
        return;
      }

      const result = await this.userService.updateProfile(
        userId,
        username,
        email,
        first_name,
        last_name,
        bio ?? "",
        avatarUrl
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch {
      res.status(500).json({success: false, message: "Internal server error"});
    }
  }

  private async changePassword(req: Request, res: Response): Promise<void> {
    try{
      const userId = req.user?.id;

      if (!userId){
        res.status(401).json({success: false, message: "Unathorized access"});
        return;
      }

      const { currentPassword, newPassword } = req.body;

      const validation = validateChangePassword(currentPassword, newPassword);
      if (!validation.valid){
        res.status(400).json({ success: false, message: validation.message});
        return;
      }

      const result = await this.userService.changePassword(userId, currentPassword, newPassword);

      if (!result.success){
        res.status(400).json(result);
        return;
      }
      res.status(200).json(result);
    } catch {
      res.status(500).json({ success: false, message: "Internal server error"});
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
