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
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async promeniUlogu(req: Request, res: Response): Promise<void> {
    try{
      const adminId = req.user?.id;
      const id = Number(req.params.id);
      const {role} = req.body;

      if (!adminId){
        res.status(401).json({ success: false, message: "Neautorizovan pristup" });
        return;
      }

      if (!Number.isInteger(id) || id <= 0){
        res.status(400).json({ success: false, message: "Korisnik nije validan" });
        return;
      }

      if (adminId === id){
        res.status(400).json({ success: false, message: "Ne mozete sami sebi menjati ulogu" });
        return;
      }

      const normalizedRole = typeof role === "string" ? role.trim() : "";
      const validRole = normalizedRole === UserRole.ADMIN || normalizedRole === UserRole.HIKER;

      if (!validRole) {
        res.status(400).json({ success: false, message: "Uloga nije validna"});
        return;
      }

      const uspesno = await this.userService.promeniUlogu(id, normalizedRole as UserRole);

      if (!uspesno) {
        res.status(404).json({ success: false, message: "Korisnik nije pronadjen" });
        return;
      }
      
      res.status(200).json({ success: true, message: "Uloga uspesno promenjena" });
    } catch {
      res.status(500).json({ success: false, message: "Greska na serveru" });
    }
  }

  private async me(req: Request, res: Response): Promise<void>{
    try{
      const userId = req.user?.id;

      if (!userId){
        res.status(401).json({ success: false, messsage: "Neautorizovan pristup" });
        return;
      }

      const user = await this.userService.getKorisnikById(userId);

      if (user.id === 0){
        res.status(404).json({ success: false, message: "Korisnik nije pronadjen" });
        return;
      }

      res.status(200).json(user);
    } catch{  
      res.status(500).json({ success: false, message: "Greska na serveru" });
    }
  }

  private async searchPublic(req: Request, res: Response): Promise<void> {
    try{
      const query = typeof req.query.q === "string" ? req.query.q : "";

      const users = await this.userService.searchPublicKorisnici(query);

      res.status(200).json(users);
    } catch {
      res.status(500).json({ success: false, message: "Greska na serveru" });
    }
  }

  private async getPublicById(req: Request, res: Response): Promise<void> {
    try{
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0){
        res.status(400).json({ success: false, message: "Korisnik nije validan" });
        return;
      }

      const user = await this.userService.getPublicKorisnikById(id);

      if (user.id === 0){
        res.status(404).json({ success: false, message: "Korisnik nije pronadjen" });
        return;
      }

      res.status(200).json(user);
    } catch {
      res.status(500).json({ success: false, message: "Greska na serveru" });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
