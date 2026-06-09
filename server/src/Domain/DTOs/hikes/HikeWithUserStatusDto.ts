import { HikeParticipantStatus } from "../../enums/HikeParticipantStatus";

export class HikeWithUserStatusDto {
   public constructor(
        public id: number = 0,
        public organizer_id: number = 0,
        public trail_id: number = 0,
        public trail_name: string = "",
        public name: string = "",
        public description: string = "",
        public scheduled_at: Date =  new Date(),
        public max_participants: number = 0,
        public current_user_status: HikeParticipantStatus = HikeParticipantStatus.NONE,
        public is_organizer: boolean = false
   ){}
}