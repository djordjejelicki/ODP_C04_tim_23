import type { HikeParticipantStatus } from "./HikeParticipantStatus";

export type HikeParticipantDetials = {
    user_id: number;
    username: string;
    status: HikeParticipantStatus;
    responded_at: string | null;
};