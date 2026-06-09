import type { HikeParticipantDetials } from "./HikeParticipantDetails";

export type HikeDetails = {
    id: number;
    organizer_id: number;
    organizer_username: string;
    trail_id: number;
    trail_name: string;
    name: string;
    description: string;
    scheduled_at: string;
    max_participants: number;
    participants: HikeParticipantDetials[];
};