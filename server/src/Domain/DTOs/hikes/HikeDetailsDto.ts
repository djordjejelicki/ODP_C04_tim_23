import { HikeParticipantDetailsDto } from "./HikeParticipantDetailsDto";

export class HikeDetailsDto {
    public constructor(
        public id: number = 0,
        public organizer_id: number = 0,
        public organizer_username: string = "",
        public trail_id: number = 0,
        public trail_name: string = "",
        public name: string = "",
        public description: string | null = null,
        public scheduled_at: Date | null = null,
        public max_participants: number = 0,
        public participants: HikeParticipantDetailsDto[] = []
    ){}
}