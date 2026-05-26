import { Hike } from "../../models/Hike";
import { HikeParticipant } from "../../models/HikeParticipant";
import { HikeParticipantStatus } from "../../enums/HikeParticipantStatus";
import { HikeWithUserStatusDto } from "../../DTOs/hikes/HikeWithUserStatusDto";
import { HikeDetailsDto } from "../../DTOs/hikes/HikeDetailsDto";

export interface IHikeService {
    getSviPohodi(): Promise<Hike[]>;
    getPohodiZaKorisnika(userId: number): Promise<HikeWithUserStatusDto[]>;
    korisnikImaPristupPohodu(hikeId: number, userId: number): Promise<boolean>;
    getPohodById(id: number): Promise<Hike>;
    kreirajPohod(
        organizer_id: number,
        trail_id: number,
        name: string,
        description: string | null,
        scheduled_at: Date,
        max_participants: number
    ): Promise<Hike>;
    pozoviUcesnika(hike_id: number, organizer_id: number, username: string): Promise<boolean>;
    odgovoriNaPoziv(
        hike_id: number,
        user_id: number,
        status: HikeParticipantStatus
    ): Promise<boolean>;
    getUcesnici(hike_id: number): Promise<HikeParticipant[]>;
    getDetaljiPohoda(hike_id: number): Promise<HikeDetailsDto>;
    izmeniPohod(
        id: number,
        organizer_id: number,
        trail_id: number,
        name: string,
        description: string | null,
        scheduled_at: Date,
        max_participants: number
    ): Promise<boolean>;
    otkaziPohod(id: number, organizer_id: number): Promise<boolean>;
    ukloniUcesnika(hike_id: number, organizer_id: number, user_id: number): Promise<boolean>;

}