import { Request, Response, Router } from "express";
import { IUserTrailService } from "../../Domain/services/userTrails/IUserTrailService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { UserTrailStatus } from "../../Domain/enums/UserTrailStatus";


export class UserTrailController {
    private router: Router;
    private userTrailService: IUserTrailService;

    constructor(userTrailService: IUserTrailService){
        this.router = Router();
        this.userTrailService = userTrailService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/my-trails", authenticate, this.getMine.bind(this));
        this.router.post("/my-trails", authenticate, this.add.bind(this));
        this.router.patch("/my-trails/:trailId/status", authenticate, this.updateStatus.bind(this));
        this.router.delete("/my-trails/:trailId", authenticate, this.delete.bind(this));
    }

    private async getMine(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized access", data: null });
                return;
            }

            const mojeRute = await this.userTrailService.getDetaljiMojihRuta(userId);
            res.status(200).json(mojeRute);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error", data: null });
        }
    }

    private async add(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const {trail_id, status} = req.body;

            if (!userId){
                res.status(401).json({ success: false, message: "Unauthorized access.", data: null});
                return;
            }

            const trailId = Number(trail_id);

            const validStatus = 
                status === UserTrailStatus.WANT_TO_HIKE || 
                status === UserTrailStatus.COMPLETED;

            if (!Number.isInteger(trailId) || trailId <= 0){
                res.status(400).json({ success: false, message: "Invalid trail id", data: null });
                return;
            }

            if (!validStatus){
                res.status(400).json({ success: false, message: "Invalid trail status", data: null });
                return;
            }

            const result = await this.userTrailService.dodajRutu(
                userId,
                trailId,
                status as UserTrailStatus
            );

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(201).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error", data: null });
        }
    }

    private async updateStatus(req: Request, res: Response): Promise<void>{
        try{
            const userId = req.user?.id;
            const trailId = Number(req.params.trailId);
            const { status } = req.body;

            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized access", data: null });
                return;
            }

            const validStatus = 
                status === UserTrailStatus.WANT_TO_HIKE || 
                status === UserTrailStatus.COMPLETED;

            if (!Number.isInteger(trailId) || trailId <= 0) {
                res.status(400).json({ success: false, message: "Invalid trail id", data: null });
                return;
            }

            if (!validStatus) {
                res.status(400).json({ success: false, message: "Invalid trail status", data: null });
                return;
            }

            const result = await this.userTrailService.promeniStatus(
                userId,
                trailId,
                status as UserTrailStatus
            );

            if (!result.success) {
                res.status(404).json(result);
                return;
            }
            res.status(200).json(result);
        } catch{
            res.status(500).json({ success: false, message: "Internal Server error", data: null });
        }
    }

    private async delete(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const trailId = Number(req.params.trailId);

            if (!userId){
                res.status(401).json({ success: false, message: "Unauthorized access", data: null });
                return;
            }

            if (!Number.isInteger(trailId) || trailId < 0) {
                res.status(400).json({ success: false, message: "Invalid trail id", data: null });
                return;
            }

            const result = await this.userTrailService.ukloniRutu(userId, trailId);

            if (!result.success){
                res.status(404).json(result);
                return;
            }

            res.status(200).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error", data: null });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}