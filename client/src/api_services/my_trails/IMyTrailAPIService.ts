import type { UserTrail, UserTrailStatus } from "../../types/my_trails/UserTrail";
import type { UserTrailDetails } from "../../types/my_trails/UserTrailDetails";
import type { ApiResponse } from "../../types/common/ApiResponse";

export interface IMyTrailAPIService {
    getAll(): Promise<UserTrailDetails[]>;
    add(trail_id: number, status: UserTrailStatus): Promise<ApiResponse<UserTrail>>;
    updateStatus(trail_id: number, status: UserTrailStatus): Promise<ApiResponse>;
    remove(trail_id: number): Promise<ApiResponse>;
}