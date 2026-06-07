import type { HikeParticipantStatus } from "../../types/hikes/HikeParticipant";
import type { HikeWithUserStatus } from "../../types/hikes/HikeWithUserStatus";
import type { HikeDetails } from "../../types/hikes/HikeDetails";
import type { Hike } from "../../types/hikes/Hike";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IHikeAPIService {
    getAll(): Promise<HikeWithUserStatus[]>;
    getById(id: number): Promise<HikeDetails | null>;
    create(
        trail_id: number,
        name: string,
        description: string | null,
        scheduled_at: string,
        max_participants: number
    ): Promise<ApiResponse<Hike>>;
    invite(hike_id: number, username: string): Promise<ApiResponse>;
    respond(hike_id: number, status: HikeParticipantStatus): Promise<ApiResponse>;
    update(
        id: number,
        trail_id: number,
        name: string,
        description: string | null,
        scheduled_at: string,
        max_participants: number
    ): Promise<ApiResponse>;
    cancel(id: number): Promise<ApiResponse>;
    removeParticipant(hike_id: number, user_id: number): Promise<ApiResponse>;

}