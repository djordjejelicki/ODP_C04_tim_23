import { apiClient } from "../apiClient";
import type { TerrainTag } from "../../types/trails/TrailDetails";
import type { ITerrainTagAPIService } from "./ITerrainTagAPIService";

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

    async create(name: string, description: string | null): Promise<boolean> {
        try{
            await apiClient.post("terrain-tags", {
                name,
                description
            });

            return true;
        } catch(error){
            console.error("Error creating terrain tag: ", error);
            return false;
        }
    },

    async remove(id: number): Promise<boolean> {
        try{
            await apiClient.delete(`terrain-tags/${id}`);
            return true;
        } catch(error){
            console.error("Error removin terrain tag: ", error);
            return false;
        }
    }
}