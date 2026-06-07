import { apiClient } from "../apiClient";
import type { IHikeAPIService } from "./IHikeAPIService";
import type { HikeParticipantStatus } from "../../types/hikes/HikeParticipant";
import type { HikeWithUserStatus } from "../../types/hikes/HikeWithUserStatus";
import type { HikeDetails } from "../../types/hikes/HikeDetails";
import type { ApiResponse } from "../../types/common/ApiResponse";
import type { Hike } from "../../types/hikes/Hike";
import axios from "axios";

export const hikeApi: IHikeAPIService = {
    async getAll(): Promise<HikeWithUserStatus[]> {
        try{
            const res = await apiClient.get<HikeWithUserStatus[]>("hikes");
            return res.data;
        } catch(error){
            console.error("Error loading hikes: ", error);
            return [];
        }
    },

    async create(
        trail_id: number, 
        name: string, 
        description: string | null, 
        scheduled_at: string, 
        max_participants: number
    ): Promise<ApiResponse<Hike>> {
        try{
            const res = await apiClient.post<ApiResponse<Hike>>("hikes", {
                trail_id,
                name,
                description,
                scheduled_at,
                max_participants
            });
            return res.data;
        } catch(error){
            let message = "Failed to create hike";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message
            }

            return {
                success: false,
                message,
                data: null
            };
        }
    },

    async invite(hike_id: number, username: string): Promise<ApiResponse> {
        try{
            const res = await apiClient.post<ApiResponse>(`hikes/${hike_id}/invite`, {username});
            return res.data;
        } catch(error){
            let message = "Failed to invite participant";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message
            }

            return {
                success: false,
                message,
                data: null
            };
        }
    },

    async respond(hike_id: number, status: HikeParticipantStatus): Promise<ApiResponse> {
        try{
            const res = await apiClient.patch<ApiResponse>(`hikes/${hike_id}/respond`, {status});
            return res.data;
        } catch(error){
            let message = "Failed to respond to invite";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message
            }

            return {
                success: false,
                message,
                data: null
            };
        }
    },

    async getById(id: number): Promise<HikeDetails | null> {
        try{
            const res = await apiClient.get<HikeDetails>(`hikes/${id}`);
            return res.data;
        } catch(error){
            console.error("Error loading hike details: ", error);
            return null;
        }
    },

    async update(
        id: number, 
        trail_id: number, 
        name: string, 
        description: string | null, 
        scheduled_at: string, 
        max_participants: number
    ): Promise<ApiResponse> {
        try{
            const res = await apiClient.put<ApiResponse>(`hikes/${id}`,{
                trail_id,
                name,
                description,
                scheduled_at,
                max_participants
            });
            return res.data;
        } catch(error){
            let message = "Failed to update hike";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message
            }

            return {
                success: false,
                message,
                data: null
            };
        }
    },

    async cancel(id: number): Promise<ApiResponse> {
        try{
            const res = await apiClient.delete<ApiResponse>(`hikes/${id}`);
            return res.data;
        } catch(error){
            let message = "Failed to cancel hike";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message
            }

            return {
                success: false,
                message,
                data: null
            };
        }
    },

    async removeParticipant(hike_id: number, user_id: number): Promise<ApiResponse> {
        try{
            const res = await apiClient.delete<ApiResponse>(`hikes/${hike_id}/participants/${user_id}`);
            return res.data;
        } catch(error){
            let message = "Failed to remove participant from hike";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message
            }

            return {
                success: false,
                message,
                data: null
            };
        }
    },
};