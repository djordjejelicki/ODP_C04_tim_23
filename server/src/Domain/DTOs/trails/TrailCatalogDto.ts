import { TrailDifficulty } from "../../enums/TrailDifficulty";
import { TerrainTag } from "../../models/TerrainTag";

export class TrailCatalogDto {
    public constructor(
        public id: number = 0,
        public mountain_id: number = 0,
        public name: string = "",
        public description: string = "",
        public length_km:  number = 0,
        public difficulty: TrailDifficulty = TrailDifficulty.EASY,
        public est_duration_min: number = 0,
        public elevation_m: number = 0,
        public image_url: string = "",
        public created_at: Date = new Date(),
        public average_rating: number = 0,
        public terrain_tags: TerrainTag[] = []
    ) {}
}