import { Trail } from "../../models/Trail";
import { TrailDetailsDto } from "../../DTOs/trails/TrailDetailsDto";    
import { TrailDifficulty } from "../../enums/TrailDifficulty";

export interface ITrailService {
    getSveRute(): Promise<Trail[]>;
    getRutaById(id: number): Promise<TrailDetailsDto>;
    createRuta(
        mountain_id: number,
        naziv: string,
        opis: string | null,
        duzina_km: number,
        tezina: TrailDifficulty,
        trajanje_min: number,
        visinski_uspon_m: number,
        slika_url: string,
        terrain_tag_ids: number[]
    ): Promise<Trail>;  
}