import type { Hike } from "../../types/hikes/Hike";
import type { HikeParticipantStatus } from "../../types/hikes/HikeParticipant";

export interface IHikeAPIService {
    getAll(): Promise<Hike[]>;
    create(
        trail_id: number,
        name: string,
        description: string | null,
        scheduled_at: string,
        max_participants: number
    ): Promise<boolean>;
    invite(hike_id: number, user_id: number): Promise<boolean>;
    respond(hike_id: number, status: HikeParticipantStatus): Promise<boolean>;
}