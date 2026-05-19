export class DashBoardStatsDto {
    public constructor(
        public total_completed_trails: number = 0,
        public total_distance_km: number = 0,
        public total_elevation_m: number = 0,
        public favorite_mountain: string | null = null
    ) {}
}