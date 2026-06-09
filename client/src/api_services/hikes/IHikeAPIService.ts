import type { HikeParticipantStatus } from "../../types/hikes/HikeParticipantStatus";
import type { HikeWithUserStatus } from "../../types/hikes/HikeWithUserStatus";
import type { HikeDetails } from "../../types/hikes/HikeDetails";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IHikeAPIService {
    getAll(): Promise<HikeWithUserStatus[]>;
    getById(id: number): Promise<HikeDetails>;
    create(
        trail_id: number,
        name: string,
        description: string,
        scheduled_at: string,
        max_participants: number
    ): Promise<ApiResponse>;
    invite(hike_id: number, username: string): Promise<ApiResponse>;
    respond(hike_id: number, status: HikeParticipantStatus): Promise<ApiResponse>;
    update(
        id: number,
        trail_id: number,
        name: string,
        description: string,
        scheduled_at: string,
        max_participants: number
    ): Promise<ApiResponse>;
    cancel(id: number): Promise<ApiResponse>;
    removeParticipant(hike_id: number, user_id: number): Promise<ApiResponse>;

}