import { Trail } from "../../models/Trail";
import { TrailDetailsDto } from "../../DTOs/trails/TrailDetailsDto";    
import { TrailDifficulty } from "../../enums/TrailDifficulty";

export interface ITrailService {
    getSveRute(): Promise<Trail[]>;
    getRutaById(id: number): Promise<TrailDetailsDto>;
    createRuta(
        mountain_id: number,
        name: string,
        description: string | null,
        length_km: number,
        difficulty: TrailDifficulty,
        est_duration_min: number,
        elevation_m: number,
        image_url: string,
        terrain_tag_ids: number[]
    ): Promise<Trail>;
    updateRuta(
        id: number,
        mountain_id: number,
        name: string,
        description: string | null,
        lenght_km: number,
        difficulty: TrailDifficulty,
        est_duration_min: number,
        elevation_m: number,
        image_url: string,
        terrain_tag_ids: number[]
    ): Promise<boolean>;  
    deleteRuta(id: number): Promise<boolean>;
}