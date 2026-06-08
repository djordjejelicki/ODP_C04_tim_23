import { TrailCatalogDto } from "../../DTOs/trails/TrailCatalogDto";
import { Trail } from "../../models/Trail";
import { TrailDetailsDto } from "../../DTOs/trails/TrailDetailsDto";    
import { TrailDifficulty } from "../../enums/TrailDifficulty";
import { ServiceResult } from "../../common/ServiceResult";

export interface ITrailService {
    getSveRute(): Promise<TrailCatalogDto[]>;
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
    ): Promise<ServiceResult>;
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
    ): Promise<ServiceResult>;  
    deleteRuta(id: number): Promise<ServiceResult>;
}