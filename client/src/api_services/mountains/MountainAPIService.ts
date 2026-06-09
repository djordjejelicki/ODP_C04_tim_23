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
        region: string, 
        height: number, 
        description: string 
    ): Promise<ApiResponse> {
        try{
            const res = await apiClient.post<ApiResponse>("mountains", {
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
            };
        }
    },

    async update(
        id: number, 
        name: string, 
        country: string, 
        region: string, 
        height: number, 
        description: string
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
            };
        }     
    },

    async remove(id: number): Promise<ApiResponse> {
        try{
            const res = await apiClient.delete<ApiResponse>(`mountains/${id}`);

            return res.data;
        } catch (error){
            let message = "Failed to delete mountain";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message;
            }

            return{
                success: false,
                message,
            }
        }
    },
}