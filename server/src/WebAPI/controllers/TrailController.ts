import { Request, Response, Router } from "express";
import { ITrailService } from "../../Domain/services/trails/ITrailService"; 
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { validateTrail } from "../validators/TrailValidator";
import { TrailDifficulty } from "../../Domain/enums/TrailDifficulty";

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
        this.router.post("/trails",authenticate,authorize(UserRole.ADMIN),this.create.bind(this));
        this.router.put("/trails/:id", authenticate, authorize(UserRole.ADMIN), this.update.bind(this));
        this.router.delete("/trails/:id", authenticate, authorize(UserRole.ADMIN), this.delete.bind(this));
    }

    private async getAll(req: Request, res: Response): Promise<void> {
        try{
            const trails = await this.trailService.getSveRute();
            res.status(200).json(trails);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id as string);
            const trail = await this.trailService.getRutaById(id);

            if (trail.id === 0) {
                res.status(404).json({ success: false, message: "Ruta ne postoji" });
                return;
            }

            res.status(200).json(trail);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async create(req: Request, res: Response): Promise<void> {
        try{
            const {
                mountain_id,
                naziv,
                opis,
                duzina_km,
                tezina,
                trajanje_min,
                visinski_uspon_m,
                slika_url,
                terrain_tag_ids
            } = req.body;

            const result = validateTrail(
                Number(mountain_id),
                naziv,
                opis ?? null,
                Number(duzina_km),
                tezina,
                Number(trajanje_min),
                Number(visinski_uspon_m),
                slika_url,
                Array.isArray(terrain_tag_ids) ? terrain_tag_ids.map(Number) : []
            );

            if (!result.valid){
                res.status(400).json({ success: false, message: result.message });
                return;
            }

            const trail = await this.trailService.createRuta(
                Number(mountain_id),
                naziv,
                opis ?? null,
                Number(duzina_km),
                tezina as TrailDifficulty,
                Number(trajanje_min),
                Number(visinski_uspon_m),
                slika_url,
                Array.isArray(terrain_tag_ids) ? terrain_tag_ids.map(Number) : []
            );

            if (trail.id === 0){
                res.status(400).json({ success: false, message: "Kreiranje nije uspelo" });
                return;
            }

            res.status(201).json(trail);
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async update(req: Request, res: Response): Promise<void> {
        try{
            const id = Number(req.params.id);
            const {
                mountain_id,
                naziv,
                opis,
                duzina_km,
                tezina,
                trajanje_min,
                visinski_uspon_m,
                slika_url,
                terrain_tag_ids
            } = req.body;

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Ruta nije validna" });
                return;
            }

            const terrainIds = Array.isArray(terrain_tag_ids) ? terrain_tag_ids.map(Number) : [];

            const rezultat = validateTrail(
                Number(mountain_id),
                naziv,
                opis ?? null,
                Number(duzina_km),
                tezina,
                Number(trajanje_min),
                Number(visinski_uspon_m),
                slika_url,
                terrainIds
            );

            if (!rezultat.valid) {
                res.status(400).json({ success: false, message: rezultat.message });
                return;
            }

            const uspesno = await this.trailService.updateRuta(
                id,
                Number(mountain_id),
                naziv,
                opis ?? null,
                Number(duzina_km),
                tezina as TrailDifficulty,
                Number(trajanje_min),
                Number(visinski_uspon_m),
                slika_url,
                terrainIds
            );

            if (!uspesno) {
                res.status(404).json({ success: false, message: "Ruta nije pronadjena ili izmena nije uspela" });
                return;
            }

            res.status(200).json({ success: true, message: "Ruta uspesno izmenjena" });
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async delete(req: Request, res: Response): Promise<void>{
        try{
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Ruta nije validna" });
                return;
            }

            const uspesno = await this.trailService.deleteRuta(id);

            if (!uspesno){
                res.status(400).json({ success: false, message: "Ruta ne moze biti obrisana jer ne postoji ili ima evidentirane uspone"});
                return;
            }

            res.status(200).json({ success: true, message: "Ruta uspesno obrisana"});
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    public getRouter() : Router{
        return this.router;
    }
}