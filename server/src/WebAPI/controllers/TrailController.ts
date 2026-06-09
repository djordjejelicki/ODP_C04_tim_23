import { Request, Response, Router } from "express";
import { ITrailService } from "../../Domain/services/trails/ITrailService"; 
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { validateTrail } from "../validators/TrailValidator";
import { TrailDifficulty } from "../../Domain/enums/TrailDifficulty";
import { uploadTrailImage } from "../../Middlewares/uploads/UploadTrailImageMiddleware";

export class TrailController {
    private router: Router;
    private trailService: ITrailService;

    constructor(trailService: ITrailService){
        this.router = Router();
        this.trailService = trailService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/trails", this.getAll.bind(this));
        this.router.get("/trails/:id", this.getById.bind(this));
        this.router.post("/trails",authenticate,authorize(UserRole.ADMIN), uploadTrailImage.single("image"), this.create.bind(this));
        this.router.put("/trails/:id", authenticate, authorize(UserRole.ADMIN), uploadTrailImage.single("image"), this.update.bind(this));
        this.router.delete("/trails/:id", authenticate, authorize(UserRole.ADMIN), this.delete.bind(this));
    }

    private async getAll(req: Request, res: Response): Promise<void> {
        try{
            const trails = await this.trailService.getSveRute();
            res.status(200).json(trails);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id as string);
            const trail = await this.trailService.getRutaById(id);

            if (trail.id === 0) {
                res.status(404).json({ success: false, message: "Trail not found"});
                return;
            }

            res.status(200).json(trail);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async create(req: Request, res: Response): Promise<void> {
        try{
            const {
                mountain_id,
                name,
                description,
                length_km,
                difficulty,
                est_duration_min,
                elevation_m,
                terrain_tag_ids
            } = req.body;

            const imageUrl = req.file ? `/uploads/trails/${req.file.filename}` : "";

            const terrainIds = Array.isArray(terrain_tag_ids) ? terrain_tag_ids.map(Number) : terrain_tag_ids ? [Number(terrain_tag_ids)] : [];

            const result = validateTrail(
                Number(mountain_id),
                name,
                description ?? "",
                Number(length_km),
                difficulty,
                Number(est_duration_min),
                Number(elevation_m),
                imageUrl,
                terrainIds
            );

            if (!result.valid){
                res.status(400).json({ success: false, message: result.message});
                return;
            }

            const serviceResult = await this.trailService.createRuta(
                Number(mountain_id),
                name,
                description ?? "",
                Number(length_km),
                difficulty as TrailDifficulty,
                Number(est_duration_min),
                Number(elevation_m),
                imageUrl,
                terrainIds
            );

            if (!serviceResult.success){
                res.status(400).json(serviceResult);
                return;
            }

            res.status(201).json(serviceResult);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async update(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);
            const {
                mountain_id,
                name,
                description,
                length_km,
                difficulty,
                est_duration_min,
                elevation_m,
                image_url,
                terrain_tag_ids
            } = req.body;

            
            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Invalid trail id"});
                return;
            }
            
            const imageUrl = req.file ? `/uploads/trails/${req.file.filename}` : image_url;
            const terrainIds = Array.isArray(terrain_tag_ids) ? terrain_tag_ids.map(Number) : terrain_tag_ids ? [Number(terrain_tag_ids)] : [];

            const rezultat = validateTrail(
                Number(mountain_id),
                name,
                description ?? "",
                Number(length_km),
                difficulty,
                Number(est_duration_min),
                Number(elevation_m),
                imageUrl,
                terrainIds
            );

            if (!rezultat.valid) {
                res.status(400).json({ success: false, message: rezultat.message});
                return;
            }

            const result = await this.trailService.updateRuta(
                id,
                Number(mountain_id),
                name,
                description ?? "",
                Number(length_km),
                difficulty as TrailDifficulty,
                Number(est_duration_min),
                Number(elevation_m),
                imageUrl,
                terrainIds
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

    private async delete(req: Request, res: Response): Promise<void>{
        try{
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Invalid trail id"});
                return;
            }

            const result = await this.trailService.deleteRuta(id);

            if (!result.success){
                res.status(400).json(result);
                return;
            }

            res.status(200).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    public getRouter() : Router{
        return this.router;
    }
}