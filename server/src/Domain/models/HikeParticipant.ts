import { HikeParticipantStatus } from "../enums/HikeParticipantStatus";

export class HikeParticipant {
    public constructor(
        public hike_id: number = 0,
        public user_id: number = 0,
        public status: HikeParticipantStatus = HikeParticipantStatus.INVITED,
        public responded_at: Date = new Date()
    ){}
}