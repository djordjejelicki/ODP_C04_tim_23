import { TrailDifficulty } from "../enums/TrailDifficulty";

export class Trail {
  public constructor(
    public id: number = 0,
    public mountain_id: number = 0,
    public name: string = '',
    public description: string | null = null,
    public length_km: number = 0,
    public difficulty: TrailDifficulty = TrailDifficulty.EASY,
    public est_duration_min: number = 0,
    public elevation_m: number = 0,
    public image_url: string = '',
    public created_at: Date | null = null
  ) {}
}