import { Request, Response, Router } from "express";
import { IMountainService } from "../../Domain/services/mountains/IMountainService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { monitorEventLoopDelay } from "node:perf_hooks";

export class MountainController {
    private router : Router;
    private mountainService: IMountainService;

    constructor(mountainService: IMountainService){
        this.router = Router();
        this.mountainService = mountainService;
        this.initializeRoutes();
    }

    private  initializeRoutes(): void {
        this.router.get("/mountains", this.getAll.bind(this));
        this.router.get("/mountains/:id", this.getById.bind(this));
        this.router.post("/mountains", authenticate, authorize("admin"), this.create.bind(this));
    }
    
    private async getAll(req: Request, res: Response): Promise<void> {
        try {
            const mountains = await this.mountainService.getSvePlanine();
            res.status(200).json(mountains);
        } catch (error) {
            res.status(500).json({success: false, message: "Greska na serveru"});
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id as string);
            const mountain = await this.mountainService.getPlaninaById(id);

            if (mountain.id === 0){
                res.status(404).json({ success: false, message: "Planina ne postoji" });
                return;
            }

            res.status(200).json(mountain);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async create(req: Request, res: Response) : Promise<void> {
        try{
            const {naziv, drzava, region, visina, opis} = req.body;

            const mountain = await this.mountainService.createPlanina(
                naziv,
                drzava,
                region ?? null,
                visina,
                opis ?? null
            );

            if (mountain.id === 0) {
                res.status(400).json({ success: false, message: "Kreiranje nije uspelo" });
                return;
            }

            res.status(201).json(mountain);
        } catch {
            res.status(500).json({ success: false, message: "Greska na server" });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}