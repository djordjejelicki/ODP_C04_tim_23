import { apiClient } from "../apiClient";
import type { IMyTrailAPIService } from "./IMyTrailAPIService";
import type { UserTrailStatus } from "../../types/my_trails/UserTrailStatus";
import type { UserTrailDetails } from "../../types/my_trails/UserTrailDetails";
import type { ApiResponse } from "../../types/common/ApiResponse";
import axios from "axios";

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
    async add(trail_id: number, status: UserTrailStatus): Promise<ApiResponse> {
        try{
            const res = await apiClient.post<ApiResponse>("my-trails", {trail_id, status});
            return res.data;
        } catch(error){
            let message = "Failed to add trail to your list";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message;
            }

            return {
                success: false,
                message
            };
        }
    },
    async updateStatus(trail_id: number, status: UserTrailStatus): Promise<ApiResponse> {
        try{
            const res = await apiClient.patch<ApiResponse>(`my-trails/${trail_id}/status`, {status});
            return res.data;
        } catch(error){
            let message = "Failed to update trail status";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message;
            }

            return {
                success: false,
                message
            };
        }
    },
    async remove(trail_id: number): Promise<ApiResponse> {
        try{
            const res = await apiClient.delete<ApiResponse>(`my-trails/${trail_id}`);
            return res.data;
        } catch(error){
          let message = "Failed to remove trail from your list";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message;
            }

            return {
                success: false,
                message
            };
        }
    }
}