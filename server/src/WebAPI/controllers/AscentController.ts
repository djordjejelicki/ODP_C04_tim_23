import { Request, Response, Router } from "express";
import { IAscentService } from "../../Domain/services/acents/IAscentServuce";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { validateAscent } from "../validators/ascentValidator";

export class AscentController {
    private router: Router;
    private ascentService: IAscentService;

    constructor(ascentService: IAscentService){
        this.router = Router();
        this.ascentService = ascentService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/ascents", authenticate, this.getMine.bind(this));
        this.router.post("/ascents", authenticate, this.create.bind(this));
        this.router.get("/ascents/:id", authenticate, this.getById.bind(this));
        this.router.put("/ascents/:id", authenticate, this.update.bind(this));
        this.router.delete("/ascents/:id", authenticate, this.delete.bind(this));
    }

    private async getMine(req: Request, res: Response): Promise<void>{
        try{
            const userId = req.user?.id;

            if (!userId){
                res.status(401).json({ success: false, message: "Neautorizovan pristup" });
                return;
            }

            const usponi = await this.ascentService.getDetaljiMojihUspona(userId);
            res.status(200).json(usponi);
        } catch{
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async create(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const {trail_id, ascent_date, duration_min, note, rating} = req.body;

            if (!userId){
                res.status(401).json({ success: false, message: "Neautorizovan pristup" });
                return;
            }

            const rezultat = validateAscent(
                Number(trail_id),
                ascent_date,
                Number(duration_min),
                note ?? null,
                Number(rating)
            );

            if (!rezultat.valid){
                res.status(400).json({ success: false, message: rezultat.message });
                return;
            }

            const uspon = await this.ascentService.dodajUspon(
                userId,
                Number(trail_id),
                new Date(ascent_date),
                Number(duration_min),
                note ?? null,
                Number(rating)
            );

            if (uspon.id === 0){
                res.status(400).json({ success: false, message: "Uspon nije moguce evidentirati. Ruta mora biti na vasoj listi" });
                return;
            }

            res.status(201).json(uspon);
        } catch{
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async getById(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const id = Number(req.params.id);

            if (!userId){
                res.status(401).json({ success: false, message: "Neautorizovan pristup" });
                return;
            }

            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ success: false, message: "Uspon nije validan" });
                return;
            }

            const uspon = await this.ascentService.getUsponById(id);

            if (uspon.id === 0 || uspon.user_id !== userId){
                res.status(404).json({ success: false, message: "Uspon nije pronadjen" });
                return;
            }

            res.status(200).json(uspon);
        } catch{
            res.status(500).json({ success: false, message: "Greska na serveru"});
        }
    }

    private async update(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const id = Number(req.params.id);
            const {ascent_date, duration_min, note, rating, trail_id} = req.body;

            if (!userId){
                res.status(401).json({ success: false, message: "Neautorizovan pristup" });
                return;
            }

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Uspon nije validan" });
                return;
            }

            const rezultat = validateAscent(
                Number(trail_id ?? 1),
                ascent_date,
                Number(duration_min),
                note ?? null,
                Number(rating)
            );

            if (!rezultat.valid){
                res.status(400).json({ success: false, message: rezultat.message });
                return;
            }

            const uspesno = await this.ascentService.izmeniUspon(
                userId,
                id,
                new Date(ascent_date),
                Number(duration_min),
                note ?? null,
                Number(rating)
            );

            if (!uspesno) {
                res.status(404).json({ success: false, message: "Uspon nije Pronadjen" });
                return;
            }

            res.status(200).json({ success: true, message: "Uspon uspesno izmenjen" });
        } catch{
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    private async delete(req: Request, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            const id = Number(req.params.id);

            if (!userId){
                res.status(401).json({ success: false, message: "Neautorizovan pristup" });
                return;
            }

            if (!Number.isInteger(id) || id <= 0){
                res.status(400).json({ success: false, message: "Uspon nije validan" });
                return;
            }

            const uspesno = await this.ascentService.obrisiUspon(userId, id);

            if (!uspesno){
                res.status(404).json({ success: false, message: "Uspon nije pronadjen" });
            }

            res.status(200).json({ success: true, message: "Uspon uspesno obrisan" });
        } catch {
            res.status(500).json({ success: false, message: "Greska na serveru" });
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}