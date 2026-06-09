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
        this.router.get("/hikes", authenticate, this.getForCurrentUser.bind(this));
        this.router.post("/hikes", authenticate, this.create.bind(this));
        this.router.get("/hikes/:id", authenticate, this.getById.bind(this));
        this.router.post("/hikes/:id/invite", authenticate, this.invite.bind(this));
        this.router.patch("/hikes/:id/respond", authenticate, this.respond.bind(this));
        this.router.put("/hikes/:id", authenticate, this.update.bind(this));
        this.router.delete("/hikes/:id", authenticate, this.cancel.bind(this));
        this.router.delete("/hikes/:id/participants/:userId", authenticate, this.removeParticipant.bind(this));
    }

    private async getForCurrentUser(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;

            if (!userId){
                res.status(401).json({ success: false, message: "Unauthorized access"});
                return;
            }

            const hikes = await this.hikeService.getPohodiZaKorisnika(userId);
            res.status(200).json(hikes);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async create(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const { trail_id, name, description, scheduled_at, max_participants } = req.body;

            if (!userId){
                res.status(401).json({ success: false, message: "Unauthorized access"});
                return;
            }

            const rezultat = validateHike(
                Number(trail_id),
                name,
                description ?? "",
                scheduled_at,
                Number(max_participants)
            );

            if (!rezultat.valid) {
                res.status(400).json({ success: false, message: rezultat.message});
                return;
            }

            const result = await this.hikeService.kreirajPohod(
                userId,
                Number(trail_id),
                name,
                description ?? "",
                new Date(scheduled_at),
                Number(max_participants)
            );

            if (!result.success){
                res.status(400).json(result);
                return;
            }

            res.status(201).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized access"});
                return;
            }

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Invalid hike id"});
                return;
            }

            const hike = await this.hikeService.getPohodById(id);

            if (hike.id === 0){
                res.status(404).json({ success: false, message: "Hike not found"});
                return;
            }

            const imaPristup = await this.hikeService.korisnikImaPristupPohodu(id, userId);

            if (!imaPristup){
                res.status(403).json({ success: false, message: "You dont have access to this hike"});
                return;
            }

            const details = await this.hikeService.getDetaljiPohoda(id);
            if (details.id === 0){
                res.status(404).json({success: false, message: "Hike not found"});
                return;
            }
            res.status(200).json(details);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async invite(req: Request, res: Response): Promise<void> {
        try{
            const organizerId = req.user?.id;
            const hikeId = Number(req.params.id);
            const { username } = req.body;

            if (!organizerId){
                res.status(401).json({ success: false, message: "Unauthorized access"});
                return;
            }

            if (!Number.isInteger(hikeId) || hikeId <= 0){
                res.status(400).json({ success: false, message: "Invalid hike id"});
                return;
            }

            if (typeof username !== "string" || username.trim().length < 3){
                res.status(400).json({ success: false, message: "Invalid username"});
                return;
            }

            const result = await this.hikeService.pozoviUcesnika(hikeId, organizerId, username.trim());

            if (!result.success){
                res.status(400).json(result);
                return;
            }

            res.status(200).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async respond(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const hikeId = Number(req.params.id);
            const {status} = req.body;

            if (!userId){
                res.status(401).json({ success: false, message: "Unauthorized access"});
                return;
            }

            if (!Number.isInteger(hikeId) || hikeId <= 0){
                res.status(400).json({ success: false, message: "Invalid hike id"});
                return;
            }

            const normalizedStatus = typeof status === "string" ? status.trim() : "";

            const validStatus = 
                normalizedStatus === HikeParticipantStatus.CONFIRMED ||
                normalizedStatus === HikeParticipantStatus.DECLINED;
            
            if (!validStatus) {
                res.status(400).json({ success: false, message: "Invalid response status"});
                return;
            }

            const result = await this.hikeService.odgovoriNaPoziv(
                hikeId, 
                userId, 
                normalizedStatus as HikeParticipantStatus
            );

            if (!result.success) {
                res.status(404).json(result);
                return;
            }

            res.status(200).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async update(req: Request, res: Response): Promise<void> {
        try{
            const organizerId = req.user?.id;
            const hikeId = Number(req.params.id);
            const { trail_id, name, description, scheduled_at, max_participants } = req.body;

            if (!organizerId){
                res.status(401).json({ success: false, message: "Unauthorized access"});
                return;
            }

            if (!Number.isInteger(hikeId) || hikeId <= 0){
                res.status(400).json({ success: false, message: "Invalid hike id"});
                return;
            }

            const rezultat = validateHike(
                Number(trail_id),
                name,
                description ?? "",
                scheduled_at,
                Number(max_participants)
            );

            if (!rezultat.valid){
                res.status(400).json({ success: false, message: rezultat.message});
                return;
            }

            const result = await this.hikeService.izmeniPohod(
                hikeId,
                organizerId,
                Number(trail_id),
                name,
                description ?? "",
                new Date(scheduled_at),
                Number(max_participants)
            );

            if (!result.success){
                res.status(404).json(result);
                return;
            }

            res.status(200).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async cancel(req: Request, res: Response): Promise<void> {
        try{
            const organizerId = req.user?.id;
            const hikeId = Number(req.params.id);

            if (!organizerId){
                res.status(401).json({ success: false, message: "Unauthorized access"});
                return;
            }

            if (!Number.isInteger(hikeId) || hikeId <= 0){
                res.status(400).json({ success: false, message: "Invalid hike id"});
                return;
            }

            const result = await this.hikeService.otkaziPohod(hikeId, organizerId);

            if (!result.success){
                res.status(404).json(result);
                return;
            }

            res.status(200).json(result);
        } catch{
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async removeParticipant(req: Request, res: Response): Promise<void> {
        try{
            const organizerId = req.user?.id;
            const hikeId = Number(req.params.id);
            const userId = Number(req.params.userId);

            if (!organizerId){
                res.status(401).json({ success: false, message: "Unauthorized access"});
                return;
            }

            if (!Number.isInteger(hikeId) || hikeId <= 0){
                res.status(400).json({ success: false, message: "Invalid hike id"});
                return;
            }

            if (!Number.isInteger(userId) || userId <= 0){
                res.status(400).json({ success: false, message: "Invalid user id"});
                return;
            }

            const result = await this.hikeService.ukloniUcesnika(hikeId, organizerId, userId);
            
            if (!result.success){
                res.status(404).json(result);
                return;
            }

            res.status(200).json(result);
        } catch{
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}