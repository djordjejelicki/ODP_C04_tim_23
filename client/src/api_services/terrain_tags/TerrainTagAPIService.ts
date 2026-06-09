import { apiClient } from "../apiClient";
import type { TerrainTag } from "../../types/terrain_tags/TerrainTag";
import type { ITerrainTagAPIService } from "./ITerrainTagAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import axios from "axios";

export const terrainTagApi: ITerrainTagAPIService = {
    async getAll(): Promise<TerrainTag[]> {
        try{
            const res = await apiClient.get<TerrainTag[]>("terrain-tags");
            return res.data;
        } catch(error){
            console.error("Error loading terrain tags: ", error);
            return [];
        }
    },

    async create(name: string, description: string): Promise<ApiResponse> {
        try{
            const res = await apiClient.post<ApiResponse>("terrain-tags", {
                name,
                description
            });

            return res.data;
        } catch(error){
            let message = "Failed to create terrain tag";

            if (axios.isAxiosError(error)){
                message = error.response?.data?.message || message;
            }

            return {
                success: false,
                message,
            };
        }
    },

    async remove(id: number): Promise<ApiResponse> {
        try{
            const res = await apiClient.delete<ApiResponse>(`terrain-tags/${id}`);
            return res.data;
        } catch(error){
            let message = "Failed to delete terrain tag";

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