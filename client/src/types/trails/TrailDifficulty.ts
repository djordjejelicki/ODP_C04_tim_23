export const TRAIL_DIFFICULTIES = [
    "easy",
    "moderate",
    "hard",
    "expert"
] as const;

export type TrailDifficulty = typeof TRAIL_DIFFICULTIES[number];