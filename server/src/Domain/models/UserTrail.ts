import { UserTrailStatus } from "../enums/UserTrailStatus";

export class UserTrail {
    public constructor(
        public user_id: number = 0,
        public trail_id: number = 0,
        public status: UserTrailStatus = UserTrailStatus.WANT_TO_HIKE,
        public added_at: Date | null = null
    ){}
}