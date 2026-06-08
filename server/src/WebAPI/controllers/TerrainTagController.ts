import { Request, Response, Router } from "express";
import { ITerrrainTagService } from "../../Domain/services/terrainTags/ITerrainTagService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";

export class TerrainTagController {
    private router: Router;
    private terrainTagService : ITerrrainTagService;

    constructor(terrainTagService : ITerrrainTagService){
        this.router = Router();
        this.terrainTagService = terrainTagService;
        this.intializeRoutes();  
    }

    private intializeRoutes() : void {
        this.router.get("/terrain-tags", this.getAll.bind(this));
        this.router.get("/terrain-tags/:id", this.getById.bind(this));
        this.router.post("/terrain-tags", authenticate, authorize(UserRole.ADMIN), this.create.bind(this));
        this.router.delete("/terrain-tags/:id", authenticate, authorize(UserRole.ADMIN), this.delete.bind(this));
    }

    private async getAll(req: Request, res: Response) : Promise<void> {
        try{
            const tags = await this.terrainTagService.getSviTipoviTerena();
            res.status(200).json(tags);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try{
           const id = parseInt(req.params.id as string);
           const tag = await this.terrainTagService.getTipTerenaById(id);
           
           if (tag.id === 0){
            res.status(404).json({ success: false, message: "Terrain tag not found"});
            return;
           }

           res.status(200).json(tag);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async create(req: Request, res: Response) : Promise<void> {
        try{
            const {name, description} = req.body;

            const result = await this.terrainTagService.createTipTerena(name, description ?? null);

            if (!result.success){
                res.status(400).json(result);
                return;
            }

            res.status(201).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    private async delete(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Invalid terrain tag id"});
                return;
            }

            const result = await this.terrainTagService.obrisiTipTerena(id);

            if (!result.success){
                res.status(400).json(result);
                return;
            }

            res.status(200).json(result);
        } catch {
            res.status(500).json({ success: false, message: "Internal server error"});
        }
    }

    public getRouter() : Router {
        return this.router;
    }
}