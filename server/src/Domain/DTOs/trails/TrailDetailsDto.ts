import { TerrainTag } from "../../models/TerrainTag";
import { TrailDifficulty } from "../../enums/TrailDifficulty";

export class TrailDetailsDto {
    public constructor (
        public id: number = 0,
        public mountain_id: number = 0,
        public naziv: string = '',
        public opis: string | null = null,
        public duzina_km: number = 0,
        public tezina: TrailDifficulty = TrailDifficulty.EASY,
        public trajanje_min: number = 0,
        public visinski_uspon_m: number = 0,
        public slika_url: string = '',
        public created_at: Date | null = null,
        public terrain_tags: TerrainTag[] = []
    ) {}
}