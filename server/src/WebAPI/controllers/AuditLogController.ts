import { Request, Response, Router } from "express";
import { IAuditLogService } from "../../Domain/services/auditLogs/IAuditLogService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";


export class AuditLogController {
    private router: Router;

    constructor(private auditLogService: IAuditLogService){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/audits/logs", authenticate, authorize(UserRole.ADMIN), this.getAll.bind(this));
    }

    private async getAll(req: Request, res: Response): Promise<void> {
        try{
            const logs = await this.auditLogService.getSviLogovi();
            res.status(200).json(logs);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error", data: null });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}