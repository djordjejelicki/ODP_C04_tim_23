import { apiClient } from "../apiClient";
import type { Ascent } from "../../types/ascents/Ascent";
import type { IAscentAPIService } from "./IAscentAPIService";
import type { AscentDetails } from "../../types/ascents/AscentDetails";

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
    ): Promise<boolean> {
        try{
            await apiClient.post("ascents", {
                trail_id,
                ascent_date,
                duration_min,
                note,
                rating,
            });
            return true;
        } catch(error){
            console.error("Error creating ascent: ", error);
            return false;
        }
    },

    async remove(id: number): Promise<boolean> {
        try{
            await apiClient.delete(`ascents/${id}`);
            return true;
        } catch(error){
            console.error("Error deleting ascent: ", error);
            return false;
        }
    },

    async update(
        id: number, 
        ascent_date: string, 
        duration_min: number, 
        note: string | null, 
        rating: number, 
        trail_id: number
    ): Promise<boolean> {
        try{
            await apiClient.put(`ascents/${id}`,{
                ascent_date,
                duration_min,
                note,
                rating,
                trail_id,
            });

            return true;
        } catch(error){
            console.error("Error updating ascent: ", error);
            return false;
        }
    },
};