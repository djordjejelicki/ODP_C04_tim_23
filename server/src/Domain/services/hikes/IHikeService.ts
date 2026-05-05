import { Hike } from "../../models/Hike";
import { HikeParticipant } from "../../models/HikeParticipant";
import { HikeParticipantStatus } from "../../enums/HikeParticipantStatus";

export interface IHikeService {
    getSviPohodi(): Promise<Hike[]>;
    getPohodById(id: number): Promise<Hike>;
    kreirajPohod(
        organizer_id: number,
        trail_id: number,
        name: string,
        description: string | null,
        scheduled_at: Date,
        max_participants: number
    ): Promise<Hike>;
    pozoviUcesnika(hike_id: number, user_id: number): Promise<boolean>;
    odgovoriNaPoziv(
        hike_id: number,
        user_id: number,
        status: HikeParticipantStatus
    ): Promise<boolean>;
    getUcesnici(hike_id: number): Promise<HikeParticipant[]>;
}