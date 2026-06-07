import type { HikeParticipantStatus } from "./HikeParticipantStatus";

export type HikeWithUserStatus = {
    id: number;
    organizer_id: number;
    trail_id: number;
    trail_name: string;
    name: string;
    description: string | null;
    scheduled_at: string;
    max_participants: number;
    current_user_status: HikeParticipantStatus | null;
};