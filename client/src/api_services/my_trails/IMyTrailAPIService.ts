import type { UserTrail, UserTrailStatus } from "../../types/my_trails/UserTrail";

export interface IMyTrailAPIService {
    getAll(): Promise<UserTrail[]>;
    add(trail_id: number, status: UserTrailStatus): Promise<boolean>;
    updateStatus(trail_id: number, status: UserTrailStatus): Promise<boolean>;
    remove(trail_id: number): Promise<boolean>;
}