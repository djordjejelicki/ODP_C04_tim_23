import type { HikeParticipantStatus } from "./HikeParticipantStatus";

export type HikeWithUserStatus = {
    id: number;
    organizer_id: number;
    trail_id: number;
    trail_name: string;
    name: string;
    description: string;
    scheduled_at: string;
    max_participants: number;
    current_user_status: HikeParticipantStatus;
    is_organizer: boolean
};