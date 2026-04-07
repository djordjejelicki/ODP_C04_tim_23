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
                res.status(401).json({ success: false, message: "Neautorizovan pristup" });
                return;
            }

            const mojeRute = await this.userTrailService.getMojeRute(userId);
            res.status(200).json(mojeRute);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveri" });
        }
    }

    private async add(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            const {trail_id, status} = req.body;

            if (!userId){
                res.status(401).json({ success: false, message: "Neautorizovan pristup" });
                return;
            }

            const validStatus = status === UserTrailStatus.WANT_TO_HIKE || UserTrailStatus.COMPLETED;

            if (!Number.isInteger(Number(trail_id)) || Number(trail_id) <= 0){
                res.status(400).json({ success: false, message: "Ruta nije validna" });
                return;
            }

            if (!validStatus){
                res.status(400).json({ success: false, message: "Status nije validan" });
                return;
            }

            const novaRuta = await this.userTrailService.dodajRutu(
                userId,
                Number(trail_id),
                status as UserTrailStatus
            );

            if (novaRuta.user_id === 0) {
                res.status(400).json({ success: false, message: "Ruta je vec na vasoj listi."});
                return;
            }

            res.status(201).json(novaRuta);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async updateStatus(req: Request, res: Response): Promise<void>{
        try{
            const userId = req.user?.id;
            const trailId = Number(req.params.trailId);
            const { status } = req.body;

            console.log("STATUS iZ BODY: " , status);
            if (!userId) {
                res.status(401).json({ success: false, message: "Neautorizovan pristup." });
                return;
            }

            const validStatus = status === UserTrailStatus.WANT_TO_HIKE || status === UserTrailStatus.COMPLETED;

            if (!Number.isInteger(trailId) || trailId <= 0) {
                res.status(400).json({ success: false, message: "Ruta nije validna." });
                return;
            }

            if (!validStatus) {
                res.status(400).json({ success: false, message: "Status nije validan." });
                return;
            }

            const uspesno = await this.userTrailService.promeniStatus(
                userId,
                trailId,
                status as UserTrailStatus
            );

            if (!uspesno) {
                res.status(404).json({ success: false, message: "Ruta nije pronadjena na vasoj listi" });
                return;
            }
            res.status(200).json({ success: true, message: "Status uspesno izmenjen" });
        } catch{
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async delete(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const trailId = Number(req.params.trailId);

            if (!userId){
                res.status(401).json({ success: false, message: "Neautorizovan pristup" });
                return;
            }

            if (!Number.isInteger(trailId) || trailId < 0) {
                res.status(400).json({ success: false, message: "Ruta nije validna" });
                return;
            }

            const uspesno = await this.userTrailService.ukloniRutu(userId, trailId);

            if (!uspesno){
                res.status(404).json({ success: false, message: "Ruta nije pronadjena na vasoj listi" });
                return;
            }

            res.status(200).json({ success: true, message: "Ruta uspesno uklonjena" });
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}