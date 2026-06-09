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
        this.router.delete("/mountains/:id", authenticate, authorize(UserRole.ADMIN), this.delete.bind(this));
    }
    
    private async getAll(req: Request, res: Response): Promise<void> {
        try {
            const mountains = await this.mountainService.getSvePlanine();
            res.status(200).json(mountains);
        } catch (error) {
            res.status(500).json({success: false, message: "Internal server error"});
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id as string);
            const mountain = await this.mountainService.getPlaninaById(id);

            if (mountain.id === 0){
                res.status(404).json({ success: false, message: "Mountain not found"});
                return;
            }

            res.status(200).json(mountain);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async create(req: Request, res: Response) : Promise<void> {
        try{
            const {name, country, region, height, description} = req.body;

            const rezultat = validateMountain(
                name,
                country,
                region ?? "",
                Number(height),
                description ?? ""
            );

            if (!rezultat.valid) {
                res.status(400).json( {success: false, message: rezultat.message});
                return;
            }

            const result = await this.mountainService.createPlanina(
                name,
                country,
                region ?? "",
                Number(height),
                description ?? ""
            );

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(201).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async update(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);
            const {name, country, region, height, description} = req.body;

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Invalid mountain id"});
                return;
            }

            const rezultat = validateMountain(
                name,
                country,
                region ?? "",
                Number(height),
                description ?? ""
            );

            if (!rezultat.valid){
                res.status(400).json({ success: false, message: rezultat.message});
                return;
            }

            const result = await this.mountainService.updatePlanina(
                id,
                name,
                country,
                region ?? "",
                Number(height),
                description ?? ""
            );

            if (!result.success){
                res.status(400).json(result);
                return;
            }

            res.status(200).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async delete(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Invalid mountain id"});
                return;
            }

            const result = await this.mountainService.deletePlanina(id);

            if (!result.success){
                res.status(400).json(result);
                return;
            }

            res.status(200).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}