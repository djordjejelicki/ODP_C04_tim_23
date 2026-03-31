import { Request, Response, Router } from "express";
import { ITerrrainTagService } from "../../Domain/services/terrainTags/ITerrainTagService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { TerrainTagService } from "../../Services/terrainTags/TerrainTagService";
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
    }

    private async getAll(req: Request, res: Response) : Promise<void> {
        try{
            const tags = await this.terrainTagService.getSviTipoviTerena();
            res.status(200).json(tags);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru"});
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try{
           const id = parseInt(req.params.id as string);
           const tag = await this.terrainTagService.getTipTerenaById(id);
           
           if (tag.id === 0){
            res.status(404).json({ success: false, message: "Tip terena ne postoji" });
            return;
           }

           res.status(200).json(tag);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async create(req: Request, res: Response) : Promise<void> {
        try{
            const {naziv, opis} = req.body;

            const tag = await this.terrainTagService.createTipTerena(naziv, opis ?? null);

            if (tag.id === 0){
                res.status(400).json({ success: false, message: "Kreiranje nije uspelo" });
                return;
            }

            res.status(201).json(tag);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru"});
        }
    }

    public getRouter() : Router {
        return this.router;
    }
}