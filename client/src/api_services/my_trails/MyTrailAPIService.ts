import { apiClient } from "../apiClient";
import type { IMyTrailAPIService } from "./IMyTrailAPIService";
import type { UserTrail, UserTrailStatus } from "../../types/my_trails/UserTrail";
import type { UserTrailDetails } from "../../types/my_trails/UserTrailDetails";

export const myTrailApi: IMyTrailAPIService = {
    async getAll(): Promise<UserTrailDetails[]> {
        try{
            const res = await apiClient.get<UserTrailDetails[]>("my-trails");
            return res.data;
        } catch(error){
            console.error("Error loading my trails: ", error);
            return [];
        }
    },
    async add(trail_id: number, status: UserTrailStatus): Promise<boolean> {
        try{
            await apiClient.post("my-trails", {trail_id, status});
            return true;
        } catch(error){
            console.error("Error adding trail to list: ", error);
            return false;
        }
    },
    async updateStatus(trail_id: number, status: UserTrailStatus): Promise<boolean> {
        try{
            await apiClient.patch(`my-trails/${trail_id}/status`, {status});
            return true;
        } catch(error){
            console.error("Error updating trail status: ", error);
            return false;
        }
    },
    async remove(trail_id: number): Promise<boolean> {
        try{
            await apiClient.delete(`my-trails/${trail_id}`);
            return true;
        } catch(error){
            console.error("Error removing trail from list: ", error);
            return false;
        }
    }
}