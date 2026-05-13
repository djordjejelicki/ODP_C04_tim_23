import type { HikeParticipantStatus } from "../../types/hikes/HikeParticipant";
import type { HikeWithUserStatus } from "../../types/hikes/HikeWithUserStatus";

export interface IHikeAPIService {
    getAll(): Promise<HikeWithUserStatus[]>;
    create(
        trail_id: number,
        name: string,
        description: string | null,
        scheduled_at: string,
        max_participants: number
    ): Promise<boolean>;
    invite(hike_id: number, username: string): Promise<boolean>;
    respond(hike_id: number, status: HikeParticipantStatus): Promise<boolean>;
}