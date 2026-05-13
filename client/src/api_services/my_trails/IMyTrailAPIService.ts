import type { UserTrail, UserTrailStatus } from "../../types/my_trails/UserTrail";
import type { UserTrailDetails } from "../../types/my_trails/UserTrailDetails";

export interface IMyTrailAPIService {
    getAll(): Promise<UserTrailDetails[]>;
    add(trail_id: number, status: UserTrailStatus): Promise<boolean>;
    updateStatus(trail_id: number, status: UserTrailStatus): Promise<boolean>;
    remove(trail_id: number): Promise<boolean>;
}