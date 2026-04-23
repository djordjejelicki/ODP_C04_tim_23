import { Request, Response, Router } from "express";
import { IMountainService } from "../../Domain/services/mountains/IMountainService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { validateMountain } from "../validators/mountainValidator";

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
        this.router.post("/mountains", authenticate, authorize(UserRole.ADMIN), this.create.bind(this));
        this.router.put("/mountains/:id", authenticate, authorize(UserRole.ADMIN), this.update.bind(this));
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

            const rezultat = validateMountain(
                naziv,
                drzava,
                region??null,
                Number(visina),
                opis??null
            );

            if (!rezultat.valid) {
                res.status(400).json( {success: false, message: rezultat.message });
                return;
            }

            const mountain = await this.mountainService.createPlanina(
                naziv,
                drzava,
                region ?? null,
                Number(visina),
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

    private async update(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);
            const {naziv, drzava, region, visina, opis} = req.body;

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Planina nije validna" });
                return;
            }

            const rezultat = validateMountain(
                naziv,
                drzava,
                region ?? null,
                Number(visina),
                opis ?? null
            );

            if (!rezultat.valid){
                res.status(400).json({ success: false, message: rezultat.message });
                return;
            }

            const uspesno = await this.mountainService.updatePlanina(
                id,
                naziv,
                drzava,
                region ?? null,
                Number(visina),
                opis ?? null
            );

            if (!uspesno){
                res.status(400).json({ success: false, message: "Planina nije pronadjena ili vec postoji sa tim nazivom" });
                return;
            }

            res.status(200).json({ success: true, message: "Planina uspesno izmenjena" });
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}