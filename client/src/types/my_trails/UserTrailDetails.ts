import type { UserTrailStatus } from "./UserTrailStatus";
import type { TrailDifficulty } from "../trails/TrailDifficulty";

export type UserTrailDetails = {
    user_id: number;
    trail_id: number;
    status: UserTrailStatus;
    added_at: string;
    trail_name: string;
    length_km: number;
    elevation_m: number;
    difficulty: TrailDifficulty;
};