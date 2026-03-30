import { Request, Response, Router } from "express";
import { ITrailService } from "../../Domain/services/trails/ITrailService"; 
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

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
        this.router.post("/trails",authenticate,authorize("admin"),this.create.bind(this));
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
                slika_url
            } = req.body;

            const trail = await this.trailService.createRuta(
                mountain_id,
                naziv,
                opis ?? null,
                duzina_km,
                tezina,
                trajanje_min,
                visinski_uspon_m,
                slika_url
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

    public getRouter() : Router{
        return this.router;
    }
}