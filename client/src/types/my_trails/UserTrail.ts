export type UserTrailStatus = "want_to_hike" | "completed";

export type UserTrail = {
    user_id: number;
    trail_id: number;
    status: UserTrailStatus;
    added_at: string | null;
};