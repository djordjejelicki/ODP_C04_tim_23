import { Request, Response, Router } from "express";
import { IHikeService } from "../../Domain/services/hikes/IHikeService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { validateHike } from "../validators/hikeValidator";
import { HikeParticipantStatus } from "../../Domain/enums/HikeParticipantStatus";

export class HikeController {
    private router: Router;
    private hikeService: IHikeService;

    constructor(hikeService: IHikeService) {
        this.router = Router();
        this.hikeService = hikeService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/hikes", authenticate, this.getAll.bind(this));
        this.router.post("/hikes", authenticate, this.create.bind(this));
        this.router.get("/hikes/:id", authenticate, this.getById.bind(this));
        this.router.post("/hikes/:id/invite", authenticate, this.invite.bind(this));
        this.router.patch("/hikes/:id/respond", authenticate, this.respond.bind(this));
    }

    private async getAll(req: Request, res: Response): Promise<void> {
        try{
            const hikes = await this.hikeService.getSviPohodi();
            res.status(200).json(hikes);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async create(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const { trail_id, name, description, scheduled_at, max_participants } = req.body;

            if (!userId){
                res.status(401).json({ success: false, message: "Neautorizovani pristup" });
                return;
            }

            const rezultat = validateHike(
                Number(trail_id),
                name,
                description ?? null,
                scheduled_at,
                Number(max_participants)
            );

            if (!rezultat.valid) {
                res.status(400).json({ success: false, message: rezultat.message });
                return;
            }

            const hike = await this.hikeService.kreirajPohod(
                userId,
                Number(trail_id),
                name,
                description ?? null,
                new Date(scheduled_at),
                Number(max_participants)
            );

            if (hike.id === 0){
                res.status(400).json({ success: false, message: "Kreiranje nije uspelo" });
                return;
            }

            res.status(201).json(hike);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Pohod nije validan" });
                return;
            }

            const hike = await this.hikeService.getPohodById(id);

            if (hike.id === 0){
                res.status(404).json({ success: false, message: "Pohod nije pronadjen" });
                return;
            }

            const ucesnici = await this.hikeService.getUcesnici(id);
            res.status(200).json({ hike, ucesnici });
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async invite(req: Request, res: Response): Promise<void> {
        try{
            const hikeId = Number(req.params.id);
            const {user_id} = req.body;

            if (!Number.isInteger(hikeId) || hikeId <= 0){
                res.status(400).json({ success: false, message: "Pohod nije validan" });
                return;
            }

            if (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0){
                res.status(400).json({ sucess: false, message: "Korisnik nije validan" });
                return;
            }

            const uspesno = await this.hikeService.pozoviUcesnika(hikeId, Number(user_id));

            if (!uspesno){
                res.status(400).json({ success: false, message: "Korisnik je vec pozvan na ovaj pohod" });
                return;
            }

            res.status(200).json({ success: true, message: "Ucesnik je uspesno pozvan" });
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async respond(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const hikeId = Number(req.params.id);
            const {status} = req.body;

            if (!userId){
                res.status(401).json({ success: false, message: "Neautorizovan pristup" });
                return;
            }

            if (!Number.isInteger(hikeId) || hikeId <= 0){
                res.status(400).json({ success: false, message: "Pohod nije validan" });
                return;
            }

            const normalizedStatus = typeof status === "string" ? status.trim() : "";

            const validStatus = 
                normalizedStatus === HikeParticipantStatus.CONFIRMED ||
                normalizedStatus === HikeParticipantStatus.DECLINED;
            
            if (!validStatus) {
                res.status(400).json({ success: false, message: "Status odgovora nije validan" });
                return;
            }

            const uspesno = await this.hikeService.odgovoriNaPoziv(
                hikeId, 
                userId, 
                normalizedStatus as HikeParticipantStatus
            );

            if (!uspesno) {
                res.status(404).json({ success: false, message: "Pozivnica nije pronadjena" });
                return;
            }

            res.status(200).json({ success: true, message: "Odgovor na pozivnicu je sacuvan" });
        } catch {
            res.status(500).json({ success: false, message: "Greska na server" });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}