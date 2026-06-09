import { UserTrailStatus } from "../../enums/UserTrailStatus";
import { TrailDifficulty } from "../../enums/TrailDifficulty";

export class UserTrailDetailsDto {
    public constructor(
        public user_id: number = 0,
        public trail_id: number = 0,
        public status: UserTrailStatus = UserTrailStatus.WANT_TO_HIKE,
        public added_at: Date =  new Date(),
        public trail_name: string = "",
        public length_km: number = 0,
        public elevation_m: number = 0,
        public difficulty: TrailDifficulty = TrailDifficulty.EASY,
        public mountain_id: number = 0,
        public mountain_name: string = ""
    ){}
}