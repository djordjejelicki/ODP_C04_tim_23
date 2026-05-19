export type TrailDifficulty = 
    | "easy"
    | "moderate"
    | "hard"
    | "expert";

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
    created_at: string | null;
    average_rating: number | null;
};