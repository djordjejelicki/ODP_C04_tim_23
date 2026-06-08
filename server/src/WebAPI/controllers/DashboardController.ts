import { Request, Response, Router } from "express";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { IDashboardService } from "../../Domain/services/dashboard/IDashboardService";

export class DashboardController {
    private router: Router;
    private dashboardService: IDashboardService;

    constructor(dashboardService: IDashboardService ){
        this.router = Router();
        this.dashboardService = dashboardService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/dashboard/stats", authenticate, this.getStats.bind(this));
    }

    private async getStats(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;

            if (!userId){
                res.status(401).json({ success: false, message: "Unauthorized access"});
                return;
            }

            const stats = await this.dashboardService.getStats(userId);
            res.status(200).json(stats);
        } catch{
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}