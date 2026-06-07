import type { Trail, TrailDifficulty } from "../../types/trails/Trail";
import type { TrailDetails } from "../../types/trails/TrailDetails";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface ITrailAPIService {
    getAll(): Promise<Trail[]>;
    getById(id: number): Promise<TrailDetails | null>;
    create(
        mountain_id: number,
        name: string,
        description: string | null,
        length_km: number,
        difficulty: TrailDifficulty,
        est_duration_min: number,
        elevation_m: number,
        image: File | null,
        terrain_tag_ids: number[]
    ): Promise<ApiResponse<Trail>>;
    update(
        id: number,
        mountain_id: number,
        name: string,
        description: string | null,
        length_km: number,
        difficulty: TrailDifficulty,
        est_duration_min: number,
        elevation_m: number,
        image: File | null,
        image_url: string,
        terrain_tag_ids: number[]
    ): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
}