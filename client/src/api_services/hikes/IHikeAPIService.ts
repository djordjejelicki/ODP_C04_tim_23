import type { HikeParticipantStatus } from "../../types/hikes/HikeParticipant";
import type { HikeWithUserStatus } from "../../types/hikes/HikeWithUserStatus";
import type { HikeDetails } from "../../types/hikes/HikeDetails";

export interface IHikeAPIService {
    getAll(): Promise<HikeWithUserStatus[]>;
    getById(id: number): Promise<HikeDetails | null>;
    create(
        trail_id: number,
        name: string,
        description: string | null,
        scheduled_at: string,
        max_participants: number
    ): Promise<boolean>;
    invite(hike_id: number, username: string): Promise<boolean>;
    respond(hike_id: number, status: HikeParticipantStatus): Promise<boolean>;
    update(
        id: number,
        trail_id: number,
        name: string,
        description: string | null,
        scheduled_at: string,
        max_participants: number
    ): Promise<boolean>;
    cancel(id: number): Promise<boolean>;
    removeParticipant(hike_id: number, user_id: number): Promise<boolean>;

}