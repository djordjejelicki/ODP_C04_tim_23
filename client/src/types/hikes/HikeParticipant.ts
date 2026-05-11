export type HikeParticipantStatus = "invited" | "confirmed" | "declined";

export type HikePartipant = {
    hike_id: number;
    user_id: number;
    status: HikeParticipantStatus;
    responded_at: string | null;
};