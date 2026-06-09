import { apiClient } from "../apiClient";
import type { IHikeAPIService } from "./IHikeAPIService";
import type { HikeWithUserStatus } from "../../types/hikes/HikeWithUserStatus";
import type { HikeParticipantStatus } from "../../types/hikes/HikeParticipantStatus";
import type { HikeDetails } from "../../types/hikes/HikeDetails";
import type { ApiResponse } from "../../types/common/ApiResponse";
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
    ): Promise<ApiResponse> {
        try{
            const res = await apiClient.post<ApiResponse>("hikes", {
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
                message
            };
        }
    },

    async getById(id: number): Promise<HikeDetails> {
        try{
            const res = await apiClient.get<HikeDetails>(`hikes/${id}`);
            return res.data;
        } catch(error){
            console.error("Error loading hike details: ", error);
            return {
                id: 0,
                organizer_id: 0,
                organizer_username: "",
                trail_id: 0,
                trail_name: "",
                name: "",
                description: "",
                scheduled_at: "",
                max_participants: 0,
                participants: []
            };
        }
    },

    async update(
        id: number, 
        trail_id: number, 
        name: string, 
        description: string, 
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
                message
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
                message
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
                message
            };
        }
    },
};