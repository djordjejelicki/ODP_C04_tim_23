export const USER_TRAIL_STATUS = {
    WANT_TO_HIKE: "want_to_hike",
    COMPLETED: "completed"
} as const;

export type UserTrailStatus =  typeof USER_TRAIL_STATUS[keyof typeof USER_TRAIL_STATUS];