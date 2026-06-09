import { Request, Response, Router } from 'express';
import { IAuthService } from '../../Domain/services/auth/IAuthService';
import { validateLogin, validateRegister } from '../validators/authValidator';
import { authenticate } from '../../Middlewares/authentification/AuthMiddleware';
import { uploadAvatar } from '../../Middlewares/uploads/UploadAvatarMiddleware';
import jwt from "jsonwebtoken";

export class AuthController {
  private router: Router;
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.router = Router();
    this.authService = authService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/auth/login', this.prijava.bind(this));
    this.router.post('/auth/register', uploadAvatar.single("avatar"), this.registracija.bind(this));
    this.router.post('/auth/logout', authenticate, this.logout.bind(this));
  }

  private async prijava(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      const rezultat = validateLogin(username, password);

      if (!rezultat.valid) {
        res.status(400).json({ success: false, message: rezultat.message});
        return;
      }

      const result = await this.authService.prijava(username, password);

      if (!result.success){
        res.status(401).json({success: false, message: result.message})
        return;
      }

      const token = jwt.sign(
        { 
          id: result.id, 
          username: result.username, 
          role: result.role,
        }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });

      res.status(200).json({success: true, message: result.message, data: token});
    } catch  {
      res.status(500).json({success: false, message: "Internal server error"});
    }
  }

 
  private async registracija(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, first_name, last_name } = req.body;

      const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : "";
      
      const rezultat = validateRegister(username, email, password, first_name, last_name);

      if (!rezultat.valid) {
        res.status(400).json({ success: false, message: rezultat.message});
        return;
      }

      const result = await this.authService.registracija(
        username, email, password, first_name, last_name, avatarUrl 
      );
      
      if (!result.success){
        res.status(400).json({ success: false, message: result.message});
        return;
      }

      const token = jwt.sign(
        { 
          id: result.id, 
          username: result.username, 
          role: result.role,
        }, process.env.JWT_SECRET ?? "", { expiresIn: '6h' });

      res.status(201).json({ success: true, message: result.message, data: token});
    } catch {
      res.status(500).json({success: false, message: "Internal server error"});
    }
  }

  private async logout(req: Request, res: Response): Promise<void> {
    try{
      const userId = req.user?.id;

      if (!userId){
        res.status(401).json({ success: false, message: "Unauthorized access"});
        return;
      }

      const uspesno = await this.authService.logout(userId);

      if (!uspesno) {
        res.status(400).json({ success: false, message: "Logout could not be recorded"});
        return;
      }

      res.status(200).json({ success: true, message: "Logout successful" });
    } catch{
      res.status(500).json({ success: false, message: "Internal server error"});
    }
  }
  
  public getRouter(): Router {
    return this.router;
  }
}