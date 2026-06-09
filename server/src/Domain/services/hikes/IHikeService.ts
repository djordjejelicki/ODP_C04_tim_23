import { Hike } from "../../models/Hike";
import { HikeParticipant } from "../../models/HikeParticipant";
import { HikeParticipantStatus } from "../../enums/HikeParticipantStatus";
import { HikeWithUserStatusDto } from "../../DTOs/hikes/HikeWithUserStatusDto";
import { HikeDetailsDto } from "../../DTOs/hikes/HikeDetailsDto";
import { ServiceResult } from "../../common/ServiceResult";


export interface IHikeService {
    getSviPohodi(): Promise<Hike[]>;
    getPohodiZaKorisnika(userId: number): Promise<HikeWithUserStatusDto[]>;
    korisnikImaPristupPohodu(hikeId: number, userId: number): Promise<boolean>;
    getPohodById(id: number): Promise<Hike>;
    kreirajPohod(
        organizer_id: number,
        trail_id: number,
        name: string,
        description: string,
        scheduled_at: Date,
        max_participants: number
    ): Promise<ServiceResult>;
    pozoviUcesnika(hike_id: number, organizer_id: number, username: string): Promise<ServiceResult>;
    odgovoriNaPoziv(
        hike_id: number,
        user_id: number,
        status: HikeParticipantStatus
    ): Promise<ServiceResult>;
    getUcesnici(hike_id: number): Promise<HikeParticipant[]>;
    getDetaljiPohoda(hike_id: number): Promise<HikeDetailsDto>;
    izmeniPohod(
        id: number,
        organizer_id: number,
        trail_id: number,
        name: string,
        description: string,
        scheduled_at: Date,
        max_participants: number
    ): Promise<ServiceResult>;
    otkaziPohod(id: number, organizer_id: number): Promise<ServiceResult>;
    ukloniUcesnika(hike_id: number, organizer_id: number, user_id: number): Promise<ServiceResult>;

}