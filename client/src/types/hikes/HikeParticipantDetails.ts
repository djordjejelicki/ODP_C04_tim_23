import type { HikeParticipantStatus } from "./HikeParticipant";

export type HikeParticipantDetials = {
    user_id: number;
    username: string;
    status: HikeParticipantStatus;
    responded_at: string | null;
};