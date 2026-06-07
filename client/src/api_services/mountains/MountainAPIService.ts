import { apiClient } from "../apiClient";
import type { Mountain } from "../../types/mountains/Mountain";
import type { IMountainAPIService } from "./IMountainAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import axios from "axios";

export const mountainApi: IMountainAPIService = {
    async getAll(): Promise<Mountain[]> {
        try{
            const res = await apiClient.get<Mountain[]>("mountains");
            return res.data;
        } catch(error){
            console.error("Error loading mountains: ", error);
            return [];
        }
    },

    async create(
        name: string, 
        country: string, 
        region: string | null, 
        height: number, 
        description: string | null
    ): Promise<ApiResponse<Mountain>> {
        try{
            const res = await apiClient.post<ApiResponse<Mountain>>("mountains", {
                name,
                country,
                region,
                height,
                description
            });
            return res.data;
        } catch(error){
            let message = "Failed to create mountain";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message ;
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
        name: string, 
        country: string, 
        region: string | null, 
        height: number, 
        description: string | null
    ): Promise<ApiResponse> {
        try{
            const res = await apiClient.put<ApiResponse>(`mountains/${id}`,{
                name,
                country,
                region,
                height,
                description
            });

            return res.data;
        } catch(error){
            let message = "Failed to update mountain";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message ;
            }

            return {
                success: false,
                message,
                data: null
            };
        }     
    },
}