import { apiClient } from "../apiClient";
import type { Ascent } from "../../types/ascents/Ascent";
import type { IAscentAPIService } from "./IAscentAPIService";
import type { AscentDetails } from "../../types/ascents/AscentDetails";
import type { ApiResponse } from "../../types/common/ApiResponse";
import axios from "axios";

export const ascentApi: IAscentAPIService = {
    async getAll(): Promise<AscentDetails[]> {
        try{
            const res = await apiClient.get<AscentDetails[]>("ascents");
            return res.data;
        } catch(error){
            console.error("Error loading ascents: ", error);
            return [];
        }
    },

    async create(
        trail_id: number, 
        ascent_date: string, 
        duration_min: number, 
        note: string | null, 
        rating: number
    ): Promise<ApiResponse<Ascent>> {
        try{
            const res = await apiClient.post<ApiResponse<Ascent>>("ascents", {
                trail_id,
                ascent_date,
                duration_min,
                note,
                rating,
            });
            return res.data;
        } catch(error){
            let message = "Failed to create ascent";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message;
            }

            return {
                success: false,
                message,
                data: null
            };
        }
    },

    async remove(id: number): Promise<ApiResponse> {
        try{
            const res = await apiClient.delete<ApiResponse>(`ascents/${id}`);
            return res.data;
        } catch(error){
            let message = "Failed to delete ascent";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message;
            }

            return {
                success: false,
                message,
                data: null
            };
        }
    },

    async update(
        id: number, 
        ascent_date: string, 
        duration_min: number, 
        note: string | null, 
        rating: number, 
        trail_id: number
    ): Promise<ApiResponse> {
        try{
            const res = await apiClient.put<ApiResponse>(`ascents/${id}`,{
                ascent_date,
                duration_min,
                note,
                rating,
                trail_id,
            });

            return res.data;
        } catch(error){
            let message = "Failed to update ascent";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message;
            }

            return {
                success: false,
                message,
                data: null
            };
        }
    },
};