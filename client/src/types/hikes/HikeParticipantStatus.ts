export const HIKE_PARTICIPANT_STATUS = {
    NONE: "none",
    INVITED: "invited",
    CONFIRMED: "confirmed",
    DECLINED: "declined"
} as const;

export type HikeParticipantStatus = typeof HIKE_PARTICIPANT_STATUS[keyof typeof HIKE_PARTICIPANT_STATUS];