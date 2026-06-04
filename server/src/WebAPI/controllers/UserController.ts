import { Request, Response, Router } from "express";
import { IUserService } from "../../Domain/services/users/IUserService";
import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";

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
    this.router.get("/users/:id", this.getPublicById.bind(this));
  }

  private async korisnici(req: Request, res: Response): Promise<void> {
    try {
      const korisniciPodaci: UserDto[] =
        await this.userService.getSviKorisnici();

      res.status(200).json(korisniciPodaci);
      return;
    } catch {
      res.status(500).json({ success: false, message: "Internal server error", data: null });
    }
  }

  private async promeniUlogu(req: Request, res: Response): Promise<void> {
    try{
      const adminId = req.user?.id;
      const id = Number(req.params.id);
      const {role} = req.body;

      if (!adminId){
        res.status(401).json({ success: false, message: "Unauthorized access", data: null });
        return;
      }

      if (!Number.isInteger(id) || id <= 0){
        res.status(400).json({ success: false, message: "Invalid user id", data: null });
        return;
      }

      if (adminId === id){
        res.status(400).json({ success: false, message: "You can not change your own role", data: null });
        return;
      }

      const normalizedRole = typeof role === "string" ? role.trim() : "";
      const validRole = normalizedRole === UserRole.ADMIN || normalizedRole === UserRole.HIKER;

      if (!validRole) {
        res.status(400).json({ success: false, message: "Invalid role", data: null});
        return;
      }

      const result = await this.userService.promeniUlogu(id, normalizedRole as UserRole);

      if (!result.success) {
        res.status(404).json(result);
        return;
      }
      
      res.status(200).json(result);
    } catch {
      res.status(500).json({ success: false, message: "Internal server error", data: null });
    }
  }

  private async me(req: Request, res: Response): Promise<void>{
    try{
      const userId = req.user?.id;

      if (!userId){
        res.status(401).json({ success: false, message: "Unauthorized access", data: null });
        return;
      }

      const user = await this.userService.getKorisnikById(userId);

      if (user.id === 0){
        res.status(404).json({ success: false, message: "Uset not found", data: null });
        return;
      }

      res.status(200).json(user);
    } catch{  
      res.status(500).json({ success: false, message: "Internal server error", data: null });
    }
  }

  private async searchPublic(req: Request, res: Response): Promise<void> {
    try{
      const query = typeof req.query.q === "string" ? req.query.q : "";

      const users = await this.userService.searchPublicKorisnici(query);

      res.status(200).json(users);
    } catch {
      res.status(500).json({ success: false, message: "Internal server error", data: null });
    }
  }

  private async getPublicById(req: Request, res: Response): Promise<void> {
    try{
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0){
        res.status(400).json({ success: false, message: "Invali user id", data: null });
        return;
      }

      const user = await this.userService.getPublicKorisnikById(id);

      if (user.id === 0){
        res.status(404).json({ success: false, message: "User not found", data: null });
        return;
      }

      res.status(200).json(user);
    } catch {
      res.status(500).json({ success: false, message: "Internal server error", data: null });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
