import type { UserTrailStatus } from "./UserTrailStatus";

export type UserTrail = {
    user_id: number;
    trail_id: number;
    status: UserTrailStatus;
    added_at: string | null;
};