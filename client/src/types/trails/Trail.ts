import type { TerrainTag } from "../terrain_tags/TerrainTag";
import type { TrailDifficulty } from "./TrailDifficulty";

export type Trail = {
    id: number;
    mountain_id: number;
    name: string;
    description: string;
    length_km: number;
    difficulty: TrailDifficulty;
    est_duration_min: number;
    elevation_m: number;
    image_url: string;
    created_at: string;
    average_rating: number;
    terrain_tags: TerrainTag[];
};