import { HikeParticipantStatus } from "../../enums/HikeParticipantStatus";

export class HikeParticipantDetailsDto {
    public constructor(
        public user_id: number = 0,
        public username: string = "",
        public status: HikeParticipantStatus = HikeParticipantStatus.INVITED,
        public responded_at: Date | null = null
    ) {}
}