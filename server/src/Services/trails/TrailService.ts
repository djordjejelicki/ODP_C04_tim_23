import { Trail } from "../../Domain/models/Trail";
import { ITrailRepository } from "../../Domain/repositories/trails/ITrailRepository";
import { ITrailService } from "../../Domain/services/trails/ITrailService";

export class TrailService implements ITrailService {
    public constructor(private trailRepository: ITrailRepository) {}

    async getSveRute(): Promise<Trail[]> {
        return await this.trailRepository.getAll();
    }

    async getRutaById(id: number): Promise<Trail> {
        return await this.trailRepository.getById(id);
    }

    async createRuta(mountain_id: number, naziv: string, opis: string | null, duzina_km: number, tezina: "easy" | "moderate" | "hard" | "expert", trajanje_min: number, visinski_uspon_m: number, slika_url: string): Promise<Trail> {
        const novaRuta = new Trail(
            0, 
            mountain_id,
            naziv,
            opis,
            duzina_km,
            tezina,
            trajanje_min,
            visinski_uspon_m,
            slika_url,
            null
        );

        return await this.trailRepository.create(novaRuta);
    }
}