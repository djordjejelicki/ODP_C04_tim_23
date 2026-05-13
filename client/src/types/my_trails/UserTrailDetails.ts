import type { UserTrailStatus } from "./UserTrail";

export type TrailDifficulty = 
            | "easy"
            | "moderate"
            | "hard"
            | "expert";

export type UserTrailDetails = {
    user_id: number;
    trail_id: number;
    status: UserTrailStatus;
    added_at: string | null;
    trail_name: string;
    length_km: number;
    elevation_m: number;
    difficulty: TrailDifficulty;
};