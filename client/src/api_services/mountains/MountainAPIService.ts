import { apiClient } from "../apiClient";
import type { Mountain } from "../../types/mountains/Mountain";
import type { IMountainAPIService } from "./IMountainAPIService";

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
    ): Promise<boolean> {
        try{
            await apiClient.post("mountains", {
                name,
                country,
                region,
                height,
                description
            });
            return true;
        } catch(error){
            console.error("Error creating mountain: ", error);
            return false
        }
    },

    async update(
        id: number, 
        name: string, 
        country: string, 
        region: string | null, 
        height: number, 
        description: string | null
    ): Promise<boolean> {
        try{
            await apiClient.put(`mountains/${id}`,{
                name,
                country,
                region,
                height,
                description
            });

            return true
        } catch(error){
            console.log("Error updating mountain: ", error);
            return false;
        }     
    },
}